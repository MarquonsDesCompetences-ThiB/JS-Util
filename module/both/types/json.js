"use strict";
import { text } from "../_both.js";
//
// === CLONE ===
/**
 * Clone the specified value if it's not a function
 * @param {*} val
 * @param {bool} reference_if_cannot_clone
 */
export function clone_value(val, reference_if_cannot_clone = true) {
    const type = typeof val;
    if (type === "function" || type === "undefined") {
        return undefined;
    }
    if (val === null) {
        return null;
    }
    if (type === "number" || val instanceof Number) {
        return val + 0;
    }
    if (type === "string" || val instanceof String) {
        return val + "";
    }
    if (type === "object") {
        // Array
        if (val instanceof Array) {
            let ret = [];
            for (let i = 0; i < val.length; i++) {
                ret.push(clone_value(val[i]));
            }
            return ret;
        }
        // Object with clone function
        if (typeof val.clone === "function") {
            return val.clone();
        }
        // Date
        if (val instanceof Date) {
            return new Date(val.getTime());
        }
    }
    // Other than object
    else {
        const str = "Json#clone_value Couldn't clone " + val;
        if (reference_if_cannot_clone) {
            logger.warn = str + " ; reference given";
            return val;
        }
        {
            logger.warn = str + " ; value forgot";
            return undefined;
        }
    }
}
//
// === PROPERTIES ACCESSORS ===
/**
 * @return {Array} Array of strings and/or numbers
 */
export function accessor_to_property_names(prop_name) {
    //
    // Extract prop_name (if contains any dot and/or bracket)
    // prop[2] => prop.2
    // prop[2].subprop => prop.2.subprop
    const prop_parts = "" + prop_name; //clone prop_name
    //
    // replace brackets
    {
        // [ -> .
        prop_parts.replace(/(\[)/, ".");
        // ] -> nothing
        prop_parts.replace(/(\])/, "");
    }
    // split by dot
    const prop_parts_withIndex = prop_parts.split(".");
    for (let i = 0; i < prop_parts.length; i++) {
        //
        // prop name is an
        // array index (only digits)
        if (/^\d+$/.test(prop_parts[i])) {
            prop_parts_withIndex[i] = Number.parseInt(prop_parts[i]);
        }
        // else is a string -> nothing to do
    }
    return prop_parts_withIndex;
}
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
 * @param return_last_existing If a reference does not exist, return its parent
 *                              instead of throwing an error
 *
 * @return {*} The object pointed by accessors[0;nb_accessors-stop_from_end]
 *              Or if stop_from_end>0 :
 *                {object, last_accessor_names[stop_from_end]}
 *
 * @throws {ReferenceError} If !create_if_unexisting
 *                          and an accessor does not exist in object
 */
export function get_reference(object, accessor, create_if_unexisting = false, stop_from_end = 0, return_last_existing) {
    const accessors = accessor instanceof Array ? accessor : get_accessor_parts(accessor);
    let obj = object;
    //
    // Iterate accessors to get final property
    {
        for (let i = 0; i < accessors.length - stop_from_end; i++) {
            const prop_name = accessors[i];
            //
            // reference does not exist
            {
                if (!obj[prop_name]) {
                    //
                    // simply create it
                    if (create_if_unexisting) {
                        obj[prop_name] = {};
                    }
                    //
                    // Return the previous one
                    else if (return_last_existing) {
                        return {
                            obj,
                            last_accessor_names: accessors.slice(i),
                        };
                    }
                    else {
                        const msg = prop_name +
                            " does not exist in [object]" +
                            // print accessors up to prop_name
                            (i > 0 ? "." + accessors.slice(0, i).join(".") : "") +
                            // print all accessors
                            " (from " +
                            (accessor instanceof Array ? accessor.join(".") : accessor);
                        throw new ReferenceError(msg);
                    }
                }
            }
            obj = obj[prop_name];
        }
    }
    if (stop_from_end === 0 && !return_last_existing) {
        return obj;
    }
    return {
        obj,
        last_accessor_names: accessors.slice(accessors.length - stop_from_end),
    };
}
/**
 * Return an array of every words between dots
 * Remove eventual spaces around dots
 * @param {string} accessor
 *
 * @return {string[]}
 */
export function get_accessor_parts(accessor) {
    if (accessor instanceof Array) {
        return accessor;
    }
    //
    // If there is no dot => returns [accessor]
    {
        if (new RegExp(`^[^\.]{${accessor.length}}$`).test(accessor)) {
            return [accessor];
        }
    }
    /*
          Return everything which is not a dot and is either :
            - preceded by a dot and eventual spaces
            - followed by eventual spaces and a dot
        */
    const matches = accessor.match(/(?<=\b)[^\.]+(?=\b)/g);
    /**
     * Parse numbers accessors
     */
    if (matches) {
        matches.forEach((accessor, idx) => {
            //
            // Accessor is an integer
            if (/^\d+$/.test(accessor)) {
                matches[idx] = Number.parseInt(accessor);
            }
        });
    }
    return matches;
}
//
// === ESCAPE ===
export function escape_values(obj) {
    //
    // Iterate object's properties
    for (const prop_name in obj) {
        //
        // Escape string
        if (text.string.is(obj[prop_name])) {
            obj[prop_name] = encodeURIComponent(obj[prop_name]);
        }
        //
        // Escape object property's values
        else if (typeof obj[prop_name] === "object") {
            escape_values(obj[prop_name]);
        }
    }
}
//
// === FACTORIZED NAME ===
export function factorize_property_names(obj) {
    const voyels_specialChars_regex = /([aàâäeéèêëiïouùy$-/\\:-?{}-~!"^_.`\[\]])/i;
    for (const prop_name in obj) {
        let id = prop_name.substring(0, 4);
        //
        // Remove non desired characters starting at prop_name[4]
        {
            let id_end = prop_name.substring(4);
            id_end.replace(voyels_specialChars_regex, "");
            id += id_end;
            id.toLowerCase();
        }
        //
        // Increment id if needed (already exists in ids)
        {
            let id_nb = 0;
            //not to append id_nb at every iteration
            const id_prefix = "" + id;
            while (obj[id]) {
                id_nb++;
                id = id_prefix + id_nb;
            }
        }
        //
        // Set new name
        {
            obj[id] = obj[prop_name];
            delete obj[prop_name];
        }
        //
        // Recursive call if property is itself an object
        {
            if (typeof obj[id] === "object") {
                try {
                    factorize_property_names(obj[id]);
                }
                catch (ex) {
                    const msg = "Could not factorize_property_names of " + id;
                    logger.warn = "Json#factorize_property_names " + msg;
                }
            }
        }
    }
    return obj;
}
export function prefix_parent_property_names(obj, charac = "-", id_prefix = "") {
    const prefix = id_prefix + charac;
    for (const prop_name in obj) {
        const new_name = prefix + prop_name;
        obj[new_name] = obj[prop_name];
        delete obj[prop_name];
        //
        // Recursive call if property is itself an object
        if (typeof obj[new_name] === "object") {
            prefix_parent_property_names(obj[new_name], charac, new_name);
        }
    }
    return obj;
}
//
// === IDS AS PROPERTY ===
/**
 * For each property and subproperties in obj, set its id
 * Id is the property name with
 * its 4 first letters (to enable alphabetical order)
 * then only consons and digits
 *
 *
 * @param {object} obj
 */
export function set_ids(obj) {
    //let ids = []; //to check ids already set and avoid duplicates
    const voyels_specialChars_regex = /([aàâäeéèêëiïouùy$-/\\:-?{}-~!"^_.`\[\]])/i;
    for (const prop_name in obj) {
        //
        // Set
        {
            let id = prop_name.substring(0, 4);
            //
            // Remove non desired characters starting at prop_name[4]
            {
                let id_end = prop_name.substring(4);
                id_end.replace(voyels_specialChars_regex, "");
                id += id_end;
                id.toLowerCase();
            }
            //
            // Increment id if needed (already exists in ids)
            /*{
                  let id_nb = 0;
                  //not to append id_nb at every iteration
                  const id_prefix = "" + id;
                  while (ids.includes(id)) {
                    id_nb++;
                    id = id_prefix + id_nb;
                  }
                }*/
            //
            // Set id
            {
                //ids.push(id);
                obj.id = id;
            }
        }
        //
        // Recursive call if property is itself an object with name propeprty
        {
            if (typeof obj[prop_name] === "object") {
                try {
                    set_ids(obj[prop_name]);
                }
                catch (ex) {
                    const msg = "Could not set_ids of " + prop_name;
                    logger.warn = "Json#set_ids " + msg;
                }
            }
        }
    }
    return obj;
}
/**
 * Prefix all properties' and subproperties' id in obj
 * with their parent id
 *
 * You may want to call set_ids first to set every property's id
 *
 * @param {object} obj
 * @param {string} charac Character(s) between prefix and id
 */
export function prefix_parent_ids(obj, charac = "-", id_prefix = "") {
    const prefix = id_prefix + charac;
    for (const prop_name in obj) {
        try {
            obj[prop_name].id = prefix + obj[prop_name].id;
        }
        catch (ex) {
            const msg = "Could not prefix parent id (" +
                obj[prop_name].id +
                ") of " +
                prop_name +
                " to " +
                prefix +
                obj[prop_name].id;
            logger.warn = "Json#prefix_parent_ids " + msg;
        }
        //
        // Recursive call if property is itself an object
        if (typeof obj[prop_name] === "object") {
            prefix_parent_ids(obj[prop_name], charac, obj[prop_name].id);
        }
    }
    return obj;
}
//
// === PROPERTIES ===
export function get_nb_properties(obj) {
    if (!obj || !(obj instanceof Object)) {
        return 0;
    }
    let nb = 0;
    for (const key in obj) {
        if (typeof obj[key] !== "function") {
            nb++;
        }
    }
    return nb;
}
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
export function merge(obj_receiving, obj_to_merge, keep_obj_receiving_values = true) {
    for (let key in obj_to_merge) {
        const type = typeof obj_receiving[key];
        if (obj_receiving[key] === undefined) {
            obj_receiving[key] = obj_to_merge[key];
        }
        else if (type !== typeof obj_to_merge[key]) {
            logger.warn =
                "Json#concat Key " +
                    key +
                    " has different types in objects : " +
                    type +
                    "; " +
                    typeof obj_to_merge[key] +
                    " Keeping obj_receiving's value : " +
                    keep_obj_receiving_values;
            if (!keep_obj_receiving_values) {
                obj_receiving[key] = obj_to_merge[key];
            }
        }
        else if (type === "object") {
            merge(obj_receiving[key], obj_to_merge[key], keep_obj_receiving_values);
        }
        else {
            // primitive ype
            if (!keep_obj_receiving_values) {
                obj_receiving[key] = obj_to_merge[key];
            }
        }
    }
}
/**
 * Convert val to a Json storable property value
 * @param {*} val
 */
export function to_json_value(val, include_not_enumerable_props = false) {
    //if val does not exist, is not an empty string
    if (!val && !text.string.is(val)) {
        return undefined;
    }
    const type = typeof val;
    if (type === "function") {
        return undefined;
    }
    if (type === "object") {
        // Array
        if (val instanceof Array) {
            let ret = [];
            for (let i = 0; i < val.length; i++) {
                ret.push(to_json_value(val[i]));
            }
            return ret;
        }
        // Object with toJSON function
        else if (typeof val.toJSON === "function") {
            return val.toJSON(include_not_enumerable_props);
        }
        // Date
        else if (val instanceof Date) {
            return val.toString();
        }
    }
    // Other than object
    else {
        return val;
    }
}
export function value_equals(val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 !== type2) {
        if (type1 === "number" || val1 instanceof Number) {
            if (type2 !== "number" && !(val2 instanceof Number)) {
                return false;
            }
        }
        else if (type1 === "string" || val1 instanceof String) {
            if (type2 !== "string" && !(val2 instanceof String)) {
                return false;
            }
        }
    }
    if (val1 === null || val2 === null) {
        return val1 === val2;
    }
    //do not consider functions
    if (type1 === "function") {
        return true;
    }
    if (type1 === "object") {
        //val1 has an equals() function
        if (typeof val1.equals === "function") {
            return val1.equals(val2);
        }
        // val1 is an Array object
        if (val1 instanceof Array) {
            if (!(val2 instanceof Array) || val1.length !== val2.length) {
                return false;
            }
            for (let i = 0; i < val1.length; i++) {
                if (!value_equals(val1[i], val2[i])) {
                    return false;
                }
            }
            return true;
        }
        if (val1 instanceof Date) {
            return val1.getTime() === val2.getTime();
        }
    }
    return val1 == val2;
}
//# sourceMappingURL=json.js.map