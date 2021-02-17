/**
 * Return if obj is of specified type
 * Specified type can be a class instance
 *    => return true if obj is an object of this instance
 * @param {string} type_name
 * @param {*} obj
 * @param {bool} strict
 */
export declare function is(type_name: any, obj: any, strict?: boolean): boolean;
export declare function is_primitive(type: string): boolean;
