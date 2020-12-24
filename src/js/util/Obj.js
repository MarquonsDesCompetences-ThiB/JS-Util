"use strict";

if (typeof process !== "undefined") {
  global.Json = require(process.env.SRC_ROOT + "dist/js/util/Json");
}

class Obj {
  /**
   *
   * @param {string[]} owned_members Names of members in this
   *                                              which are owned by this
   *                                              => they never raise a cyclic
   *                                              reference error
   */
  constructor(owned_members = []) {
    this.owned_members = owned_members;

    /*
      Members updated that need to be stored in DB
      string[] : members name
    */
    this.updated_members = [];
  }

  static clone(obj) {
    switch (typeof obj) {
      case "boolean":
        return new Boolean(obj);
        break;

      case "number":
        return obj + 0;
        break;

      case "string":
        return obj + "";
        break;

      case "object":
        if (obj instanceof Array) {
          let arr = [];
          for (let i = 0; i < obj.length; i++) {
            let clone = Obj.clone(obj[i]);
            if (clone) {
              arr.push(clone);
            } else {
              arr.push(obj[i]);
            }
          }
        } else if (obj.get_cloned_JSON) {
          return obj.get_cloned_JSON();
        }
        break;
    }
    // function | object without get_cloned_JSON()
    return undefined;
  }

  clone() {
    return new Obj(this.get_cloned_JSON());
  }

  equals(obj) {
    if (typeof obj === "undefined" || !(obj instanceof Obj)) {
      return false;
    }

    for (let key in this) {
      //
      //process cyclic reference
      if (!this.owned_members.includes(key)) {
        if (this[key] != obj[key]) {
          return false;
        }
      }
      //
      // other value
      else if (!Json.value_equals(this[key], obj[key])) {
        logger.log(
          "Obj#equals members " +
            key +
            " are different : " +
            this[key] +
            " !== " +
            obj[key]
        );
        return false;
      }
    }

    return true;
  }

  //
  // === GETTERS / SETTERS ===
  /**
   *
   * @param {bool} only_owned_members If true,
   *                                key members in this.cycle_reference_members
   *                                aren't converted to simple Json object
   *                                => they're returned as is
   * @param {bool} as_string  If true, everything is processed by
   *                          this.get_JSON_as_string
   *                          => numbers are converted to string
   */
  get_JSON(only_owned_members = false, as_string = false) {
    if (as_string) {
      return this.get_JSON_as_string(only_owned_members);
    }

    let ret = {};

    for (let key in this) {
      //if is undefined or null
      if (this[key] == null) {
        continue;
      }

      if (this.owned_members.includes(key)) {
        ret[key] = Json.to_json_value(this[key], only_owned_members);

        continue;
      }
      //else : cycle member
      if (!only_owned_members) {
        ret[key] = this[key];
      }
    }

    return ret;
  }

  get_JSON_as_string(only_owned_members = false) {
    let ret = {};

    for (let key in this) {
      //if is undefined or null
      if (this[key] == null) {
        continue;
      }

      if (this.owned_members.includes(key)) {
        ret[key] = Json.to_json_value(this[key], only_owned_members);
      } else {
        if (!only_owned_members) {
          ret[key] = this[key];
        }
      }

      //to string conversion
      if (typeof ret[key] === "number" || ret[key] instanceof Number) {
        ret[key] = ret[key] + "";
      }
    }

    return ret;
  }

  /**
   * Clone every members in this but functions
   * and keys in this.cycle_reference_members
   *
   * Key members in this.cycle_reference_members
   * aren't cloned => their reference is returned as is
   * @return {json}
   */
  get_cloned_JSON() {
    let ret = {};

    for (let key in this) {
      if (this.owned_members.includes(key)) {
        ret[key] = Json.clone_value(this[key]);

        /*const type = typeof ret[key];
      if (type !== "undefined") {
        ret.nb_cloned++;
      }
      //type = undefined
      else if (typeof this[key] !== "function") {
        ret.nb_not_cloned++;
      }*/
      } else {
        ret[key] = this[key];
      }
    }
    return ret;
  }

  /**
   * Set every members in obj but functions
   *
   * @param {json|object} obj
   * @param {bool} update_members If true, specifies set members into update_members
   *
   * @return number of set/not set members which are not a function
   *          3 values : nb_set, nb_not_set, that
   */
  set(obj, update_members = false) {
    let ret = {
      nb_set: 0,
      nb_not_set: 0,
      that: this,
    };

    if (!obj) {
      return ret;
    }

    for (const key in this) {
      const this_type = typeof this[key];
      if (
        this_type !== undefined &&
        this_type !== "function" &&
        obj[key] !== undefined
      ) {
        this[key] = obj[key];
        ret.nb_set++;
        if (update_members) {
          this.push_updated_member(key);
        }
      } else {
        ret.nb_not_set++;
      }
    }

    return ret;
  }

  //
  // === DB SYNCHRONIZATION ===
  /**
   * Return updated members values (identified by this.updated_members)
   * to be Redis set compliant => 2n values alternating
   * member key (Redis structure format), member value
   *
   * @param{json} Json associating ever member with its Redis format
   *
   * @return{string[]}
   */
  get_redis_array(key_members_to_redis) {
    let arr = [];

    for (let i = 0; i < this.updated_members.length; i++) {
      let member = this.updated_members[i];
      const value = this[member];
      const value_type = typeof value;

      if (
        value === null ||
        value_type === "undefined" ||
        (value_type === "object" && !(value instanceof Date))
      ) {
        logger.warn(
          "Obj#get_redis_array Member " +
            member +
            " has wrong type " +
            value_type +
            " ; skipping it"
        );
        continue;
      }
      logger.log(
        "Obj#get_redis_array Member " + member + " type : " + value_type
      );

      //
      // Redis member key
      {
        if (!key_members_to_redis[member]) {
          logger.error(
            "Obj#get_redis_array No Redis key format associated to member " +
              member
          );
          continue;
        }
        arr.push(key_members_to_redis[member]);
      }

      //
      // Member's value
      {
        let string_value = value;
        // number to string
        if (value_type === "number" || value instanceof Number) {
          string_value = value + "";
        }
        // Date to string
        else if (value instanceof Date) {
          string_value = value.toString();
        }

        arr.push(string_value);
      }
    }

    return arr;
  }

  flush_updated_members() {
    this.updated_members = [];
  }

  /**
   * Push member_name in this.updated_members if it's not already inside
   * @param {string} member_name
   */
  push_updated_member(member_name) {
    if (!this.updated_members.includes(member_name)) {
      this.updated_members.push(member_name);
    }
  }

  set_updated_members(object_memberNames_to_DB_format) {
    for (const member_name in object_memberNames_to_DB_format) {
      this.push_updated_member(member_name);
    }
  }
}

if (typeof process !== "undefined") {
  module.exports = Obj;
}
