"use strict";

class Localized_Texts_properties {
  /**
   * {Object}
   * Getter to be const
   */
  static get instances() {
    return {
      /**
       * Default language code
       */
      default: {
        value: "fr",
        enumerable: true,
        writable: false,
        configurable: false,
      },

      /**
       * {Object}
       * All localized texts by language_code
       */
      texts: {
        enumerable: true,
        writable: true,
        configurable: false,
      },
    };
  }
}

util.obj.Obj.export(module, Localized_Texts_properties);
