export { eSpec } from "./eSpec.js";
export * as props from "./properties/_properties.js";
export * as meths from "./methods/_methods.js";
import * as properties from "./properties/_properties.js";
import * as methods from "./methods/_methods.js";
export declare const decs: {
    props: {
        cyclic: typeof properties.cyclic.cyclic;
        jsonified: typeof properties.jsonified.jsonified;
        not_enum: typeof properties.not_enum.not_enum;
    };
    meths: {
        jsonify: typeof methods.jsonify.jsonify;
        not_enum: typeof methods.not_enum.not_enum;
    };
};
export declare const not_enum: {
    keys: (obj: any) => string[];
    values: (obj: any) => any[];
    entries: (obj: any) => [string, any][];
};
import { Set_Array } from "../../array/_array.js";
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags {eSpec}
 *
 * @param obj
 * @param specs_flags
 */
export declare function keys(obj: any, ...specs_flags: number[]): string[];
/**
 * Return the requested properties (specified by specs_flags {eSpec})
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export declare function own_keys(obj: any, ...specs_flags: number[]): Set_Array;
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export declare function values(obj: any, ...specs_flags: number[]): any[];
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export declare function own_values(obj: any, ...specs_flags: number[]): Set_Array;
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export declare function entries(obj: any, ...specs_flags: number[]): [string, any][];
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export declare function own_entries(obj: any, ...specs_flags: number[]): Set_Array;
