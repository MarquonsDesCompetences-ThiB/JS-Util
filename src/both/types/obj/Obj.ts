"use strict";
import * as json from "@both_types/json.js";
import * as string from "@both_types/string/_string.js";
import { Obj_props } from "./_props/Obj_props.js";
import { text } from "@src/both/_both.js";
import { is_primitive } from "../type.js";
import * as props_specs from "./specifications/_specifications.js";

/**
 * Preconds
 *  util.obj.Errors = Obj_Errors
 *  json = json
 *  string = String
 */
export class Obj extends Obj_props {
  //
  // === OBJECT LIKE STATIC FUNCTIONS ===
  static keys(object: Obj, props_flags = props_specs.eSpec.ALL_NOT_JSONIFYING) {
    return props_specs.keys(object, props_flags);
  }

  static values(
    object: Obj,
    props_flags = props_specs.eSpec.ALL_NOT_JSONIFYING
  ) {
    return props_specs.values(object, props_flags);
  }

  static entries(
    object: Obj,
    props_flags = props_specs.eSpec.ALL_NOT_JSONIFYING
  ) {
    return props_specs.entries(object, props_flags);
  }

  /**
   * To export depending on environment
   * Must be called by the child class
   */
  static set export(module) {
    Object.seal(this);

    if (typeof process !== "undefined" && module) {
      //module.exports = this.constructor ? this.constructor : this;
      module.exports = this;
    }
  }

  /**
   * To be called by the main class (the one handling methods)
   *
   * === 2 arguments
   * @param {object} properties {static, instances} or just instances ones
   * @param {* | undefined} module Module with export setter
   *
   * === 3 arguments
   * @param {object} instances_properties
   * @param {object} statics_properties
   * @param {*} module Module with export setter
   */
  static init(properties, module = undefined) {
    let { statics = undefined, instances = undefined } = properties;
    {
      //
      // statics is set as 2nd proeprty, module as third
      if (arguments.length >= 3) {
        instances = properties;
        statics = module;
        module = arguments[3];
      } else if (!instances) {
        instances = properties;
      }
    }

    //
    // Define static properties from properties.statics
    {
      if (statics != null) {
        //
        // Iterate properties to set configurable/enumerable/writable
        // to false when they're not specified
        Object.keys(statics).forEach((name) => {
          if (statics[name].configurable == null) {
            statics[name].configurable = false;
          }

          if (statics[name].enumerable == null) {
            statics[name].enumerable = false;
          }

          if (
            statics[name].writable == null &&
            /* if any accessor, no writable configuration can be set :
                "TypeError: Invalid property descriptor. Cannot both specify 
                accessors and a value or writable attribute
            */
            !statics[name].get &&
            !statics[name].set
          ) {
            statics[name].writable = false;
          }
        });

        //
        // Set statics properties
        {
          Object.defineProperties(this, statics);
        }
      }
    }

    //
    // Set instances' properties descriptors
    {
      if (instances != null) {
        let nenums = new Set(); //not enumerable keys

        //
        // Iterate properties to set configurable/enumerable/writable
        // to false when they're not specified
        Object.keys(instances).forEach((name) => {
          if (instances[name].configurable == null) {
            instances[name].configurable = false;
          }

          //
          // enumerable
          {
            if (instances[name].enumerable == null) {
              instances[name].enumerable = false;
            }

            if (!instances[name].enumerable) {
              nenums.add(name);
            }
          }

          if (
            instances[name].writable == null &&
            /* if any accessor, no writable configuration can be set :
                "TypeError: Invalid property descriptor. Cannot both specify 
                accessors and a value or writable attribute
            */
            !instances[name].get &&
            !instances[name].set
          ) {
            instances[name].writable = false;
          }
        });

        //
        // Set instances properties
        {
          Object.defineProperty(this, Symbol.for(this.name + "_properties"), {
            enumerable: false,
            value: instances,
          });

          //
          // Not enumerable ones
          {
            Object.defineProperty(this, Symbol.for(this.name + "_nenums"), {
              enumerable: false,
              value: nenums,
            });
          }
        }
      }
    }

    Object.seal(this);

    if (module) {
      module.exports = this;
    }
  }

  /**
   * Must be called by the Obj child class to test values on
   * @param {*} values
   */
  static get_property_values_errors(class_constructor, values) {
    let errs = {};

    {
      for (let key in values) {
        try {
          new class_constructor({
            [key]: values[key],
          });
        } catch (ex) {
          logger.warn =
            "Error setting " +
            key +
            "=" +
            values[key] +
            " to " +
            this.name +
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
  constructor() {
    super();
    //this.init_properties();
  }

  //
  // === PROPERTIES ===
  /**
   * Iteratively initialize properties from Obj to final overrider
   */
  init_properties() {
    let protos = [Object.getPrototypeOf(this)];

    //
    // Fetch the prototypes chain
    for (let i = 1; protos[i - 1].class.name !== "Obj"; i++) {
      protos.push(Object.getPrototypeOf(protos[i - 1]));
    }

    //
    // For each prototype, define its properties from Obj to final
    {
      let proto;
      while ((proto = protos.pop())) {
        const class_ = Object.getPrototypeOf(proto);
        const props =
          class_.constructor[
            Symbol.for(class_.constructor.name + "_properties")
          ];

        try {
          Object.defineProperties(proto, props);
        } catch (ex) {
          const msg =
            "Could not set properties of " +
            proto.constructor.name +
            " : " +
            ex +
            "\n Properties :" +
            JSON.stringify(props);

          logger.error = msg;
          throw msg;
        }
      }
    }
  }

  clone(props_flags = props_specs.eSpec.ALL_JSONIFYING, explicit?: boolean) {
    const cloned_obj = this.get(props_flags, explicit);
    return new (Object.getPrototypeOf(this).class.ctor)(cloned_obj);
  }

  equals(obj, include_not_enumerable_props = true) {
    if (typeof obj === "undefined" || !(obj instanceof Obj)) {
      return false;
    }

    //
    // Process only enumerable properties
    {
      if (!include_not_enumerable_props) {
        const props = Object.keys(this);
        for (let key in props) {
          if (!json.value_equals(this[key], obj[key])) {
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
   *                          this.toJSON_as_string
   *                          => numbers are converted to string
   *                          Properties failed to be converted
   *                          to string are null
   */
  toJSON(
    specs_flags: number = props_specs.eSpec.JSON_PRIVATE,
    as_string?: boolean
  ) {
    let ret = {};

    const entries = props_specs.entries(this, specs_flags);

    entries.forEach(([key, val]) => {
      ret[key] = val; //json.to_json_value(val);

      if (as_string) {
        ret[key] = string.to(ret[key]);
      }
    });

    return ret;
  }

  //
  // === OBJECT's METHODS IMPLEMENTATIONS
  define_property(name, params) {
    {
      if (params.configurable == null) {
        params.configurable = false;
      }

      if (params.enumerable == null) {
        params.enumerable = false;
      }

      if (params.writable == null && params.get == null && params.set == null) {
        params.writable = false;
      }
    }

    Object.defineProperty(this, name, params);
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
    return this._errs.nb;
  }

  /**
   * Return all errors as a single string
   *
   * @return{string}
   */
  get errs_str() {
    return this._errs.str;
  }

  /**
   * Get error associated to specified property name
   *
   * @return{str}
   */
  get_err_str(prop_name, include_stack = false) {
    return this._errs.get_str(prop_name, include_stack);
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
    this._errs.set_error(prop_name, error, value_which_raised);
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
  localize_errors(
    global_texts,
    class_texts = global_texts[Object.getPrototypeOf(this).class.name]
  ) {
    return this._errs.localize(global_texts, class_texts);
  }

  //
  // === GETTERS / SETTERS ===
  get(props_flags = props_specs.eSpec.ALL_NOT_JSONIFYING, clone?: boolean) {
    const entries = props_specs.entries(this, props_flags);
    const obj: any = {};

    if (clone) {
      entries.forEach(([key, val]) => {
        obj[key] = typeof val.clone === "function" ? val.clone() : val;
      });
    } else {
      entries.forEach(([key, val]) => {
        obj[key] = val;
      });
    }

    return obj;
  }

  /**
   * Set every members in obj but functions
   *
   * @param {json|object} values
   * @param {object} set_res
   * @param {boolean} silent_errs If true, when all values are set
   *                              but any of them have thrown an error,
   *                              this.errs is thrown
   *                              Enable constructors calling set to finish
   *                              without always having to
   *                              try..catch the set call
   *
   *                              Otherwise, failes silently
   *                              (this.errs can still be read)
   *
   * @return {object} number of set/not set members which are not a function
   *                    3 values :
   *                                nb_set,
   *                                nb_nset, Not set but should have been
   *                                          => property exists in this
   *                                         Ones not set because not exists in this
   *                                         are not specified
   *                                          (not directly implementable when this
   *                                          has less properties
   *                                          => is the one iterated to set values)
   *                                nb_nset_ro Not set because are read-only
   *
   * @throws{Obj_Errors} - If setting a property raises an error. Setting all
   *                        properties is attempted before throwing the error
   */
  set(values, props_flags = props_specs.eSpec.ALL, silent_errs?: boolean) {
    const set_res = {
      nb_set: 0,
      nb_already: 0,
      nb_nset: 0,
      nb_nset_ro: 0,
    };
    if (!values) {
      return set_res;
    }

    let that = this;
    let nb_errs = 0;

    //
    // Iterate either values or this' keys to identify values to set
    // (=> will be the one which is lower-sized)
    {
      const values_keys = props_specs.keys(values, props_flags);
      const values_length = values_keys.length;

      const this_keys = props_specs.keys(this, props_flags);
      const this_length = this_keys.length;

      //
      // Iterate values of the lower-sized object (between values and this)
      if (values_length < this_length) {
        //
        // Iterate set values
        values_keys.forEach((key) => {
          //
          // If prop_name is an expected by this
          if (this_keys.includes(key)) {
            set_value(key, values[key]);
          }
        });
      } else {
        //
        // Iterate this' keys
        this_keys.forEach((key) => {
          //
          // If prop_name is in values
          if (values_keys.includes(key)) {
            set_value(key, values[key]);
          }
        });
      }
    }

    if (!silent_errs && nb_errs > 0) {
      throw this._errs;
    }

    return set_res;

    function set_value(prop_name, value) {
      try {
        const old_val = that[prop_name];
        //
        // Set value and check if any modification occurs
        // to mark prop_name as updated member
        if (old_val !== value) {
          that[prop_name] = value;
          set_res.nb_set++;

          //
          //if not just a new object instance (clone, fetched from DB...)
          if (typeof old_val !== "undefined") {
            that.push_updated_member(prop_name);
          }
        } else {
          set_res.nb_already++;
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
            set_res.nb_nset++;
            that.add_error(prop_name, ex, value);
          }
        }

        ex.message =
          "Could not set property " +
          prop_name +
          " to " +
          value +
          " : " +
          ex +
          " - Current value : " +
          that[prop_name];

        that.error = ex;

        return false;
      }
    }
  }
}

//obj.exports_(module, Obj);

/**
class Base{
	static incr(val){
  console.log("Base");
		return val+1;  
  }
}
Object.freeze(Base);

class Sub extends Base{
	constructor(val){
  super();
  	this.val = val;
  }
  
  
	static incr(val){
  console.log("Sub");
		return super.incr(val+1)+this.val;  
  }
}
Object.freeze(Sub);


let obj = new Sub(10);
Object.defineProperty(Object.getPrototypeOf(obj), "incr",
{
value:function(val){
	return this.constructor.incr.call(this, [val]);
},
configurable: false,
writable: false
});

Object.defineProperty(obj, "incr",
{
value:function(val){
	return this.constructor.incr.call(this, [val]);
},
configurable: false,
writable: false
});

console.log(obj.incr(1));

 */

/**
 * Return all JSON parsable keys owned by obj and its parents
 * A JSON parsable key is a property :
 *  - being a primitive type
 *  - being an array of primitive types
 *  - being an object with a toJSON function
 *  - having a method with the same name ending with "_json"
 *  - being a setter declaration => begins with '_', ending with '_set_'
 *    A setter declaration must have an associated setter function
 *
 * @param obj
 */
export function get_parsable_keys<T extends Obj>(obj: T): string[] {
  const keys = [];
  let proto;
  do {
    proto = Object.getPrototypeOf(obj);

    Object.keys(proto).forEach((key) => {
      const type = typeof proto[key];

      //
      // Primitive type
      if (is_primitive(type)) {
        keys.push(key);
      } else if (type === "object") {
        //
        // Object with toJSON()
        if (typeof proto[key].toJSON === "function") {
          keys.push(key);
        }
        //
        // Object has a method <key>_json
        else if (typeof proto[key + "_json"] === "function") {
          keys.push(key + "_json");
        }
        //
        // Array of primitives
        else if (proto[key] instanceof Array) {
          if (proto[key].length > 0 && is_primitive(typeof proto[key][0])) {
            keys.push(key);
          }
        }
      }
      //
      // setter declaration
      else if (/^_.+_set_$/.test(key)) {
        const setter_name = key.replace(/^_(.+)_set_$/, "$1");
        keys.push(setter_name);
      } else {
        logger.warn = "Unhandled type " + type + " of property " + key;
      }
    });
  } while (proto !== Obj);

  return keys;
}
