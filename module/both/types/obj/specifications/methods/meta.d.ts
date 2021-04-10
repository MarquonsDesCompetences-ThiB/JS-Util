/**
 * Declare and store a meta class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as meta
 * @param descriptor property’s descriptor object
 */
export declare function meta(target: any, key: any): void;
export declare function keys(obj: any): string[];
export declare function values(obj: any): any[];
export declare function entries(obj: any): [string, any][];
