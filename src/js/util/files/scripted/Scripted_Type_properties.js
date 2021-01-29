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
class Scripted_Type_properties {
  static get instances() {
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

  static get lengthes() {
    return {};
  }

  static get regex() {
    return {};
  }
}

util.obj.Obj.export(module, Scripted_Type_properties);
