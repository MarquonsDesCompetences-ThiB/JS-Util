export { eSpec } from "./eSpec.js";
export * as props from "./properties/_properties.js";
export * as meths from "./methods/_methods.js";
import { eSpec, empty_arr_By_Spec } from "./eSpec.js";
import * as properties from "./properties/_properties.js";
const props_enums = properties.enumerable;
import * as methods from "./methods/_methods.js";
const meths_enums = methods.enumerable;
//
// === DECORATORS DIRECT ACCESS ===
export const decs = {
    props: properties.decs,
    meths: methods.decs,
};
//
// === KEYS / VALUES / ENTRIES ===
// combining both properties and methods when needed (enum, meta)
export const keys_with_spec = {
    [eSpec.DESCR_ENUMERABLE]: function (obj) {
        return Object.keys(obj);
    },
    [eSpec.CYCLIC]: function (obj) {
        return properties.cyclic.keys(obj);
    },
    [eSpec.ENUM]: function (obj) {
        return props_enums.keys(obj).concat(meths_enums.keys(obj));
    },
    [eSpec.JSONIFIED]: function (obj) {
        return properties.jsonified.keys(obj);
    },
    [eSpec.JSONIFY]: function (obj) {
        return methods.jsonify.keys(obj);
    },
    [eSpec.META]: function (obj) {
        return properties.meta.keys(obj).concat(methods.meta.keys(obj));
    },
    [eSpec.ALL_NOT_JSONIFYING]: keys,
};
export const values_with_spec = {
    [eSpec.DESCR_ENUMERABLE]: function (obj) {
        return Object.values(obj);
    },
    [eSpec.CYCLIC]: function (obj) {
        return properties.cyclic.values(obj);
    },
    [eSpec.ENUM]: function (obj) {
        return props_enums.values(obj).concat(meths_enums.values(obj));
    },
    [eSpec.JSONIFIED]: function (obj) {
        return properties.jsonified.values(obj);
    },
    [eSpec.JSONIFY]: function (obj) {
        return methods.jsonify.values(obj);
    },
    [eSpec.META]: function (obj) {
        return properties.meta.values(obj).concat(methods.meta.values(obj));
    },
    [eSpec.ALL_NOT_JSONIFYING]: values,
};
export const entries_with_spec = {
    [eSpec.DESCR_ENUMERABLE]: function (obj) {
        return Object.entries(obj);
    },
    [eSpec.CYCLIC]: function (obj) {
        return properties.cyclic.entries(obj);
    },
    [eSpec.ENUM]: function (obj) {
        return props_enums.entries(obj).concat(meths_enums.entries(obj));
    },
    [eSpec.JSONIFIED]: function (obj) {
        return properties.jsonified.entries(obj);
    },
    [eSpec.JSONIFY]: function (obj) {
        return methods.jsonify.entries(obj);
    },
    [eSpec.META]: function (obj) {
        return properties.meta.entries(obj).concat(methods.meta.entries(obj));
    },
    [eSpec.ALL_NOT_JSONIFYING]: entries,
};
import { Set_Array } from "../../../array/_array.js";
//
// === KEYS ===
function keys_by_specs(obj, specs_flags, recursive, _keys_by_flag //for recursive use
) {
    //
    // Decorators must be fetched to be removed from descriptor ones
    const _specs_flags = specs_flags & eSpec.DESCRIPTOR
        ? specs_flags | eSpec.DECORATORS
        : specs_flags;
    const keys_by_flag = _keys_by_flag ? _keys_by_flag : empty_arr_By_Spec();
    for (let flag = eSpec.DESCR_ENUMERABLE; flag < eSpec.ALL; flag *= 2) {
        if (flag & _specs_flags && keys_with_spec[flag]) {
            keys_by_flag[flag] = keys_by_flag[flag].concat(keys_with_spec[flag](obj));
        }
    }
    //
    // Recursive call
    if (recursive) {
        const proto = Object.getPrototypeOf(obj);
        if (proto != null) {
            keys_by_specs(proto, _specs_flags, true, keys_by_flag);
        }
    }
    //
    // If not in recursive use or recursive and the 1st call
    // => clean keys_by_flag
    if (!recursive || !_keys_by_flag) {
        //
        // Remove decored keys from DESCRIPTOR ones
        // => avoid duplicates
        clean_keys_by_specs(keys_by_flag);
    }
    return keys_by_flag;
}
function clean_keys_by_specs(keys_by_flag) {
    //
    // Remove decored keys from DESCRIPTOR ones
    // => avoid duplicates
    {
        const decoreds = [];
        //
        // Fetch all decored keys
        {
            for (let flag = eSpec.CYCLIC; flag < eSpec.ALL; flag *= 2) {
                if (keys_by_flag[flag]) {
                    decoreds.push(...keys_by_flag[flag]);
                }
            }
        }
        //
        // Remove decored keys from keys_by_flag[DESCR_*]
        {
            for (let flag = eSpec.DESCR_ENUMERABLE; flag < eSpec.DESCRIPTOR; flag *= 2) {
                if (keys_by_flag[flag]) {
                    keys_by_flag[flag] = keys_by_flag[flag].filter((key) => {
                        return !decoreds.includes(key);
                    });
                }
            }
        }
    }
}
/**
 * Sort keys from keys_by_spec{iBy_Spec} in 2 arrays :
 *  decoreds keys
 *  and descriptors ones (ie not decored)
 *
 * @param keys_by_spec
 * @returns
 */
function keys_descr_decor(keys_by_spec) {
    //
    // Fetch decored keys
    const decoreds = [];
    {
        for (let flag = eSpec.CYCLIC; flag < eSpec.ALL; flag *= 2) {
            if (keys_by_spec[flag]) {
                decoreds.push(...keys_by_spec[flag]);
            }
        }
    }
    //
    // Fetch descriptor keys which are not decored
    const descriptors = [];
    {
        for (let flag = eSpec.DESCR_CONFIGURABLE; flag < eSpec.DESCRIPTOR; flag *= 2) {
            if (keys_by_spec[flag]) {
                //
                // Fetch keys_by_spec[i] removing decored keys
                const not_decoreds = keys_by_spec[flag].filter((key) => {
                    return !decoreds.includes(key);
                });
                descriptors.push(...not_decoreds);
            }
        }
    }
    return {
        descriptors,
        decoreds,
    };
}
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags {eSpec}
 *
 * @param obj
 * @param specs_flags
 */
export function keys(obj, specs_flag = eSpec.ALL_NOT_JSONIFYING) {
    const props = [];
    {
        const keys_by_spec = keys_by_specs(obj, specs_flag, true);
        for (let flag = eSpec.DESCR_CONFIGURABLE; flag <= specs_flag; flag *= 2) {
            if (flag & specs_flag) {
                if (keys_by_spec[flag]) {
                    props.push(...keys_by_spec[flag]);
                }
                else {
                    logger.error =
                        "Flag " +
                            flag +
                            " is request but its keys have not been fetched in keys_by_spec";
                }
            }
        }
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
export function own_keys(obj, specs_flag = eSpec.ALL_NOT_JSONIFYING) {
    //
    // Any DESCR is requested
    // => avoid fetching enumerable but not requested
    //    decored properties for them
    {
        if (specs_flag & eSpec.DESCRIPTOR) {
            const keys_by_spec = keys_by_specs(obj, specs_flag | eSpec.DECORATORS, true);
            // Set_Array because JSONIFY/JSONIFIED can induce duplicates
            const props = new Set_Array();
            for (let flag = 1; flag < specs_flag; flag *= 2) {
                if (flag & specs_flag) {
                    if (keys_by_spec[flag]) {
                        props.push(...keys_by_spec[flag]);
                    }
                    else {
                        logger.error =
                            "Flag " +
                                flag +
                                " is request but its keys have not been fetched in keys_by_spec";
                    }
                }
            }
            return props;
        }
    }
    //
    // Only decored properties
    {
        // Set_Array because JSONIFY/JSONIFIED can induce duplicates
        let props = new Set_Array();
        {
            for (let flag = 1; flag < specs_flag; flag *= 2) {
                if (flag & specs_flag) {
                    if (keys_with_spec[flag]) {
                        props = props.concat(keys_with_spec[flag](obj));
                    }
                    else {
                        logger.error = "Unhandled flag " + flag;
                    }
                }
            }
        }
        return props;
    }
}
/**
 * To be called when a DESCR spec_flag is requested
 * To fetch keys which match the DESCR flags
 * without fetching ones having a decorator
 * and whose flag is not in specs_flag
 *
 * @param obj
 * @param specs_flag
 */
function own_keys_by_spec(obj, specs_flags = eSpec.ALL_NOT_JSONIFYING, keys_by_flag) {
    let props = [];
    {
        for (let flag = 1; flag <= specs_flags; flag *= 2) {
            if (flag & specs_flags) {
                //
                // Flag fetched in keys_by_flag
                if (keys_by_flag[flag]) {
                    props = props.concat(keys_by_flag[flag]);
                }
                //
                // Flag's keys must be fetched an can be
                else if (keys_with_spec[flag]) {
                    props = props.concat(keys_with_spec[flag](obj));
                }
                else {
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
export function values(obj, specs_flags = eSpec.ALL_NOT_JSONIFYING) {
    const requested_keys = keys(obj, specs_flags);
    const vals = [];
    requested_keys.forEach((key) => {
        vals.push(obj[key]);
    });
    return vals;
}
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export function own_values(obj, specs_flags = eSpec.ALL_NOT_JSONIFYING) {
    const requested_keys = own_keys(obj, specs_flags);
    const vals = [];
    requested_keys.forEach((key) => {
        vals.push(obj[key]);
    });
    return vals;
}
//
// === ENTRIES ===
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export function entries(obj, specs_flags = eSpec.ALL_NOT_JSONIFYING) {
    const requested_keys = keys(obj, specs_flags);
    const entrs = [];
    requested_keys.forEach((key) => {
        entrs.push([key, obj[key]]);
    });
    return entrs;
}
/**
 * Return the requested properties (specified by specs_flags)
 * owned by obj
 *
 * @param obj
 * @param specs_flags
 */
export function own_entries(obj, specs_flags = eSpec.ALL_NOT_JSONIFYING) {
    const requested_keys = own_keys(obj, specs_flags);
    const entrs = [];
    requested_keys.forEach((key) => {
        entrs.push([key, obj[key]]);
    });
    return entrs;
}
//# sourceMappingURL=_specifications.js.map