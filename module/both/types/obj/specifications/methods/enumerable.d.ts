/**
 * Declare and store an enumerable class' method,
 * which is not enumerable following its descriptor
 *
 * @param target class the object is an instance of
 * @param key property name to set as enumerable
 */
export declare function enumerable(target: any, key: any): void;
export declare function keys(obj: any): string[];
export declare function values(obj: any): any[];
export declare function entries(obj: any): [string, any][];
