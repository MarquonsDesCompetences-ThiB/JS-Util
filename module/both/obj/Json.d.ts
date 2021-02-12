/**
 * Clone the specified value if it's not a function
 * @param {*} val
 * @param {bool} reference_if_cannot_clone
 */
export declare function clone_value(val: any, reference_if_cannot_clone?: boolean): any;
/**
 * @return {Array} Array of strings and/or numbers
 */
export declare function accessor_to_property_names(prop_name: string): (string | number)[];
/**
 * Return the reference pointed by accessor in object
 * Stop going through object at <nb_accessors>-stop_from_end
 * => if 0, go through the whole accessor
 * => if 1, stop at the before-last accessor
 * ...
 * If higher than <nb_accessors>, go through the whole
 *
 * @param {object} object
 * @param {string | string[]} accessor
 *                              string[] : result of get_accessor_parts
 *                              string : parsed by get_accessor_parts to get a string[]
 * @param {bool} create_if_unexisting
 * @param {integer} stop_from_end
 *
 * @return {*} The object pointed by accessors[0;nb_accessors-stop_from_end]
 *              Or if stop_from_end>0 :
 *                {object, last_accessor_names[stop_from_end]}
 *
 * @throws {ReferenceError} If !create_if_unexisting
 *                          and an accessor does not exist in object
 */
export declare function get_reference(object: any, accessor: string | (string | number)[], create_if_unexisting?: boolean, stop_from_end?: number): any;
/**
 * Return an array of every words between dots
 * Remove eventual spaces around dots
 * @param {string} accessor
 *
 * @return {string[]}
 */
export declare function get_accessor_parts(accessor: string | (string | number)[]): (string | number)[];
export declare function escape_values(obj: any): void;
export declare function factorize_property_names(obj: any): any;
export declare function prefix_parent_property_names(obj: any, charac?: string, id_prefix?: string): any;
/**
 * For each property and subproperties in obj, set its id
 * Id is the property name with
 * its 4 first letters (to enable alphabetical order)
 * then only consons and digits
 *
 *
 * @param {object} obj
 */
export declare function set_ids(obj: any): any;
/**
 * Prefix all properties' and subproperties' id in obj
 * with their parent id
 *
 * You may want to call set_ids first to set every property's id
 *
 * @param {object} obj
 * @param {string} charac Character(s) between prefix and id
 */
export declare function prefix_parent_ids(obj: any, charac?: string, id_prefix?: string): any;
export declare function get_nb_properties(obj: any): number;
/**
 * Merge 2 json objects
 * @param {json} obj_receiving
 * @param {json} obj_to_merge
 * @param {bool} keep_obj_receiving_values In case both objects have the
 *                                          same key with primitive value
 *                                          If true, value from obj_receiving
 *                                          is kept, obj_to_merge is lost
 *                                          If false, value from obj_to_merge
 *                                          is kept, obj_receiving is lost
 *
 */
export declare function merge(obj_receiving: any, obj_to_merge: any, keep_obj_receiving_values?: boolean): void;
/**
 * Convert val to a Json storable property value
 * @param {*} val
 */
export declare function to_json_value(val: any, include_not_enumerable_props?: boolean): any;
export declare function value_equals(val1: any, val2: any): any;
