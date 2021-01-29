"use strict";

class File_Properties extends util.obj.Properties {
  static get props() {
    return {
      full_name: File_Properties.full_name,
      full_path: File_Properties.full_path,

      ext: File_Properties.ext,
      name: File_Properties.name,
      path: File_Properties.path,

      //
      // === Content
      nb: File_Properties.nb,

      content: {
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

  //
  // === GETTERS / SETTERS ===
  /**
   * === File EXTENSION ===
   * Without dot
   */

  static get ext() {
    return {
      enumerable: true,
      configurable: false,

      get: function () {
        return this._e;
      },

      set: function (ext) {
        if (!this._e) {
          Object.defineProperty(this, "_n", {
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
          this._e = formatted.replace(/^\s*\.\s*/, "");
        }
      },
    };
  }

  /**
   * === Full name : name + .ext ===
   */
  static get full_name() {
    return {
      enumerable: true,
      configurable: false,

      get: function () {
        return this.name + (this.ext != null ? "." + this.ext : "");
      },
    };
  }
  /**
   * === Full path : full_name + path ===
   */
  static get full_path() {
    return {
      enumerable: true,
      configurable: false,

      get: function () {
        return this.path + this.full_name;
      },
    };
  }

  /**
   * === File NAME ===
   */
  static get name() {
    return {
      enumerable: true,
      configurable: false,

      get: function () {
        return this._n;
      },
      set: function (name) {
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
    };
  }

  /**
   * === File PATH ===
   * Ending backslash is added
   * if ending slash/backslash's missing
   */
  static get path() {
    return {
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
          const formatted = path.match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g).join("");
          this._p = formatted;
          //
          // No ending slash or backslash
          if (!/(\/|\\)$/.test(this._p)) {
            this._p += "\\";
          }
        }
      },
    };
  }

  //
  // === CONTENT ===
  /**
   * Return the number of items in files (if read)
   * Can be a number of :
   * objects (json files),
   * characters (string files),
   * rows (excel file or converted to array)
   */
  static get nb() {
    return {
      enumerable: true,
      configurable: false,

      get: function () {
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
      },
    };
  }
}

util.obj.Obj.export(module, File_Properties);
