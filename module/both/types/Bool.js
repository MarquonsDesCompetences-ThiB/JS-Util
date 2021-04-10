"use strict";
import * as number from "./number.js";
import * as string from "./string/_string.js";
/**
 * Return if obj is a boolean/Boolean or not, strictly or not
 * @param {*} obj
 * @param {bool} strict If not strict and obj is a string or number,
 *                          check if equivalent to a boolean
 *                            ( string : {false, true}
 *                              number : {0, 1}
 *                            )
 */
export function is(obj, strict = false) {
    const type = typeof obj;
    {
        if (type === "boolean" || obj instanceof Boolean) {
            return true;
        }
    }
    if (strict) {
        return false;
    }
    {
        if (string.is(obj)) {
            return /^\s*(true|false)\s*$/.test(obj);
        }
        if (number.is(obj)) {
            return /^\s*(0|1)\s*$/.test(obj);
        }
    }
    return false;
}
//# sourceMappingURL=bool.js.map