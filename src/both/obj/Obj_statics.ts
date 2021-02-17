"use strict";
import util from "util";

export function exports_(module, to_export) {
  Object.seal(to_export);

  if (typeof process !== "undefined" && module) {
    /*module.exports = to_export.constructor
        ? to_export.constructor
        : to_export;*/
    module.exports = to_export;
  }
}

export function clone(object: any) {
  switch (typeof object) {
    case "boolean":
      return new Boolean(object);
      break;

    case "number":
      return object + 0;
      break;

    case "string":
      return object + "";
      break;

    case "object":
      if (object instanceof Array) {
        let arr = [];
        for (let i = 0; i < object.length; i++) {
          const clone_obj = clone(object[i]);
          if (clone_obj) {
            arr.push(clone_obj);
          } else {
            arr.push(object[i]);
          }
        }
      } else if (object.get_cloned_JSON) {
        return object.get_cloned_JSON();
      }
      break;
  }
  // function | object without get_cloned_JSON()
  return undefined;
}

/**
 * Concatenate child props to parent props making an overriding :
 *   If no value in child_props but in parent_props, child_props' remains
 *   child_props' getter (if any) first calls parent_props' getter (if any)
 *   child_props' setter (if any) first calls parent_props' setter (if any)
 *
 * @param {Obj_Properties.props} parent_props If null, child_props is returned
 * @param {Obj_Properties.props} child_props If null, parent_props is returned
 *
 * @rturn {Obj_Properties.props}
 */
export function concat(parent_props, child_props) {
  //
  // Check preconds
  {
    if (!parent_props) {
      return child_props;
    }

    if (!child_props) {
      return parent_props;
    }
  }

  let final_props = parent_props;
  const props_c = child_props;

  //
  // Iterate child properties to add them to final_props
  for (const prop in props_c) {
    //
    // Just append the child property
    {
      if (!final_props[prop]) {
        final_props[prop] = props_c[prop];
        continue;
      }
    }

    //
    // Else merge the props : child call the parent
    {
      //
      // Set child value if any
      {
        if (props_c[prop].value) {
          final_props[prop].value = props_c[prop].value;
        }
      }

      //
      // Set getter if any,
      // which calls super getter if any
      {
        if (props_c[prop].get) {
          if (final_props[prop].get) {
            final_props[prop].get = new_getter(
              final_props[prop].get,
              props_c[prop].get
            );

            /**
             * Return a function calling first getter1 then getter2
             * @param {*} getter1
             * @param {*} getter2
             */
            function new_getter(getter1, getter2) {
              return () => {
                getter1();
                return getter2();
              };
            }
          } else {
            final_props[prop].get = props_c[prop].get;
          }
        }
      }

      //
      // Set setter if any,
      // which calls super setter if any
      {
        if (props_c[prop].set) {
          if (final_props[prop].set) {
            final_props[prop].set = new_setter(
              final_props[prop].set,
              props_c[prop].set
            );

            /**
             * Return a function with 1 argument
             * calling first setter1 then setter2
             * @param {*} setter1
             * @param {*} setter2
             */
            function new_setter(setter1, setter2) {
              return (value) => {
                setter1(value);
                setter2(value);
              };
            }
          } else {
            final_props[prop].set = props_c[prop].set;
          }
        }
      }
    }
  }

  return final_props;
}

/**
 *** Object.appendChain(@object, @prototype)
 *
 * Appends the first non-native prototype of a chain to a new prototype.
 * Returns @object (if it was a primitive value it will transformed into an object).
 *
 *** Object.appendChain(@object [, "@arg_name_1", "@arg_name_2", "@arg_name_3", "..."], "@function_body")
 *** Object.appendChain(@object [, "@arg_name_1, @arg_name_2, @arg_name_3, ..."], "@function_body")
 *
 * Appends the first non-native prototype of a chain to the native Function.prototype object, then appends a
 * new Function(["@arg"(s)], "@function_body") to that chain.
 * Returns the function.
 *
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 **/

export function dynamic_extends(oChildChain, oExtendsProto) {
  if (arguments.length < 2) {
    throw new TypeError("Object.appendChain - Not enough arguments");
  }
  if (typeof oExtendsProto !== "object" && typeof oExtendsProto !== "string") {
    throw new TypeError(
      "second argument to Object.appendChain must be an object or a string"
    );
  }

  let o2nd, oLast;
  let oNewProto = oExtendsProto,
    oReturn = (o2nd = oLast =
      oChildChain instanceof Object
        ? oChildChain
        : new oChildChain.constructor(oChildChain));

  for (
    var o1st = Object.getPrototypeOf(o2nd);
    o1st !== Object.prototype && o1st !== Function.prototype;
    o1st = Object.getPrototypeOf(o2nd)
  ) {
    o2nd = o1st;
  }

  if (oExtendsProto.constructor === String) {
    oNewProto = Function.prototype;
    oReturn = Function.apply(null, Array.prototype.slice.call(arguments, 1));
    Object.setPrototypeOf(oReturn, oLast);
  }

  Object.setPrototypeOf(o2nd, oNewProto);
  return oReturn;
}

/**
 * Fetch non enumarable keys by parsing util.inspect(obj)
 * @param obj
 */
export function get_non_enumerable_keys(obj: any): string[] {
  const enum_keys = Object.keys(obj);

  const all_symbols: string = util.inspect(obj, {
    depth: 0,
    showHidden: true,
  });
  const keys = all_symbols.match(/(?<=(\{|\n)\s+)\w+(?=:)/g);

  keys.filter((key) => {
    return !enum_keys.includes(key);
  });

  return keys;
}
