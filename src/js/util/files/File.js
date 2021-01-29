"use strict";
/**
 * Preconds
 *  global.util.obj.Obj = class Obj
 */
// read jsons
const json_file = require("jsonfile");
const fs_extra = require("fs-extra");
// read strings
const file_string_reader = require("read-file-string");

const Json = require(process.env.SRC_ROOT + "dist/js/util/obj/Json");

const Excel = require("exceljs");

/**
 * Supports .xlsx (Excel) files
 */
class File extends util.obj.Obj {
  constructor(obj = undefined) {
    super(obj);
  }

  /**
   *
   * @param {File} other_file
   *
   * @return {Promise}
   */
  async merge_file(other_file) {
    return new Promise((success, reject) => {
      //
      // Read this file if needed
      {
        if (!this.content) {
          return this.read().then(
            () => {
              on_read1.apply(this);
            },
            (error) => {
              reject(error);
            }
          );
        }
      }

      on_read1.apply(this);
      function on_read1() {
        //
        // Read other file if needed
        {
          if (!other_file.content) {
            return other_file.read().then(
              () => {
                on_read2.apply(this);
              },
              (error) => {
                reject(error);
              }
            );
          }
        }

        on_read2.apply(this);
        function on_read2() {
          //
          // Merge
          Json.merge(this.content, other_file.content);
          this.write().then(success, reject);
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
  async merge(other_file) {
    return new Promise((success, reject) => {
      if (!this.content) {
        return this.read().then(
          () => on_read_file1.apply(this),
          (error) => {
            reject(error);
          }
        );
      }

      on_read_file1.apply(this);
      function on_read_file1() {
        if (!other_file.content) {
          return other_file.read().then(
            () => {
              on_read_file2.apply(this);
            },
            (error) => {
              reject(error);
            }
          );
        }

        on_read_file2.apply(this);
        function on_read_file2() {
          Object.assign(this.content, other_file.content);
          this.write().then(success, reject);
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
    return new Promise(async (success, reject) => {
      const full_path = this.full_path;
      if (
        full_path == null ||
        // because full_path is the cocnatenation of both below
        this.path == null ||
        this.name == null
      ) {
        const msg =
          "Undefined full path ; path : " + this.path + " name : " + this.name;
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
          if (this.ext === "xlsx") {
            this.excel = new Excel.Workbook();
            logger.log = "Reading xlsx file " + full_path + "...";
            try {
              await this.excel.xlsx.readFile(full_path);
              logger.log =
                "Getting worksheet " +
                Number.parseInt(asText_or_sheetId) +
                " of " +
                this.name +
                "...";
              const worksheet = this.excel.getWorksheet(
                Number.parseInt(asText_or_sheetId)
              );

              //set number of rows
              this.nb = worksheet.lastRow._number;

              logger.log = "Iterating rows of " + this.name + "...";

              //
              // Load excel
              {
                this.content = [];
                worksheet.eachRow((row, rowNumber) => {
                  //remove the first empty column added by exceljs
                  this.content.push(row.values.slice(1));
                });
              }
              logger.info =
                this.content.length + " rows parsed in " + this.name;
              return success(this.content);
            } catch (ex) {
              const msg =
                "Error reading xlsx file " +
                this.name +
                " : " +
                ex +
                "\n" +
                ex.stack
                  ? ex.stack
                  : "";
              logger.error = msg;
              return reject(msg, this.content);
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
                this.content = undefined;
                return reject(msg);
              }

              this.content = result;
              logger.info =
                result.length + " characters parsed in " + this.name;
              return success(this.content);
            });
          }
        }

        //
        // Json file
        {
          json_file.readFile(full_path, function (err, obj) {
            if (err) {
              logger.error =
                "File#read Error reading file " +
                full_path +
                " as json : " +
                err;
              this.content = undefined;
              return reject(err);
            }

            logger.info = "Json file " + this.name + " parsed";
            this.content = obj;
            success(this.content);
          });
        }
      }
    });
  }

  /**
   * Return the requested row by directly reading the file
   * Result not stored in this.content
   *
   * @param {integer} row_id
   * @param {integer | string | undefined} sheet_id_or_name
   *                                        For xlsx files
   *                                        Sheet's id or name
   *                                        Removing/adding sheets make
   *                                        their id not to stay ordered
   *                                        in 1.. !
   *                                        =>sheet 1 might not exist but 2
   * @return {*[]} Row content by column
   */
  read_row(row_id, sheet_id_or_name = 1) {
    //
    // Currently only for Excel files
    {
      if (this.ext !== "xlsx") {
        const msg =
          "File.read_row(...) feature is only available for xlsx files";
        logger.error = msg;
        return undefined;
      }

      if (!this.excel) {
        const msg = "File.read(...) must be called first";
        logger.error = msg;
        return undefined;
      }
    }

    //
    // Excel file
    {
      try {
        const worksheet = this.excel.getWorksheet(sheet_id_or_name);
        const row = worksheet.getRow(row_id).values;

        logger.info =
          "File " +
          this.name +
          " : Row " +
          row_id +
          " parsed -> " +
          row.length +
          " retrieved columns";

        return row;
      } catch (ex) {
        const msg =
          "Error reading row " +
          row_id +
          " from xlsx file " +
          this.name +
          " : " +
          ex;
        logger.error = msg;
        throw msg;
      }
    }
  }

  /**
   *
   * @param {integer | string | undefined} sheet_id_or_name
   *                                        For xlsx files
   *                                        Sheet's id or name
   *                                        Removing/adding sheets make
   *                                        their id not to stay ordered
   *                                        in 1.. !
   *                                        =>sheet 1 might not exist but 2
   * @return {Promise}  Success
   *                    Reject: {string} err
   */
  async write(sheet_id_or_name = 1) {
    return new Promise((success, reject) => {
      const full_path = this.full_path;
      if (
        full_path == null ||
        //because full_path is the concatenation of both below
        this.name == null ||
        this.path == null
      ) {
        const msg =
          "Undefined full path ; path : " + this.path + " name : " + this.name;
        return reject(msg);
      }

      //
      // Excel
      {
        if (this.excel) {
          const worksheet = this.excel.getWorksheet(sheet_id_or_name);
          worksheet.xlsx.writeFile(full_path).then(success, reject);
          return;
        }
      }

      //
      // Json
      {
        fs_extra.ensureFileSync(full_path);
        json_file.writeFile(full_path, this.content, (err) => {
          if (err) {
            const msg = "Error writing file " + full_path + " : " + err;
            logger.error = msg;
            return reject(msg);
          }

          logger.log = "File " + full_path + " is written";
          success();
        });
      }
    });
  }

  /**
   * Apply this.output_updates => write file
   *
   * @return {Promise}
   *                  Success: {integer} Nb elements udpated
   *                                    xlsx : Nb cells
   */
  async apply_updates() {
    return new Promise((success, reject) => {
      //
      // Excel format
      {
        if (this.excel) {
          let nb_cells_updated = 0;

          let nb_sheets_done = 0;
          const nb_sheets_tot = this.output_updates.length;
          let errs = [];

          //
          // Iterate sheets
          this.output_updates.forEach((rows, sheet_id) => {
            const worksheet = this.excel.getWorksheet(sheet_id);

            //
            // Iterate rows
            rows.forEach((cols, row_id) => {
              const row = worksheet.getRow(row_id).values;

              //
              // Iterate columns
              cols.forEach((update, col_idx) => {
                let cell = row.getCell(col_idx);

                //
                // Set updates
                {
                  //
                  // Background color
                  if (update.bg_color) {
                    if (File.colors[update.bg_color]) {
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        bgColor: { argb: File.colors[update.bg_color].argb },
                      };
                    } else {
                      logger.warn =
                        "Unknown color " +
                        update.bg_color +
                        " to apply to background of cell " +
                        row_id +
                        "," +
                        col_idx +
                        " in file " +
                        this.name +
                        ". Valid colors : " +
                        Object.keys(File.colors).join(", ");
                    }
                  }

                  //
                  // Foreground color
                  if (update.fg_color) {
                    if (File.colors[update.fg_color]) {
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: File.colors[update.fg_color].argb },
                      };
                    } else {
                      logger.warn =
                        "Unknown color " +
                        update.fg_color +
                        " to apply to foreground of cell " +
                        row_id +
                        "," +
                        col_idx +
                        " in file " +
                        this.name +
                        ". Valid colors : " +
                        Object.keys(File.colors).join(", ");
                    }
                  }

                  //
                  // Comment
                  if (update.comment) {
                    cell.note = update.comment;
                  }
                }

                nb_cells_updated++;
              });
            });

            this.write(sheet_id).then(on_sheet, on_reject);
          });

          function on_reject(err) {
            logger.error = err;
            errs.push(err);
          }

          function on_sheet() {
            nb_sheets_done++;
            if (nb_sheets_done !== nb_sheets_tot) {
              return;
            }

            if (errs.length === 0) {
              success(nb_cells_updated);
            } else {
              reject(errs);
            }
          }

          return;
        }
      }

      {
        const msg =
          "Unimplemented format " + this.ext + " (file " + this.name + ")";
        logger.error = msg;
        reject(msg);
      }
    });
  }

  /**
   * @return {Promise} Cf. this.apply_updates
   */
  async release() {
    return new Promise((success, reject) => {
      this.apply_updates().then((nb_elmts_updated) => {
        this.content = undefined;
        this.excel = undefined;
        success(nb_elmts_updated);
      }, reject);
    });
  }
}

Object.assign(File, require("./File_statics"));
File.init(require("./File_properties"), module);
