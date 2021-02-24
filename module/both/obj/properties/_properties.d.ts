export { eProp_Spec } from "./specs.js";
export * as cyclic from "./cyclic.js";
export * as jsonify from "./jsonify.js";
export * as jsonified from "./jsonified.js";
export * as not_enum from "./not_enum.js";
import * as cyclic from "./cyclic.js";
import * as jsonify from "./jsonify.js";
import * as jsonified from "./jsonified.js";
import * as not_enum from "./not_enum.js";
export declare const decorators: {
    cyclic: typeof cyclic.cyclic;
    jsonified: typeof jsonified.jsonified;
    jsonify: typeof jsonify.jsonify;
    not_enum: typeof not_enum.not_enum;
};
import { Set_Array } from "../../array/_array.js";
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export declare function keys(obj: any, ...specs_flags: number[]): string[];
/**
 * Return the requested properties (specified by specs_flags)
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
