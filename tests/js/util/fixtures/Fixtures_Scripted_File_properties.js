"use strict";

/**
 * Column containing row names must be
 * called either Name or Id (case sensitive)
 *
 * Expectd coumns :
 *    super.cols_names stores variable name to check
 *    super.cols_types stores reference to expecteds[i]
 */
class Fixtures_Scripted_File_properties {
  static get instances() {
    return {
      /**
       * {Environment_Scripted_File}
       */
      env: {
        enumerable: true,
        configurable: false,

        get() {
          return this._nv;
        },

        set(env) {
          this._nv = env;

          this.path = env.files_path + (this.path ? this.path : "");
          this.get_object = function () {
            this._nv.get_object(...arguments);
          };
          this.request_type = function () {
            this._nv.get_type(...arguments);
          };
        },
      },

      _nv: {
        writable: true,
      },

      /**
       * {Object[row_id]}
       * Associates rows' id to rows' description
       *
       * row_description : {id, name, template_name}
       *                    cf. Scripted_File.parse_row_name
       */
      rows_descriptions: {
        value: [],
        enumerable: true,
        writable: false,
      },

      /**
       * {Asserts_Scripted}
       */
      expecteds: {
        value: [],
        enumerable: true,
        writable: false,
        configurable: false,
      },

      /**
       * integer[]
       * The last asserted expected field id
       * rows_asserts_progress.length <= content.length
       * rows_asserts_progress[i] < expecteds.length
       */
      rows_asserts_progress: {
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

util.obj.Obj.export(module, Fixtures_Scripted_File_properties);
