/**
 * Return if obj is of specified type
 * Specified type can be a class instance
 *    => return true if obj is an object of this instance
 * @param {string} type_name
 * @param {*} obj
 * @param {bool} strict
 */
export declare function is(type_name: any, obj: any, strict?: boolean): boolean;
export declare function is_instance(obj: unknown, type: string): boolean;
export declare function is_primitive(type: string): boolean;
/**
 * Convert primitive to its equivalent object type if it
 * currently is a primitive
 * Eg. convert boolean to Boolean
 *             number to Number
 *             string to String
 */
export declare function to_object(primitive: any): any;
