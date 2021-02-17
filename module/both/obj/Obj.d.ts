import { Obj_props } from "./_props/Obj_props.js";
/**
 * Preconds
 *  util.obj.Errors = Obj_Errors
 *  json = json
 *  text.string = String
 */
export declare class Obj extends Obj_props {
    /**
     * To export depending on environment
     * Must be called by the child class
     */
    static set export(module: any);
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
    static init(properties: any, module?: any): void;
    /**
     * Must be called by the Obj child class to test values on
     * @param {*} values
     */
    static get_property_values_errors(values: any): {};
    /**
     * Children must call super after defining their enumerable properties
     * @throws {Object { <prop_name : <err> }} If this.set raises error(s)
     */
    constructor(values?: any);
    /**
     * Iteratively initialize properties from Obj to final overrider
     */
    init_properties(): void;
    clone(): any;
    equals(obj: any, include_not_enumerable_props?: boolean): boolean;
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
    toJSON(include_not_enumerable_props?: boolean, as_string?: boolean): {};
    /**
     * Clone every enumerable members in this but functions
     *
     * Not enumerable properties are not cloned
     *  => their reference is returned as is
     * @return {json}
     */
    get_cloned_JSON(include_not_enumerable_props?: boolean): {};
    define_property(name: any, params: any): void;
    /**
     * Shorthand to logger.debug
     * Log specified message as debug
     * Class name is prefixed to log
     */
    set debug(msg: any);
    /**
     * Shorthand to logger.info
     * Log specified message as info
     * Class name is prefixed to log
     */
    set info(msg: any);
    /**
     * Shorthand to logger.error
     * Log specified message as error
     * Class name is prefixed to log
     */
    set error(msg: any);
    /**
     * Shorthand to logger.fatal
     * Log specified message as fatal
     * Class name is prefixed to log
     */
    set fatal(msg: any);
    /**
     * Shorthand to logger.log
     * Log specified message
     * Class name is prefixed to log
     */
    set log(msg: any);
    /**
     * Shorthand to logger.trace
     * Log specified message as trace
     * Class name is prefixed to log
     */
    set trace(msg: any);
    /**
     * Shorthand to logger.warn
     * Log specified message as warning
     * Class name is prefixed to log
     */
    set warn(msg: any);
    /**
     * @return{integer}
     */
    get nb_errs(): number;
    /**
     * Return all errors as a single string
     *
     * @return{string}
     */
    get errs_str(): string;
    /**
     * Get error associated to specified property name
     *
     * @return{str}
     */
    get_err_str(prop_name: any, include_stack?: boolean): String;
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
    add_error(prop_name: any, error: any, value_which_raised?: any): void;
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
    localize_errors(global_texts: any, class_texts?: any): {
        nb_set: number;
        nb_nset: number;
    };
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
    set(values: any, set_res?: {
        nb_set: number;
        nb_nset: number;
        nb_nset_ro: number;
    }): {
        nb_set: number;
        nb_nset: number;
        nb_nset_ro: number;
    };
}
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
export declare function get_parsable_keys<T extends Obj>(obj: T): string[];
