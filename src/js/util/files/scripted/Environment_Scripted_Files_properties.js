"use strict";
/**
 * Object types usable by values
 *
 * Files with 3 columns :
 *     - type name
 *     - value type (type of value specified in the 3rd column)
 *         - class
 *         - number
 *         - string
 *     - class path (loaded with Node#require())
 *         or raw value (integer, float or string)
 */
class Environment_Scripted_Files_properties extends util.obj.Properties {
  static get instances() {
    return {
      files_path: {
        value: undefined,
        enumerable: true,
        writable: true,
        configurable: false,
      },

      types: {
        value: {
          objects: {
            //
            // Basic JS objects
            Array: Array,
            Date: Date,
            number: Number,
            Number: Number,
            Object: Object,
            string: String,
            String: String,
            null: null,
            undefined: undefined,
          },
          files: {},
          //
          // string[types.files keys]
          //files_order_loading: [],
        },
        enumerable: true,
        writable: true,
        configurable: false,
      },

      /**
       * Global values
       */
      global: {
        value: {
          false: false,
          null: null,
          true: true,
          undefined: undefined,
        },
        enumerable: true,
        writable: true,
        configurable: false,
      },

      values: {
        value: {
          files: {},
          //
          // object associating types.objects keys to string[values.files keys]
          //files_order_loading: {},
        },
        enumerable: true,
        writable: true,
        configurable: false,
      },

      /**
       * {test_file_fullpath{string}-> fixtures{Scripted_File}[]}
       * Tests
       * To kep track of running tests and knowing what to release
       */
      tests_files: {
        value: new Map(),
        enumerable: true,
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

util.obj.Obj.export(module, Environment_Scripted_Files_properties);
