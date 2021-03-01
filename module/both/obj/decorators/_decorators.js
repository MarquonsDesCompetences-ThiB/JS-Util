export { eSpec } from "./eSpec.js";
export * as properties from "./properties/_properties.js";
export * as methods from "./methods/_methods.js";
import { eSpec } from "./eSpec.js";
import * as properties from "./properties/_properties.js";
import * as methods from "./methods/_methods.js";
//
// === KEYS / VALUES / ENTRIES combining both properties and methods ===
export const not_enum = {
    keys: function (obj) {
        return properties.not_enum.keys(obj).concat(methods.not_enum.keys(obj));
    },
    values: function (obj) {
        return properties.not_enum.values(obj).concat(methods.not_enum.values(obj));
    },
    entries: function (obj) {
        return properties.not_enum
            .entries(obj)
            .concat(methods.not_enum.entries(obj));
    },
};
import { Set_Array } from "../../array/_array.js";
//
// === KEYS ===
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags {eSpec}
 *
 * @param obj
 * @param specs_flags
 */
export function keys(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    const props = [];
    {
        let proto = obj;
        do {
            props.concat(own_keys(proto, specs_flag));
        } while ((proto = Object.getPrototypeOf(proto)) !== Object);
    }
    return props;
}
/**
 * Return the requested properties (specified by specs_flags {eSpec})
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export function own_keys(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
    const props = new Set_Array();
    {
        for (let flag = 0; flag < specs_flag; flag *= 2) {
            if (flag & specs_flag) {
                switch (flag) {
                    case eSpec.CYCLIC:
                        props.concat(properties.cyclic.keys(obj));
                        break;
                    case eSpec.ENUM:
                        props.concat(Object.keys(obj));
                        break;
                    case eSpec.NOT_ENUM:
                        // not_enum exists both for properties and methods
                        props.concat(not_enum.keys(obj));
                        break;
                    case eSpec.JSONIFIED:
                        props.concat(properties.jsonified.keys(obj));
                        break;
                    case eSpec.JSONIFY:
                        props.concat(methods.jsonify.keys(obj));
                        break;
                    default:
                        logger.error = "Unhandled flag " + flag;
                }
            }
        }
    }
    return props;
}
//
// === VALUES ===
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export function values(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    const props = [];
    {
        let proto = obj;
        {
            props.concat(own_values(proto, specs_flag));
        }
        while ((proto = Object.getPrototypeOf(proto)) !== Object)
            ;
    }
    return props;
}
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export function own_values(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
    const props = new Set_Array();
    {
        for (let flag = 0; flag < specs_flag; flag *= 2) {
            if (flag & specs_flag) {
                switch (flag) {
                    case eSpec.CYCLIC:
                        props.concat(properties.cyclic.values(obj));
                        break;
                    case eSpec.ENUM:
                        props.concat(Object.values(obj));
                        break;
                    case eSpec.NOT_ENUM:
                        // not_enum exists both for properties and methods
                        props.concat(not_enum.values(obj));
                        break;
                    case eSpec.JSONIFIED:
                        props.concat(properties.jsonified.values(obj));
                        break;
                    case eSpec.JSONIFY:
                        props.concat(methods.jsonify.values(obj));
                        break;
                    default:
                        logger.error = "Unhandled flag " + flag;
                }
            }
        }
    }
    return props;
}
//
// === VALUES ===
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export function entries(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    const props = [];
    {
        let proto = obj;
        {
            props.concat(own_entries(proto, specs_flag));
        }
        while ((proto = Object.getPrototypeOf(proto)) !== Object)
            ;
    }
    return props;
}
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export function own_entries(obj, ...specs_flags) {
    // combine all specs_flags in one
    const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);
    // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
    const props = new Set_Array();
    {
        for (let flag = 0; flag < specs_flag; flag *= 2) {
            if (flag & specs_flag) {
                switch (flag) {
                    case eSpec.CYCLIC:
                        props.concat(properties.cyclic.entries(obj));
                        break;
                    case eSpec.ENUM:
                        props.concat(Object.entries(obj));
                        break;
                    case eSpec.NOT_ENUM:
                        //not_enum exists both for properties and methods
                        props.concat(not_enum.entries(obj));
                        break;
                    case eSpec.JSONIFIED:
                        props.concat(properties.jsonified.entries(obj));
                        break;
                    case eSpec.JSONIFY:
                        props.concat(methods.jsonify.entries(obj));
                        break;
                    default:
                        logger.error = "Unhandled flag " + flag;
                }
            }
        }
    }
    return props;
}
//# sourceMappingURL=_decorators.js.map