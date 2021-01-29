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

const Excel = require("exceljs");

/**
 * Supports .xlsx (Excel) files
 */
const File = (function () {
  const properties = require("./File_Properties");

  class File_ extends util.obj.Obj {
    constructor(obj = undefined) {
      super(obj);
      this.properties = properties.props;
    }

    /**
     *
     * @param {File} other_file
     *
     * @return {Promise}
     */
    merge_file(other_file) {
      let that = this;
      return new Promise((success, reject) => {
        //
        // Read this file if needed
        {
          if (!that.content) {
            return that.read().then(on_read1, (error) => {
              reject(error);
            });
          }
        }

        on_read1();
        function on_read1() {
          //
          // Read other file if needed
          {
            if (!other_file.content) {
              return other_file.read().then(on_read2, (error) => {
                reject(error);
              });
            }
          }

          on_read2();
          function on_read2() {
            //
            // Merge
            Json.merge(that.content, other_file.content);
            that.write().then(success, reject);
          }
        }
      });
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

    /**
     *
     * @param {File} other_file
     *
     * @return {Promise}
     */
    merge(other_file) {
      let that = this;
      return new Promise((success, reject) => {
        if (!that.content) {
          return that.read().then(
            () => on_read_file1,
            (error) => {
              reject(error);
            }
          );
        }

        on_read_file1();
        function on_read_file1() {
          if (!other_file.content) {
            return other_file.read().then(on_read_file2, (error) => {
              reject(error);
            });
          }

          on_read_file2();
          function on_read_file2() {
            Object.assign(that.content, other_file.content);
            that.write().then(success, reject);
          }
        }
      });
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
     * @return {Promise}  Success: {string|string[]|object} content
     *                    Reject: {string} err
     */
    async read(asText_or_sheetId = 1) {
      let that = this;
      return new Promise(async (success, reject) => {
        const full_path = that.full_path;
        if (
          full_path == null ||
          // because full_path is the cocnatenation of both below
          that.path == null ||
          that.name == null
        ) {
          const msg =
            "Undefined full path ; path : " +
            that.path +
            " name : " +
            that.name;
          logger.error = msg;
          return reject(msg);
        }

        if (!fs_extra.pathExistsSync(full_path)) {
          const msg = "Unexisting file " + full_path;
          logger.error = msg;
          return reject(msg);
        }

        //
        // Read file
        {
          //
          // Excel file
          {
            if (that.ext === "xlsx") {
              that.excel = new Excel.Workbook();
              logger.log = "Reading xlsx file " + full_path + "...";
              try {
                await that.excel.xlsx.readFile(full_path);
                logger.log =
                  "Getting worksheet " +
                  Number.parseInt(asText_or_sheetId) +
                  " of " +
                  that.name +
                  "...";
                const worksheet = that.excel.getWorksheet(
                  Number.parseInt(asText_or_sheetId)
                );
                logger.log = "Iterating rows of " + that.name + "...";

                //
                // Load excel
                {
                  that.content = [];
                  worksheet.eachRow(function (row, rowNumber) {
                    //remove the first empty column added by exceljs
                    that.content.push(row.values.slice(1));
                  });
                }
                logger.info =
                  that.content.length + " rows parsed in " + that.name;
                return success(that.content);
              } catch (ex) {
                const msg = "Error reading xlsx file " + that.name + " : " + ex;
                logger.error = msg;
                return reject(msg, that.content);
              }
            }
          }

          //
          // String file
          {
            if (asText_or_sheetId) {
              file_string_reader(full_path).then((result) => {
                if (!result) {
                  const msg = "Error reading file " + full_path + " as text";
                  logger.error = "File#read " + msg;
                  that.content = undefined;
                  return reject(msg);
                }

                that.content = result;
                logger.info =
                  result.length + " characters parsed in " + that.name;
                return success(that.content);
              });
            }
          }

          //
          // Json file
          {
            file.readFile(full_path, function (err, obj) {
              if (err) {
                logger.error =
                  "File#read Error reading file " +
                  full_path +
                  " as json : " +
                  err;
                that.content = undefined;
                return reject(err);
              }

              logger.info = "Json file " + that.name + " parsed";
              that.content = obj;
              success(that.content);
            });
          }
        }
      });
    }

    /**
     * @return {Promise}  Success
     *                    Reject: {string} err
     */
    write() {
      let that = this;
      return new Promise((success, reject) => {
        const full_path = that.full_path;
        if (
          full_path == null ||
          //because full_path is the concatenation of both below
          that.name == null ||
          that.path == null
        ) {
          const msg =
            "Undefined full path ; path : " +
            that.path +
            " name : " +
            that.name;
          return reject(msg);
        }

        fs_extra.ensureFileSync(full_path);
        file.writeFile(full_path, that.content, function (err) {
          if (err) {
            const msg = "Error writing file " + full_path + " : " + err;
            logger.error = msg;
            return reject(msg);
          }

          logger.log = "File " + full_path + " is written";
          success();
        });
      });
    }
  }

  return File_.prototype.constructor;
})();

util.obj.Obj.export(module, File);
