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
const Scripted_Type = (function () {
  class properties extends util.obj.Properties {
    static get enumerable() {
      util.obj.Properties.init = properties;
      return {
        /**
         * {constructor}
         */
        object: {
          enumerable: true,
          writable: true,
          configurable: false,
        },

        /**
         * {string}
         */
        type_name: {
          enumerable: true,
          writable: true,
          configurable: false,
        },

        /**
         * object[]
         */
        instances: {
          enumerable: true,
          writable: true,
          configurable: false,
        },
      };
    }

    static get not_enumerable() {
      util.obj.Properties.init = properties;
      return [];
    }

    static get lengthes() {
      util.obj.Properties.init = properties;

      return {};
    }

    static get regex() {
      util.obj.Properties.init = properties;
      return {};
    }
  }

  class Scripted_Type_ extends util.obj.Obj {
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
      "\\s*{" + Scripted_Type_.variable_name_regex + "}\\s*";

    /**
     * Return an array of every words between dots
     * Remove eventual spaces around dots
     * @param {string} accessor
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
        if (formatted.test(new RegExp("/^[^.]{" + formatted.length + "}$/"))) {
          return [formatted];
        }
      }

      /*
        Return everything which is not a dot and is either :
          - preceded by a dot and eventual spaces
          - followed by eventual spaces and a dot
      */
      return formatted.match(/(?<=\.\s*)[^\.]+ | [^\.]+(?=\s*\.)/g);
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

      const vars = var_name.match(/(?<=\{\s*)[^\}]*(?=\s*\})/);
      return vars
        ? vars[0]
        : // no braces found
          var_name;
    }

    constructor(obj = undefined, update_members = false) {
      super(obj, update_members);
      this.properties = properties.props;
    }
  }

  return Scripted_Type_.prototype.constructor;
})();

if (typeof process !== "undefined") {
  module.exports = Scripted_Type;
}
