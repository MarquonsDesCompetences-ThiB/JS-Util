"use strict";
import { Xlsx_File_props } from "./_props/Xlsx_File_props.js";
import { colors } from "./_files.js";

// read jsons
import fs_extra from "fs-extra";

import * as Excel from "exceljs";

/**
 * Supports .xlsx (Excel) files
 */
export class Xlsx_File extends Xlsx_File_props {
  constructor(obj = undefined) {
    super(obj);
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
  async read(
    bLoad_content: boolean = false,
    sheet_id_or_name: string | String | number | Number = 1
  ) {
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
        this.excel = new Excel.Workbook();
        logger.log = "Reading xlsx file " + full_path + "...";
        try {
          await this.excel.xlsx.readFile(full_path);
          logger.log =
            "Getting worksheet " +
            sheet_id_or_name +
            " of " +
            this.name +
            "...";
          const worksheet = this.get_sheet(sheet_id_or_name);

          //set number of rows
          this.nb = worksheet.lastRow._number;

          logger.log = "Iterating rows of " + this.name + "...";

          //
          // Load excel
          {
            this.content = [];
            if (bLoad_content) {
              worksheet.eachRow((row, rowNumber) => {
                //remove the first empty column added by exceljs
                (<any[]>this.content).push(row.values.slice(1));
              });
            }
          }
          logger.info = this.content.length + " rows parsed in " + this.name;
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
          return reject(msg);
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
  read_row(
    row_id: number,
    sheet_id_or_name: number | string | Number | String = 1
  ) {
    {
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
        const worksheet = this.get_sheet(sheet_id_or_name);
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
  async write(sheet_id_or_name: number | string | Number | String = 1) {
    return new Promise<void>((success, reject) => {
      if (!this.excel) {
        const msg = "Excel not loaded yet; File.read(...) must be called first";
        logger.error = msg;
        return reject(msg);
      }

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
          const worksheet = this.get_sheet(sheet_id_or_name);
          worksheet.xlsx.writeFile(full_path).then(success, reject);
          return;
        }
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
    return new Promise<number>((success, reject) => {
      //
      // Excel format
      {
        if (this.excel) {
          let nb_cells_updated = 0;

          let nb_sheets_done = 0;
          const update_entries = Object.entries(this.output_updates);
          const nb_sheets_tot = update_entries.length;
          let errs = [];

          //
          // Iterate sheets
          update_entries.forEach(([sheet_id, rows]) => {
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
                    if (colors[update.bg_color]) {
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        bgColor: { argb: colors[update.bg_color].argb },
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
                        Object.keys(colors).join(", ");
                    }
                  }

                  //
                  // Foreground color
                  if (update.fg_color) {
                    if (colors[update.fg_color]) {
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: colors[update.fg_color].argb },
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
                        Object.keys(colors).join(", ");
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
    return new Promise<number>((success, reject) => {
      this.apply_updates().then((nb_elmts_updated) => {
        delete this.content;
        delete this.excel;
        success(nb_elmts_updated);
      }, reject);
    });
  }
}
