"use strict";
/**
 * Preconds
 *  util.obj.Errors = Obj_Errors
 *  util.obj.Properties = Obj_Properties
 *  util.obj.Json = Json
 *  util.text.String = String
 */

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

  /**
   * To export depending on environment
   */
  static export(module, to_export) {
    if (typeof process !== "undefined") {
      module.exports = to_export;
    }
  }

  /**
   *
   * @param {function} constructor From an Object.protype.constructor
   * @param {*} values
   */
  get_property_values_errors(constructor, values) {
    let errs = {};

    {
      for (let key in values) {
        try {
          new constructor({
            key: values[key],
          });
        } catch (ex) {
          logger.warn =
            "Error setting " +
            key +
            "=" +
            values[key] +
            " to " +
            constructor.name +
            ": " +
            ex;

          errs[key] = ex;
        }
      }
    }

    return errs;
  }

  /**
   * Children must call super after defining their enumerable properties
   * @throws {Object { <prop_name : <err> }} If this.set raises error(s)
   */
  constructor(values = undefined) {
    /*
      TEMPLATE of what should be in overrding child(ren)
      super(values);

      // also calls this.set(values)
      this.properties = properties.props;
    }*/

    //
    // To handle set errors
    this.errs = new util.obj.Errors(this);

    /*
      Members updated that need to be stored in DB
      string[] : members name
    */
    this.updated_members = [];

    //
    // Temporary var
    // To set values with setter properties
    {
      Object.defineProperty(this, "vals_", {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
  }

  //
  // === PROPERTIES ===
  /**
   * To set Object's properties
   * To be called in child constructor
   *
   * @param{Obj_Properties} props
   */
  set properties(props) {
    {
      if (!props) {
        const msg = "No properties argument set";
        logger.error = msg;
        throw TypeError(msg);
      }

      if (typeof props !== "object") {
        const msg = "Properties argument must be an object (Properties.props)";
        logger.error = msg;
        throw TypeError(msg);
      }
    }

    /*
     If calling class is not final child => concat to existing
     for later final set
    */
    {
      // With 4th stack trace's line
      // (remove this and properties calls
      //   -> to get calling file)
      const caller = logger.constructor.get_caller_infos(2);

      if (caller.class_name !== this.constructor.name) {
        //
        // Store properties for later
        if (!this._prps_tmp) {
          Object.defineProperty(this, "_prps_tmp", {
            value: props,
            enumerable: false,
            writable: true,
            configurable: true,
          });
        } else {
          this._prps_tmp = util.obj.Properties.concat(
            this._prps_tmp, //parent
            props //child
          );
        }

        return;
      }
    }

    //
    //else
    /* 
      Calling class is the final one 
        => define properties
        => set values
    */
    {
      //
      // Store tmp properties
      {
        const properties = util.obj.Properties.concat(
          this._prps_tmp, //parent ; if empty, child is returned
          props //child
        );
        Object.defineProperties(this, properties);

        //
        // Remove temporary variable _prps_tmp
        {
          if (this._prps_tmp) {
            delete this._prps_tmp;
          }
        }
      }

      //
      // Set values
      {
        if (this.vals_) {
          try {
            this.set(this.vals_);
          } catch (obj_errs) {
            this.error =
              obj_errs.nb +
              " errors setting values (" +
              typeof obj_errs +
              " " +
              obj_errs.constructor.name +
              " : " +
              obj_errs.message +
              ")";
          }

          //
          // Remove temporary variable vals_
          {
            delete this.vals_;
          }
        }
      }
    }
  }

  clone() {
    return new this.prototype.constructor(this.get_cloned_JSON());
  }

  equals(obj, include_not_enumerable_props = true) {
    if (typeof obj === "undefined" || !(obj instanceof Obj)) {
      return false;
    }

    //
    // Process only enumerable properties
    {
      if (!include_not_enumerable_props) {
        for (let key in this) {
          if (!util.obj.Json.value_equals(this[key], obj[key])) {
            logger.log =
              key + " are different : " + this[key] + " !== " + obj[key];
            return false;
          }
        }

        return true;
      }
    }

    //
    // Process both enumerable and not enumerable properties
    {
      const props = Object.keys(this);
      for (let i = 0; i < props.length; i++) {
        const prop_name = props[i];
        if (this[prop_name] !== obj[prop_name]) {
          logger.log =
            prop_name +
            " are different : " +
            this[prop_name] +
            " !== " +
            obj[prop_name];
          return false;
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
   *                          Properties failed to be converted
   *                          to string are null
   */
  toJSON(include_not_enumerable_props = false, as_string = false) {
    let ret = {};

    //
    // Only enumerable properties
    {
      if (!include_not_enumerable_props) {
        for (const prop_name in this) {
          ret[prop_name] = util.obj.Json.to_json_value(this[prop_name]);

          if (as_string) {
            ret[prop_name] = util.text.String.to(ret[prop_name]);
          }
        }
        return true;
      }
    }

    //
    // Process both enumerable and not enumerable properties
    {
      const props = Object.keys(this);
      for (let i = 0; i < props.length; i++) {
        const prop_name = props[i];
        ret[prop_name] = util.obj.Json.to_json_value(this[prop_name]);

        if (as_string) {
          ret[prop_name] = util.text.String.to(ret[prop_name]);
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
  get_cloned_JSON(include_not_enumerable_props = true) {
    let ret = {};
    //
    // Only enumerable properties
    {
      if (!include_not_enumerable_props) {
        for (let key in this) {
          ret[key] = util.obj.Json.clone_value(this[key]);

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
    }

    //
    // Process both enumerable and not enumerable properties
    {
      const props = Object.keys(this);
      for (let i = 0; i < props.length; i++) {
        const prop_name = props[i];
        ret[prop_name] = util.obj.Json.clone_value(this[prop_name]);
      }
    }

    return ret;
  }

  //
  // === LOGS ===

  /**
   * Shorthand to logger.debug
   * Log specified message as debug
   * Class name is prefixed to log
   */
  set debug(msg) {
    logger.debug = msg;
  }

  /**
   * Shorthand to logger.info
   * Log specified message as info
   * Class name is prefixed to log
   */
  set info(msg) {
    logger.info = msg;
  }

  /**
   * Shorthand to logger.error
   * Log specified message as error
   * Class name is prefixed to log
   */
  set error(msg) {
    logger.error = msg;
  }

  /**
   * Shorthand to logger.fatal
   * Log specified message as fatal
   * Class name is prefixed to log
   */
  set fatal(msg) {
    logger.fatal = msg;
  }

  /**
   * Shorthand to logger.log
   * Log specified message
   * Class name is prefixed to log
   */
  set log(msg) {
    logger.log = msg;
  }

  /**
   * Shorthand to logger.trace
   * Log specified message as trace
   * Class name is prefixed to log
   */
  set trace(msg) {
    logger.trace = msg;
  }

  /**
   * Shorthand to logger.warn
   * Log specified message as warning
   * Class name is prefixed to log
   */
  set warn(msg) {
    logger.warn = msg;
  }

  //
  // === ERRORS ===
  //
  // === GETTERS ===
  /**
   * @return{integer}
   */
  get nb_errs() {
    return this.errs.nb;
  }

  /**
   * Return all errors as a single string
   *
   * @return{string}
   */
  get errs_str() {
    return this.errs.str;
  }

  /**
   * Get error associated to specified property name
   *
   * @return{str}
   */
  get_err_str(prop_name, include_stack = false) {
    return this.errs.get_str(prop_name, include_stack);
  }

  //
  // === SETTERS ===
  /**
   *
   * @param {string} prop_name Property's name which raised the error
   * 
  /**
   *
   * @param {string} prop_name Property's name which raised the error
   * @param {*} error Error raised
   * @param {*} value_which_raised  Value which raised the error
   */
  add_error(prop_name, error, value_which_raised = undefined) {
    this.errs.set_error(prop_name, error, value_which_raised);
  }

  /**
   * Convert errors string set in this.errs to their localized translation
   *
   * @param {object} global_texts Must have 2 properties :
   *                                - default
   *                                    with an errors property
   *                                - localized {optional}
   *                                    with an errors property
   * @param {object | optional} class_texts Must have 2 properties :
   *                                - default
   *                                    with an errors property
   *                                - localized {optional}
   *                                    with an errors property
   *
   * @return {object} set_res - nb_set {integer} Number of localized errors
   *                           - nb_nset {integer} Number of not localized errors
   *
   * @throws {string} If global_texts is undefined or has no errors property
   */
  localize_errors(global_texts, class_texts = global_texts[classOf(this)]) {
    return this.errs(global_texts, class_texts);
  }

  //
  // === GETTERS / SETTERS ===
  /**
   * Set every members in obj but functions
   *
   * @param {json|object} values
   * @param {object} set_res
   *
   * @return {object} number of set/not set members which are not a function
   *                    3 values :
   *                                nb_set,
   *                                nb_nset,
   *                                nb_nset_ro Not set because are read-only
   *
   * @throws{Obj_Errors} - If setting a property raises an error. Setting all
   *                        properties is attempted before throwing the error
   */
  set(values, set_res = { nb_set: 0, nb_nset: 0, nb_nset_ro: 0 }) {
    let that = this;
    let nb_errs = 0;

    {
      const props = Object.keys(values);
      //
      // Iterate values
      for (let i = 0; i < props.length; i++) {
        const prop_name = props[i];

        //
        // If prop_name is an expected by his
        if (Object.getOwnPropertyDescriptor(this, prop_name) != null) {
          if (set_value(prop_name, values[prop_name])) {
            set_res.nb_set++;
          }
        }
        //
        // Value is not an object's property
        else {
          set_res.nb_nset++;
        }
      }
    }

    if (nb_errs > 0) {
      throw this.errs;
    }

    return set_res;

    function set_value(prop_name, value) {
      try {
        const old_val = that[prop_name];
        //
        // Set value and check if any modification occurs
        // to mark prop_name as updated member
        if (
          old_val != (that[prop_name] = values[prop_name]) &&
          //and if not just a new object instance (clone, fetched from DB...)
          typeof old_val !== "undefined"
        ) {
          that.push_updated_member(prop_name);
        }
        return true;
      } catch (ex) {
        nb_errs++;

        //
        // Store the error and value which raised it in that.errs
        {
          if (ex instanceof TypeError) {
            //
            // Property is read-only
            set_res.nb_nset_ro++;
            that.add_error(prop_name, "Read-only", value);
          } else {
            that.add_error(prop_name, ex, value);
          }
        }

        that.warn =
          "Could not set property " +
          prop_name +
          " to " +
          value +
          " : " +
          ex +
          " - Current value : " +
          that[prop_name];
        return false;
      }
    }
  }

  /**
   * To get multiple asynchronous get values
   *
   * @param {Promise[]} get_promises All getter promises then method
   *                                  to call when alls are got
   *                                  This method takes as many arguments
   *                                  as array length :
   *                                  - every requested property value
   *                                  - errs {object[get_promises.length-1]}
   *                                  In the same order as requested properties ,
   *                                  eventual errors
   *                                  (eg. errs[0] can be undefined when errs[1]
   *                                    is not.
   *                                    If 3 properties are requested
   *                                    (get_promises.length = 4)
   *                                     and arg2 === undefined
   *                                      => errs[2] is probably defined)
   *
   * @throws - If argument is not an array
   *          - If last array's element is not a function
   */
  set multi(get_promises) {
    if (!(get_promises instanceof Array)) {
      const msg = "Argument should be an Array of Promise";
      logger.error = "Obj#set multi " + msg;
      throw msg;
    }

    let resps = [];
    let errs = [];
    let nb_got = 0;
    for (let i = 0; i < get_promises.length - 1; i++) {
      const prom_idx = i;
      let prom = get_promises[prom_idx];
      {
        if (!(prom instanceof Promise)) {
          const msg = "Array's element " + prom_idx + " is not a Promise";
          logger.error = "Obj#set multi " + msg;

          if (prom_idx >= errs.length) {
            errs.length = prom_idx + 1;
          }
          errs[prom_idx] = err;
          continue;
        }
      }

      prom.then(
        function (value) {
          if (prom_idx >= resps.length) {
            resps.length = prom_idx + 1;
          }
          resps[prom_idx] = value;
          on_got();
        },
        function (err) {
          if (prom_idx >= errs.length) {
            errs.length = prom_idx + 1;
          }
          errs[prom_idx] = err;
          on_got();
        }
      );
    }

    function on_got() {
      nb_got++;
      if (nb_got === get_promises.length - 1) {
        let cbk = get_promises[get_promises.length - 1];
        //
        // Check preconds
        {
          if (typeof cbk !== "function") {
            const msg = "Last array's element is not a method";
            logger.error = "Obj#set multi " + msg;
            throw msg;
          }
        }

        cbk(...resps, errs);
      }
    }
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
        logger.warn =
          "Obj#get_redis_array Member " +
          member +
          " has wrong type " +
          value_type +
          " ; skipping it";
        continue;
      }
      logger.log =
        "Obj#get_redis_array Member " + member + " type : " + value_type;

      //
      // Redis member key
      {
        if (!key_members_to_redis[member]) {
          logger.error =
            "Obj#get_redis_array No Redis key format associated to member " +
            member;
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
