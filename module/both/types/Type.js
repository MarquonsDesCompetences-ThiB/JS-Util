"use strict";
import * as bool from "./bool.js";
import * as number from "./number.js";
import * as string from "./string/_string.js";
/**
 * Return if obj is of specified type
 * Specified type can be a class instance
 *    => return true if obj is an object of this instance
 * @param {string} type_name
 * @param {*} obj
 * @param {bool} strict
 */
export function is(type_name, obj, strict = false) {
    if (/^\s*(boolean|Boolean)\s*/.test(type_name)) {
        return bool.is(obj, strict);
    }
    if (/^\s*(number|Number)\s*/.test(type_name)) {
        return number.is(obj, strict);
    }
    if (/^\s*(string|String)\s*/.test(type_name)) {
        return string.is(obj);
    }
    const obj_type = typeof obj;
    if (obj_type === "object") {
        return is_instance(obj, obj_type);
    }
    if (type_name === obj_type) {
        return true;
    }
    return false;
}
export function is_instance(obj, type) {
    if (typeof obj !== "object") {
        return false;
    }
    let proto;
    while ((proto = Object.getPrototypeOf(obj)) != null) {
        if (proto.constructor.name === type) {
            return true;
        }
    }
    return false;
}
export function is_primitive(type) {
    return (type === "boolean" ||
        type === "number" ||
        type === "string" ||
        type === "Symbol");
}
/**
 * Convert primitive to its equivalent object type if it
 * currently is a primitive
 * Eg. convert boolean to Boolean
 *             number to Number
 *             string to String
 */
export function to_object(primitive) {
    switch (typeof primitive) {
        case "boolean":
            primitive = new Boolean(primitive);
            break;
        case "number":
            primitive = new Number(primitive);
            break;
        case "string":
            primitive = new String(primitive);
            break;
    }
    return primitive;
}
//# sourceMappingURL=type.js.map