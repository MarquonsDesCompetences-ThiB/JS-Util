"use strict";
/**
 * Preconds
 *  util.obj.Errors = Obj_Errors
 *  util.obj.Json = Json
 */
/**
 * Every children should have one listing their not enumerable properties to :
 *  - avoid cyclic references (for ex. with toJSON)
 *  - enable to set through Obj.set(...)
 */
//const not_enumerable_props = [];

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
   * Children must call super after defining their enumerable properties
   * @throws {Object { <prop_name : <err> }} If this.set raises error(s)
   */
  constructor(values = undefined, update_members = false) {
    /*
      TEMPLATE of what should be in overrding child(ren)
      super(values, update_members);

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
      Object.defineProperty(this, "upd_membrs_", {
        value: update_members,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
  }

  //
  // === PROPERTIES ===
  /**
   * @param{object} props 2 properties : enums, not_enums
   */
  set properties(props) {
    //
    // Enumerable Members
    if (props.enums) {
      Object.defineProperties(this, props.enums);
    }

    /*
     If calling class is not final child => concat to existing
     for later final set
    */
    // With 4th stack trace's line
    // (remove c and not_enumerable_props calls
    //   -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2);

    this.log =
      "Caller name : " +
      caller.class_name +
      " - Constructor : " +
      this.constructor.name;

    if (caller.class_name !== this.constructor.name) {
      //
      // Not Enumerable Members
      if (props.not_enums) {
        //
        // Store not_enum_props for later
        if (!this.nenums_props_tmp_) {
          Object.defineProperty(this, "nenums_props_tmp_", {
            value: [],
            enumerable: false,
            writable: true,
            configurable: true,
          });
        }
        this.nenums_props_tmp_.concat(props.not_enums);
      }

      return;
    }
    //
    //else
    /* 
      Calling class is the final one 
        => set not_enum_props_
        => set values
    */
    // Not Enumerable Members
    {
      let arg_nenum = props.not_enums ? props.not_enums : [];
      this.not_enumerable_props = this.nenums_props_tmp_
        ? this.nenums_props_tmp_.concat(arg_nenum)
        : arg_nenum;
    }

    //
    // Set values
    {
      if (this.vals_) {
        try {
          this.set(this.vals_, this.upd_membrs_);
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
        // Remove temporary variables vals_/upd_membrs_
        {
          delete this.vals_;
          if (this.upd_membrs_ != null) {
            delete this.upd_membrs_;
          }
        }
      }
    }
  }

  //
  // === NOT_ENUMARABLE_PROPS ==
  get not_enumerable_props() {
    return this.not_enum_props_;
  }

  /**
   * To be called by this.set properties
   */
  set not_enumerable_props(not_enumerable_props = []) {
    if (this.not_enum_props_) {
      this.error = "not_enumerable_props already set ; skipping this one";
      return;
    }

    const props = !this.nenums_props_tmp_
      ? not_enumerable_props
      : this.nenums_props_tmp_.concat(not_enumerable_props);

    Object.defineProperty(this, "not_enum_props_", {
      value: props,
      enumerable: false,
      writable: false,
      configurable: false,
    });

    if (this.nenums_props_tmp_) {
      delete this.nenums_props_tmp_;
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
    // Process enumerable properties
    {
      for (let key in this) {
        if (!util.obj.Json.value_equals(this[key], obj[key])) {
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
        ret[prop_name] = util.obj.Json.to_json_value(this[prop_name]);
      }
    }

    //
    // Fetch not enumerable properties
    {
      if (include_not_enumerable_props) {
        for (let i = 0; i < this.not_enumerable_props.length; i++) {
          const prop_name = this.not_enumerable_props[i];
          ret[prop_name] = util.obj.Json.to_json_value(this[prop_name]);
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

        ret[key] = util.obj.Json.to_json_value(this[key]);

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

          ret[prop_name] = util.obj.Json.to_json_value(this[prop_name]);

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
  get_cloned_JSON(include_not_enumerable_props = true) {
    let ret = {};

    //
    // Clone enumerable properties
    {
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

  //
  // === LOGS ===

  /**
   * Log specified message as debug
   * Class name is prefixed to log
   */
  set debug(log_msg) {
    // with 3rd stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2, true);

    logger.debug(
      caller.class_name +
        "#" +
        caller.method_name +
        " " +
        log_msg +
        " (" +
        caller.line +
        ")"
    );
  }

  /**
   * Log specified message as error
   * Class name is prefixed to log
   */
  set error(log_msg) {
    // with 3rd stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2, true);

    logger.error(
      caller.class_name +
        "#" +
        caller.method_name +
        " " +
        log_msg +
        " (" +
        caller.line +
        ")"
    );
  }

  /**
   * Log specified message
   * Class name is prefixed to log
   */
  set log(log_msg) {
    // with 3rd stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2, true);

    logger.log(
      caller.class_name +
        "#" +
        caller.method_name +
        " " +
        log_msg +
        " (" +
        caller.file_name +
        ", " +
        caller.line +
        ")"
    );
  }

  /**
   * Log specified message as trace
   * Class name is prefixed to log
   */
  set trace(log_msg) {
    // with 3rd stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2, true);

    logger.trace(
      caller.class_name +
        "#" +
        caller.method_name +
        " " +
        log_msg +
        " (" +
        caller.file_name +
        ", " +
        caller.line +
        ")"
    );
  }

  /**
   * Log specified message as warning
   * Class name is prefixed to log
   */
  set warn(log_msg) {
    // with 3rd stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = util.obj.Errors.get_caller_infos(2, true);

    logger.warn(
      caller.class_name +
        "#" +
        caller.method_name +
        " " +
        log_msg +
        " (" +
        caller.file_name +
        ", " +
        caller.line +
        ")"
    );
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
    return this.errs.strs;
  }

  /**
   * Get error associated to specified property name
   *
   * @return{str}
   */
  set err_str(prop_name) {
    return (this.err_str = prop_name);
  }

  //
  // === SETTERS ===
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
   * Children class should override it to concatenate their not_enumerable_props
   *
   * @param {json|object} values
   * @param {object} set_res
   * @param {bool} update_members If true, specifies set m
   * mbers into update_members
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
  set(
    values,
    update_members = false,
    set_res = { nb_set: 0, nb_nset: 0, nb_nset_ro: 0 }
  ) {
    this.log = "Will set values";
    let that = this;
    let nb_errs = 0;

    //
    // Set enumerable properties
    {
      for (const prop_name in values) {
        const type = typeof values[prop_name];
        this.log = "Enumerable : " + prop_name + " of type " + type;

        if (
          type !== "undefined" &&
          type !== "function" &&
          this.propertyIsEnumerable(prop_name) //property exists
        ) {
          this.log =
            "Setting enumerable " + prop_name + " = " + values[prop_name];

          let set_ok = false;
          try {
            set_ok = set_value(prop_name, values[prop_name]);
          } catch (ex) {
            that.error = ex.message;
          }
          if (set_ok) {
            if (update_members) {
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

    try {
      //
      // Set non enumerable properties
      {
        for (let i = 0; i < this.not_enumerable_props.length; i++) {
          const prop_name = this.not_enumerable_props[i];
          this.log = "Not enumerable " + prop_name;
          if (this.hasOwnProperty(prop_name)) {
            this.log =
              "Setting not enumerable " + prop_name + " of type " + type;
            if (set_value(prop_name, values[prop_name]) && update_members) {
              this.push_updated_member(prop_name);
            }
          }
        }
      }
    } catch (ex) {
      that.error = ex.message;
    }

    function set_value(prop_name, value) {
      that.log = "set_value(prop_name, value)";
      try {
        that.log =
          "set_value to : " +
          prop_name +
          " - " +
          JSON.stringify(Object.getOwnPropertyDescriptor(that, prop_name));

        that[prop_name] = values[prop_name];
        set_res.nb_set++;
        return true;
      } catch (ex) {
        that.log = "catched : " + ex.constructor.name;
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

    if (nb_errs > 0) {
      throw this.errs;
    }

    return set_res;
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
      logger.error("Obj#set multi " + msg);
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
          logger.error("Obj#set multi " + msg);

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
            logger.error("Obj#set multi " + msg);
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
