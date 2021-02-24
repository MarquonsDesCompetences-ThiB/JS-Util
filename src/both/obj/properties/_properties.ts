export { eProp_Spec } from "./specs.js";
export * as cyclic from "./cyclic.js";
export * as jsonify from "./jsonify.js";
export * as jsonified from "./jsonified.js";
export * as not_enum from "./not_enum.js";

import * as cyclic from "./cyclic.js";
import * as jsonify from "./jsonify.js";
import * as jsonified from "./jsonified.js";
import * as not_enum from "./not_enum.js";
export const decorators = {
  cyclic: cyclic.cyclic,
  jsonified: jsonified.jsonified,
  jsonify: jsonify.jsonify,
  not_enum: not_enum.not_enum,
};

import { eProp_Spec } from "./specs.js";
import { Set_Array } from "@src/both/array/_array.js";

//
// === KEYS ===
/**
 * Return all the obj's properties (even obj's parents ones)
 * according to specs_flags
 *
 * @param obj
 * @param specs_flags
 */
export function keys(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  const props: string[] = [];
  {
    let proto = obj;
    do {
      props.concat(own_keys(proto, specs_flag));
    } while ((proto = Object.getPrototypeOf(proto)) !== Object);
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
export function own_keys(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
  const props: Set_Array = new Set_Array();
  {
    for (let flag = 0; flag < specs_flag; flag *= 2) {
      if (flag & specs_flag) {
        switch (flag) {
          case eProp_Spec.CYCLIC:
            props.concat(cyclic.keys(obj));
            break;

          case eProp_Spec.ENUM:
            props.concat(Object.keys(obj));
            break;

          case eProp_Spec.NOT_ENUM:
            props.concat(not_enum.keys(obj));
            break;

          case eProp_Spec.JSONIFIED:
            props.concat(jsonified.keys(obj));
            break;

          case eProp_Spec.JSONIFY:
            props.concat(jsonify.keys(obj));
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
export function values(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  const props: any[] = [];
  {
    let proto = obj;
    {
      props.concat(own_values(proto, specs_flag));
    }
    while ((proto = Object.getPrototypeOf(proto)) !== Object);
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
export function own_values(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
  const props: Set_Array = new Set_Array();
  {
    for (let flag = 0; flag < specs_flag; flag *= 2) {
      if (flag & specs_flag) {
        switch (flag) {
          case eProp_Spec.CYCLIC:
            props.concat(cyclic.values(obj));
            break;

          case eProp_Spec.ENUM:
            props.concat(Object.values(obj));
            break;

          case eProp_Spec.NOT_ENUM:
            props.concat(not_enum.values(obj));
            break;

          case eProp_Spec.JSONIFIED:
            props.concat(jsonified.values(obj));
            break;

          case eProp_Spec.JSONIFY:
            props.concat(jsonify.values(obj));
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
export function entries(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  const props: [string, any][] = [];
  {
    let proto = obj;
    {
      props.concat(own_entries(proto, specs_flag));
    }
    while ((proto = Object.getPrototypeOf(proto)) !== Object);
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
export function own_entries(obj: any, ...specs_flags: number[]) {
  // combine all specs_flags in one
  const specs_flag = specs_flags.reduce((flag1, flag2) => flag1 | flag2);

  // Set_Array because JSONIFY/JSONIFIED can provoke duplicates
  const props: Set_Array = new Set_Array();
  {
    for (let flag = 0; flag < specs_flag; flag *= 2) {
      if (flag & specs_flag) {
        switch (flag) {
          case eProp_Spec.CYCLIC:
            props.concat(cyclic.entries(obj));
            break;

          case eProp_Spec.ENUM:
            props.concat(Object.entries(obj));
            break;

          case eProp_Spec.NOT_ENUM:
            props.concat(not_enum.entries(obj));
            break;

          case eProp_Spec.JSONIFIED:
            props.concat(jsonified.entries(obj));
            break;

          case eProp_Spec.JSONIFY:
            props.concat(jsonify.entries(obj));
            break;

          default:
            logger.error = "Unhandled flag " + flag;
        }
      }
    }
  }

  return props;
}
