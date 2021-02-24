"use strict";
import { json } from "../_both.js";
import { Obj_props } from "./_props/Obj_props.js";
import { text } from "../_both.js";
import { is_primitive } from "../types/type.js";
/**
 * Preconds
 *  util.obj.Errors = Obj_Errors
 *  json = json
 *  text.string = String
 */
export class Obj extends Obj_props {
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
            }
            else if (!instances) {
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
                    if (statics[name].writable == null &&
                        /* if any accessor, no writable configuration can be set :
                            "TypeError: Invalid property descriptor. Cannot both specify
                            accessors and a value or writable attribute
                        */
                        !statics[name].get &&
                        !statics[name].set) {
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
                    if (instances[name].writable == null &&
                        /* if any accessor, no writable configuration can be set :
                            "TypeError: Invalid property descriptor. Cannot both specify
                            accessors and a value or writable attribute
                        */
                        !instances[name].get &&
                        !instances[name].set) {
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
    static get_property_values_errors(values) {
        let errs = {};
        {
            for (let key in values) {
                try {
                    new this({
                        [key]: values[key],
                    });
                }
                catch (ex) {
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
    constructor(values = undefined) {
        super();
        //this.init_properties();
        this.set(values);
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
                const props = class_.constructor[Symbol.for(class_.constructor.name + "_properties")];
                try {
                    Object.defineProperties(proto, props);
                }
                catch (ex) {
                    const msg = "Could not set properties of " +
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
    clone() {
        return new (Object.getPrototypeOf(this).class.ctor)(this.get_cloned_JSON());
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
    toJSON(include_not_enumerable_props = false, as_string = false) {
        let ret = {};
        //
        // Only enumerable properties
        {
            if (!include_not_enumerable_props) {
                const props = get_parsable_keys(this); // Object.keys(this);
                for (const prop_name in props) {
                    ret[prop_name] = json.to_json_value(this[prop_name]);
                    if (as_string) {
                        ret[prop_name] = text.string.to(ret[prop_name]);
                    }
                }
                return true;
            }
        }
        //
        // Process both enumerable and not enumerable properties
        {
            const props = get_parsable_keys(this); //Object.keys(this);
            for (let i = 0; i < props.length; i++) {
                const prop_name = props[i];
                ret[prop_name] = json.to_json_value(this[prop_name]);
                if (as_string) {
                    ret[prop_name] = text.string.to(ret[prop_name]);
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
                const props = Object.keys(this);
                for (let key in props) {
                    ret[key] = json.clone_value(this[key]);
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
                ret[prop_name] = json.clone_value(this[prop_name]);
            }
        }
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
    localize_errors(global_texts, class_texts = global_texts[Object.getPrototypeOf(this).class.name]) {
        return this.errs.localize(global_texts, class_texts);
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
    set(values, set_res = { nb_set: 0, nb_nset: 0, nb_nset_ro: 0 }) {
        if (!values) {
            return set_res;
        }
        let that = this;
        let nb_errs = 0;
        //
        // Iterate either values or this' keys to identify values to set
        // (=> will be the one which is lower-sized)
        {
            const values_keys = Object.keys(values); // Array
            const values_length = values_keys.length;
            const this_keys = this.all_keys; // Set
            const this_size = this_keys.size;
            //
            // Iterate values of the lower-sized object (between values and this)
            if (values_length < this_size) {
                //
                // Iterate values
                Object.entries(values).forEach((entry) => {
                    const [prop_name, value] = entry;
                    //
                    // If prop_name is an expected by this
                    if (this_keys.has(prop_name)) {
                        if (set_value(prop_name, value)) {
                            set_res.nb_set++;
                        }
                        else {
                            set_res.nb_nset++;
                        }
                    }
                });
            }
            else {
                //
                // Iterate this' keys
                this_keys.forEach((prop_name) => {
                    //
                    // If prop_name is in values
                    if (values_keys.includes(prop_name)) {
                        if (set_value(prop_name, values[prop_name])) {
                            set_res.nb_set++;
                        }
                        else {
                            set_res.nb_nset++;
                        }
                    }
                });
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
                if (old_val != (that[prop_name] = values[prop_name]) &&
                    //and if not just a new object instance (clone, fetched from DB...)
                    typeof old_val !== "undefined") {
                    that.push_updated_member(prop_name);
                }
                return true;
            }
            catch (ex) {
                nb_errs++;
                //
                // Store the error and value which raised it in that.errs
                {
                    if (ex instanceof TypeError) {
                        //
                        // Property is read-only
                        set_res.nb_nset_ro++;
                        that.add_error(prop_name, "Read-only", value);
                    }
                    else {
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
    return this.constructor.incr.apply(this, [val]);
},
configurable: false,
writable: false
});

Object.defineProperty(obj, "incr",
{
value:function(val){
    return this.constructor.incr.apply(this, [val]);
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
export function get_parsable_keys(obj) {
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
            }
            else if (type === "object") {
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
            }
            else {
                logger.warn = "Unhandled type " + type + " of property " + key;
            }
        });
    } while (proto !== Obj);
    return keys;
}
//# sourceMappingURL=Obj.js.map