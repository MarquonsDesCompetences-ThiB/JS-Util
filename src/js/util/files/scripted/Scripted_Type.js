"use strict";

/**
 * Preconds :
 *  global.util.obj.Obj = class Obj
 *  global.util.obj.Properties = class Properties_Obj
 */

/**
 * To mock loaded scripted object
 * Also provides useful methods
 */
class Scripted_Type extends util.obj.Obj {
  /**
   * The name a variable can match (including dots)
   * with no braces
   */
  static variable_name_regex = "\\s*((w|_)+(\\.(\\w|_)+)*)\\s*";
  /**
   * The name a variable can match (including dots)
   * with enclosing braces
   *
   *   Enclosing brackets with inside :
   *     At least 1 letter/digit/_
   *     Can have a following dot followed by at least 1 letter/digit/_
   *
   *   Brackets can be surrounded by whitespaces
   */
  static variable_name_braces_regex =
    "\\s*{" + Scripted_Type.variable_name_regex + "}\\s*";

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
   *
   * @return {*} The object pointed by accessors[0;nb_accessors-stop_from_end]
   *              Or if stop_from_end>0 :
   *                {object, last_accessor_names[stop_from_end]}
   *
   * @throws {ReferenceError} If !create_if_unexisting
   *                          and an accessor does not exist in object
   */
  static get_reference(
    object,
    accessor,
    create_if_unexisting = false,
    stop_from_end = 0
  ) {
    const accessors =
      accessor instanceof Array
        ? accessor
        : Scripted_Type.get_accessor_parts(accessor);

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
            } else {
              const msg =
                prop_name +
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

    if (stop_from_end === 0) {
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
  static get_accessor_parts(accessor) {
    //
    // Check preconds
    {
      if (!accessor) {
        const msg = "Argument accessor is undefined";
        logger.error = msg;
        throw TypeError(msg);
      }

      if (!util.text.String.is(accessor)) {
        const type = typeof accessor;
        const msg =
          "Argument accessor should be a string but is a " +
          type +
          (type === object ? " (" + type_name.constructor.name + ")" : "");
        logger.error = msg;
        throw TypeError(msg);
      }
    }

    //
    // Remove braces and undesired characters around
    const formatted = Scripted_Type.get_variable_name(accessor);

    //
    // If there is no dot => returns [accessor]
    {
      if (new RegExp(`^[^\.]{${formatted.length}}$`).test(formatted)) {
        return [formatted];
      }
    }

    /*
        Return everything which is not a dot and is either :
          - preceded by a dot and eventual spaces
          - followed by eventual spaces and a dot
      */
    return formatted.match(/(?<=\b)[^\.]+(?=\b)/g);
  }

  /**
   * Extract the first met type name removing parenthesis
   * If no parenthesis found, return the entire string
   *
   * @param {string} type_name
   * @return {string}
   */
  static get_type_name(type_name) {
    //
    // Check preconds
    {
      if (!type_name) {
        const msg = "Argument type_name is undefined";
        logger.error = msg;
        throw TypeError(msg);
      }

      if (!util.text.String.is(type_name)) {
        const type = typeof type_name;
        const msg =
          "Argument type_name should be a string but is a " +
          type +
          (type === object ? " (" + type_name.constructor.name + ")" : "");
        logger.error = msg;
        throw TypeError(msg);
      }
    }

    const types = type_name.match(/(?<=\(\s*)[^\)]*(?=\s*\))/);
    return types
      ? types[0]
      : // no parenthesis found
        type_name;
  }

  /**
   * A variable is between braces and can be formed with :
   *  letters, digits, ., _
   * @param {sring} str
   */
  static is_variable_name(str) {
    return new RegExp(
      "/^" + Scripted_Type.variable_name_braces_regex + "$/"
    ).test(str);
  }

  /**
   * Extract the first met variable name removing braces
   * If no braces found, return the entire string
   *
   * @param {string} var_name
   * @return {string}
   */
  static get_variable_name(var_name) {
    //
    // Check preconds
    {
      if (!var_name) {
        const msg = "Argument var_name is undefined";
        logger.error = msg;
        throw TypeError(msg);
      }

      if (!util.text.String.is(var_name)) {
        const type = typeof var_name;
        const msg =
          "Argument var_name should be a string but is a " +
          type +
          (type === object ? " (" + var_name.constructor.name + ")" : "");
        logger.error = msg;
        throw TypeError(msg);
      }
    }

    const vars = var_name.match(/(?<=\{{1}\s*)[^\}]*(?=\s*\}{1})/);
    return vars
      ? vars[0]
      : // no braces found
        var_name;
  }

  constructor(obj = undefined) {
    super(obj);
  }
}

Scripted_Type.init(require("./Scripted_Type_properties"), module);
