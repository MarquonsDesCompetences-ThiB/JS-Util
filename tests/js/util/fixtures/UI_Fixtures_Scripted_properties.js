"use strict";
/**
 * Preconds
 *  global.util.obj.Obj = class Obj
 *  process.env.SRC_ROOT = path to sources files' root
 */

/**
 * Make http requests, Jquery interactions
 */
class UI_Fixtures_Scripted_properties {
  static get instances() {
    return {
      /**
       * {Express App object}
       * Http app to test
       */
      http_app: {
        value: undefined,
        enumerable: true,
        writable: true,
        configurable: false,
      },

      /**
       * Object{}
       *   <method> <url> :
       *      res
       *      body {Jquery element}
       *
       */
      pages: {
        value: undefined,
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

util.obj.Obj.export(module, UI_Fixtures_Scripted_properties);
