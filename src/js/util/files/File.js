"use strict";
/**
 * Preconds
 *  global.util.obj.Obj = class Obj
 */
// read jsons
const file = require("jsonfile");
const fs_extra = require("fs-extra");
// read strings
const file_string_reader = require("read-file-string");

const Json = require(process.env.SRC_ROOT + "dist/js/util/obj/Json");

const parseXlsx = require("excel");

/**
 * Supports .xlsx (Excel) files
 */
const File = (function () {
  class properties extends util.obj.Properties {
    static get enumerable() {
      util.obj.Properties.init = properties;
      return {
        path: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        name: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        ext: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        content: {
          value: undefined,
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

  class File_ extends util.obj.Obj {
    constructor(obj = undefined, update_members = false) {
      super(obj, update_members);
      this.properties = properties.props;
    }

    merge_file(other_file, cbk) {
      let that = this;
      //
      // Read this file if needed
      {
        if (!this.content) {
          this.read(function (err) {
            if (err) {
              const msg =
                "Error reading this file : " + err + " ; abort merging";
              logger.error("File#merge_file " + msg);
              return cbk(msg);
            }

            that.merge_file(other_file, cbk);
          });
        }
      }

      //
      // Read other file if needed
      {
        if (!other_file.content) {
          other_file.read(function (err) {
            if (err) {
              const msg =
                "Error reading other file : " + err + " ; abort merging";
              logger.error("File#merge_file " + msg);
              return cbk(msg);
            }

            that.merge_file(other_file, cbk);
          });
        }
      }

      //
      // Merge
      Json.merge(this.content, other_file.content);
      this.write(cbk);
    }

    clone() {
      return new File({
        path: this.path + "",
        name: this.name + "",
        ext: this.ext + "",
        content: JSON.parse(JSON.stringify(this.content)),
      });
    }

    get_JSON() {
      return {
        path: this.path,
        name: this.name,
        ext: this.ext,
        content: this.content, //Json
      };
    }

    set(obj) {
      if (typeof obj === "undefined") {
        return;
      }

      if (typeof obj.path !== "undefined") {
        this.path = obj.path;

        //adds an end slash if missing
        if (this.path[this.path.length - 1] !== "/") {
          this.path += "/";
        }
      }

      if (typeof obj.name !== "undefined") {
        this.name = obj.name;
      }

      if (typeof obj.ext !== "undefined") {
        this.ext = obj.ext;

        //remove the beginning dot if any
        if (this.ext[0] === ".") {
          this.ext = this.ext.substring(1, this.ext.length);
        }
      }

      if (typeof obj.content !== "undefined") {
        this.content = obj.content;
      }

      return this;
    }

    get_full_name() {
      return this.name + (this.ext != null) ? "." + this.ext : "";
    }

    get_full_path() {
      return this.path + this.get_full_name();
    }

    merge(other_file) {
      if (!this.content) {
        return this.read(on_read_file1);
      }
      on_read_file1();

      function on_read_file1(err) {
        if (err) {
          const msg = "Error reading this file to be merged : " + err;
          logger.error("File#merge::on_read_file1 " + msg);
          return cbk(msg);
        }

        if (!other_file.content) {
          return this.read(on_read_file2);
        }
        on_read_file2();
      }

      function on_read_file2(err) {
        if (err) {
          const msg = "Error reading other file to merge : " + err;
          logger.error("File#merge::on_read_file2 " + msg);
          return cbk(msg);
        }

        Object.assign(this.content, other_file.content);
        let that = this;
        this.write(function (err) {
          if (err) {
            const msg = "Error writing merged files : " + err;
            logger.error("File#merge::on_read_file2::write " + msg);
            return cbk(msg);
          }
          logger.log(
            "File#merge::on_read_file2::write Merged files writtent to " +
              that.get_full_path()
          );
          cbk();
        });
      }
    }

    /**
     *
     * @param {function} cbk
     * @param {boolean | integer | optional} read_as_text|sheet_id
     *                                        read_as_text :
     *                                          If file must be read as string,
     *                                          not as json
     *                                        sheet_id :
     *                                          For xlsx files, the sheet to read
     *
     * @return {bool} true if reading file could run
     */
    read(cbk, asText_or_sheetId = 0) {
      const full_path = this.get_full_path();
      if (typeof full_path === "undefined") {
        console.error(
          "File#read Undefined full path ; path : " +
            this.path +
            " name : " +
            this.name
        );
        return false;
      }

      fs_extra.ensureFileSync(full_path);

      //
      // Read file
      {
        let that = this;
        //
        // Excel file
        {
          if (this.ext === "xlsx") {
            parseXlsx(full_path, Number.parseInt(asText_or_sheetId)).then(
              (data) => {
                that.content = data; //array of arrays
                cbk(undefined, that.content);
              }
            );
            return true;
          }
        }

        //
        // String file
        {
          if (asText_or_sheetId) {
            file_string_reader(full_path).then((result) => {
              if (!result) {
                const msg = "Error reading file " + full_path + " as text";
                console.error("File#read " + msg);
                that.content = "";
                cbk(msg);
              }
            });
            return true;
          }
        }

        //
        // Json file
        {
          file.readFile(full_path, function (err, obj) {
            if (err) {
              console.error(
                "File#read Error reading file " +
                  full_path +
                  " as json : " +
                  err
              );
              that.content = {};
              cbk(err);
              return;
            }

            console.log("File#read file " + full_path + " is read");
            that.content = obj;
            cbk(undefined, that.content);
          });
          return true;
        }
      }
    }

    write(cbk) {
      const full_path = this.get_full_path();
      if (typeof full_path === "undefined") {
        console.error(
          "File#write Undefined full path ; path : " +
            this.path +
            " name : " +
            this.name
        );
        return undefined;
      }

      fs_extra.ensureFileSync(full_path);

      let that = this;
      file.writeFile(full_path, this.content, function (err) {
        if (err) {
          console.error(
            "File#write Error writing file " + full_path + " : " + err
          );
          cbk(err);
          return;
        }

        console.log("File#write file " + full_path + " is written");
        cbk(undefined);
      });
    }
  }

  return File_.prototype.constructor;
})();

if (typeof process !== "undefined") {
  module.exports = File;
}
