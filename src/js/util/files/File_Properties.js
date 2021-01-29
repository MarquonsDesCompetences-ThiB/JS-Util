"use strict";

class File_properties extends util.obj.Properties {
  //
  // === Instances' Properties ===
  static get instances() {
    return {
      content: {
        value: undefined,
        enumerable: true,
        writable: true,
        configurable: false,
      },

      /**
       * === File EXTENSION ===
       * Without dot
       */
      ext: {
        enumerable: true,
        configurable: false,

        get() {
          return this._xt;
        },

        set(ext) {
          if (!this._xt) {
            Object.defineProperty(this, "_xt", {
              configurable: false,
              enumerable: false,
              writable: true,
            });
          }

          //
          // Remove forbidden characters from name and set
          {
            const formatted = ext.match(/[^:\*\?"<>\|]/g).join("");
            // remove eventual starting dot and spaces
            this._xt = formatted.replace(/^\s*\.\s*/, "");
          }
        },
      },

      /**
       * === Full name : name + .ext ===
       */
      full_name: {
        enumerable: true,
        configurable: false,

        get() {
          return this.name + (this.ext != null ? "." + this.ext : "");
        },
      },

      /**
       * === Full path : full_name + path ===
       */
      full_path: {
        enumerable: true,
        configurable: false,

        get() {
          return this.path + this.full_name;
        },
      },

      /**
       * === File NAME ===
       */
      name: {
        enumerable: true,
        configurable: false,

        get() {
          return this._n;
        },
        set(name) {
          if (!this._n) {
            Object.defineProperty(this, "_n", {
              configurable: false,
              enumerable: false,
              writable: true,
            });
          }

          //
          // Remove forbidden characters from name and set
          {
            const formatted = name.match(/[^:\*\?"<>\|]/g).join("");
            this._n = formatted;
          }
        },
      },

      /**
       * === File PATH ===
       * Ending backslash is added
       * if ending slash/backslash's missing
       */
      path: {
        enumerable: true,
        configurable: false,

        get: function () {
          return this._p;
        },

        set: function (path) {
          if (!this._p) {
            Object.defineProperty(this, "_p", {
              configurable: false,
              enumerable: false,
              writable: true,
            });
          }

          //
          // Remove forbidden characters from path and set
          {
            /*
            Keep ':' preceded by a drive letter
            Keep everything else which is not : * ? " < > |
          */
            const formatted = path
              .match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g)
              .join("");
            this._p = formatted;
            //
            // No ending slash or backslash
            if (!/(\/|\\)$/.test(this._p)) {
              this._p += "\\";
            }
          }
        },
      },

      //
      // === CONTENT ===
      /**
       * Return the number of items in files (if read)
       * Can be a number of :
       * objects (json files),
       * characters (string files),
       * rows (excel file or converted to array)
       */
      nb: {
        enumerable: true,
        configurable: false,

        get() {
          //
          // If set
          {
            const symb = Symbol.for("_nb_rws");
            if (!this[symb] != null) {
              return this[symb];
            }
          }

          //
          // If must be computed
          {
            if (
              util.text.String.is(this.content) ||
              this.content instanceof Array
            ) {
              return this.content.length;
            }

            if (typeof this.content === "object") {
              return Object.values(this.content).length;
            }

            const msg =
              "Wrong content type (" +
              Logger.get_type_str(this.content) +
              ") for file " +
              this.name +
              ". Expected string, array or object";
            logger.error = msg;
            throw TypeError(msg);
          }
        },

        set(nb) {
          const symb = Symbol.for("_nb_rws");

          {
            if (this[symb] == null) {
              this.define_property(symb, {
                writable: true,
              });
            }
          }

          this[symb] = nb;
        },
      },

      /**
       * Updates to apply in file
       */
      output_updates: {
        value: {},
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

util.obj.Obj.export(module, File_properties);
