import { Obj } from "./Obj";
export declare function exports_(module: any, to_export: any): void;
export declare function clone(object: any): any;
/**
 * Concatenate child props to parent props making an overriding :
 *   If no value in child_props but in parent_props, child_props' remains
 *   child_props' getter (if any) first calls parent_props' getter (if any)
 *   child_props' setter (if any) first calls parent_props' setter (if any)
 *
 * @param {Obj_Properties.props} parent_props If null, child_props is returned
 * @param {Obj_Properties.props} child_props If null, parent_props is returned
 *
 * @rturn {Obj_Properties.props}
 */
export declare function concat(parent_props: any, child_props: any): any;
/**
 *** Object.appendChain(@object, @prototype)
 *
 * Appends the first non-native prototype of a chain to a new prototype.
 * Returns @object (if it was a primitive value it will transformed into an object).
 *
 *** Object.appendChain(@object [, "@arg_name_1", "@arg_name_2", "@arg_name_3", "..."], "@function_body")
 *** Object.appendChain(@object [, "@arg_name_1, @arg_name_2, @arg_name_3, ..."], "@function_body")
 *
 * Appends the first non-native prototype of a chain to the native Function.prototype object, then appends a
 * new Function(["@arg"(s)], "@function_body") to that chain.
 * Returns the function.
 *
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 **/
export declare function dynamic_extends(oChildChain: any, oExtendsProto: any): any;
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
/**
 * Fetch non enumarable keys by parsing util.inspect(obj)
 * @param obj
 */
export declare function get_non_enumerable_keys(obj: any): string[];
