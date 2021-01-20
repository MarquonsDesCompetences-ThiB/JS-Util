"use strict";

/**
 * To quickly initialize Obj with a Properties class
 */
class Obj_Properties {
  static set init(object) {
    if (!object.init_) {
      object.init_ = true;
      Object.defineProperties(object, {
        init_: {
          value: true,
          enumerable: false,
          writable: false,
          configurable: false,
        },

        enumerable: {
          enumerable: true,
          configurable: false,
        },

        not_enumerable: {
          enumerable: true,
          configurable: false,
        },

        /*
            Properties' lenghtes
        */
        lengthes: {
          enumerable: true,
          configurable: false,
        },

        /*
            Properties' regex
        */
        regex: {
          enumerable: true,
          configurable: false,
        },
      });
    }
  }

  static get props() {
    const that = this;
    return {
      enums: that.enumerable,
      not_enums: that.not_enumerable,
    };
  }

  /**
   * {Object}
   */
  static get enumerable() {
    Obj_Properties.init = Obj_Properties;
    return {
      /*-prop_name: {
        value: prop_value,
        enumerable: true,
        writable: true,
        configurable: true,
      },*/
    };
  }

  /**
   * string[]
   */
  static get not_enumerable() {
    Obj_Properties.init = Obj_Properties;
    return [
      /*"not_enum_prop1", "not_enum_prop2"*/
    ];
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

if (typeof process !== "undefined") {
  module.exports = Obj_Properties;
}
