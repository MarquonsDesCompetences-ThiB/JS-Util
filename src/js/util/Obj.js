"use strict";

if (typeof process !== "undefined") {
  global.Json = require(process.env.SRC_ROOT + "dist/js/util/Json");
}

/**
 * Every children should have one listing their not enumerable properties to :
 *  - avoid cyclic references (for ex. with toJSON)
 *  - enable to set through Obj.set(...)
 */
const not_enumerable_props = [];

class Obj {
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

  static get_property_values_errors(constructor, values) {
    let errs = {};

    //
    // Process enumerable properties
    {
      for (let key in values) {
        try {
          new constructor({
            key: values[key],
          });
        } catch (ex) {
          logger.warn(
            "Obj#get_property_values_errors Error setting " +
              key +
              "=" +
              values[key] +
              " to " +
              constructor +
              ": " +
              ex
          );

          errs[key] = ex;
        }
      }
    }

    //
    // Process not enumerable properties
    {
      for (let key in this.not_enumerable_props) {
        if (!values[key]) {
          continue;
        }
        //
        // else try setting the value
        try {
          new constructor({
            key: values[key],
          });
        } catch (ex) {
          logger.warn(
            "Obj#get_property_values_errors Error setting " +
              key +
              "=" +
              values[key] +
              " to " +
              constructor +
              ": " +
              ex
          );

          errs[key] = ex;
        }
      }
    }

    return errs;
  }

  /**
   * @throws {Object { <prop_name : <err> }} If this.set raises error(s)
   */
  constructor(values = undefined, update_members = false) {
    if (!this.not_enumerable_props) {
      this.not_enumerable_props = not_enumerable_props;
    }

    /*
      Members updated that need to be stored in DB
      string[] : members name
    */
    this.updated_members = [];

    const res = this.set(values, update_members);
    //
    // If at least one set error defined => throw errs
    for (const key in res.errs) {
      throw res;
    }
  }

  set not_enumerable_props(not_enumerable_props = []) {
    Object.defineProperty(this, "not_enumerable_props", {
      value: not_enumerable_props,
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }

  clone() {
    return new Obj(this.get_cloned_JSON());
  }

  equals(obj, include_not_enumerable_props = true) {
    if (typeof obj === "undefined" || !(obj instanceof Obj)) {
      return false;
    }

    //
    // Process enumerable properties
    {
      for (let key in this) {
        if (!Json.value_equals(this[key], obj[key])) {
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
    }

    //
    // Process not enumerable properties
    {
      if (include_not_enumerable_props) {
        for (let i = 0; i < this.not_enumerable_props.length; i++) {
          const prop_name = this.not_enumerable_props[i];
          if (this[prop_name] !== obj[prop_name]) {
            logger.log(
              "Obj#equals Not enumerable members " +
                prop_name +
                " are different : " +
                this[prop_name] +
                " !== " +
                obj[prop_name]
            );
            return false;
          }
        }
      }
    }

    return true;
  }

  //
  // === GETTERS / SETTERS ===
  /**
   *
   *
   * @param {bool} include_not_enumerable_props Properties to also return and which are not enumerables
   * @param {bool} as_string  If true, everything is processed by
   *                          this.get_JSON_as_string
   *                          => numbers are converted to string
   */
  toJSON(include_not_enumerable_props = false, as_string = false) {
    if (as_string) {
      return this.toJSON_as_strings(include_not_enumerable_props);
    }

    let ret = {};

    //
    // Fetch enumerable properties
    {
      for (const prop_name in this) {
        ret[prop_name] = Json.to_json_value(this[prop_name]);
      }
    }

    //
    // Fetch not enumerable properties
    {
      if (include_not_enumerable_props) {
        for (let i = 0; i < this.not_enumerable_props.length; i++) {
          const prop_name = this.not_enumerable_props[i];
          ret[prop_name] = Json.to_json_value(this[prop_name]);
        }
      }
    }

    return ret;
  }

  toJSON_as_strings(include_not_enumerable_props = false) {
    let ret = {};

    //
    // Fetch enumerable properties
    {
      for (let key in this) {
        //if is undefined or null
        if (this[key] == null) {
          continue;
        }

        ret[key] = Json.to_json_value(this[key]);

        //to string conversion
        if (typeof ret[key] === "number" || ret[key] instanceof Number) {
          ret[key] = ret[key] + "";
        }
      }
    }

    //
    // Fetch not enumerable properties
    {
      if (include_not_enumerable_props) {
        for (let i = 0; i < this.not_enumerable_props; i++) {
          const prop_name = this.not_enumerable_props[i];
          //if is undefined or null
          if (this[prop_name] == null) {
            continue;
          }

          ret[prop_name] = Json.to_json_value(this[prop_name]);

          //to string conversion
          if (
            typeof ret[prop_name] === "number" ||
            ret[prop_name] instanceof Number
          ) {
            ret[prop_name] = ret[prop_name] + "";
          }
        }
      }
    }

    return ret;
  }

  /**
   * Clone every enumerable members in this but functions
   *
   * Not enumerable properties are not cloned
   *  => their reference is returned as is
   * @return {json}
   */
  get_cloned_JSON(include_not_enumerable_props = false) {
    let ret = {};

    //
    // Clone enumerable properties
    {
      for (let key in this) {
        ret[key] = Json.clone_value(this[key]);

        /*const type = typeof ret[key];
      if (type !== "undefined") {
        ret.nb_cloned++;
      }
      //type = undefined
      else if (typeof this[key] !== "function") {
        ret.nb_not_cloned++;
      }*/
      }
    }

    //
    // Reference not enumerable properties
    {
      if (include_not_enumerable_props) {
        for (let i = 0; i < this.not_enumerable_props.length; i++) {
          const prop_name = this.not_enumerable_props[i];
          ret[prop_name] = this[prop_name];
        }
      }
    }

    return ret;
  }

  /**
   * Set every members in obj but functions
   * Children class should override it to concatenate their not_enumerable_props
   *
   * @param {json|object} values
   * @param {object} set_res
   * @param {bool} update_members If true, specifies set m
   * mbers into update_members
   *
   * @return {object} number of set/not set members which are not a function
   *                    4 values :
   *                                errs : { <prop_name> : <err> }
   *                                nb_set,
   *                                nb_nset,
   *                                nb_nset_ro Not set because are read-only
   */
  set(
    values,
    update_members = false,
    set_res = { errs: {}, nb_set: 0, nb_nset: 0, nb_nset_ro: 0 }
  ) {
    let that = this;
    //
    // Set enumerable properties
    {
      for (const prop_name in values) {
        const type = typeof values[prop_name];
        if (type !== "undefined" && type !== "function" && this[prop_name]) {
          // prevent value to be set twice
          if (!this.not_enumerable_props.includes(prop_name)) {
            if (set(prop_name, values[prop_name]) && update_members) {
              this.push_updated_member(prop_name);
            }
          }
        }
        //
        // Value is not an object's property
        else {
          set_res.nb_nset++;
        }
      }
    }

    //
    // Set non enumerable properties
    {
      for (let i = 0; i < this.not_enumerable_props.length; i++) {
        const prop_name = this.not_enumerable_props[i];
        if (values[prop_name]) {
          if (set(prop_name, values[prop_name]) && update_members) {
            this.push_updated_member(prop_name);
          }
        }
      }
    }

    function set(prop_name, value) {
      try {
        this[prop_name] = values[prop_name];
        set_res.nb_set++;
        return true;
      } catch (ex) {
        if (ex instanceof TypeError) {
          //
          // Property is read-only
          set_res.nb_nset_ro++;
        } else {
          set_res.errs[prop_name] = ex;
        }

        const msg =
          "Could not set property " +
          prop_name +
          " to " +
          value +
          " : " +
          ex +
          " - Current value : " +
          that[prop_name];
        logger.warn("Obj#set " + msg);
        return false;
      }
    }

    return set_res;
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
