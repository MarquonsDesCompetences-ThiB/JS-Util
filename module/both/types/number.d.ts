/**
 * Return val if it is a number or Number,
 * null otherwise
 * @param val
 *
 * @return {string|String|null}
 */
export declare function if_is(val: any): number | Number;
/**
 * Return true if val is a number, Number
 * If not strictly : or a string/String representing a number
 * @param {*} val
 * @param {bool} string_number_ok If string_number_ok and obj is a string ,
 *                                check if equivalent to a number
 */
export declare function is(val: any, string_number_ok?: boolean): boolean;
export declare function sanitize(val: any): number;
/**
 * Return a random int with the specified length
 * Eg. if length = 2, in [10;99]
 *      if lenggth = 3, in [100; 999]
 *      ...
 * @param {*} length
 */
export declare function random_int_with_length(length: number): number;
