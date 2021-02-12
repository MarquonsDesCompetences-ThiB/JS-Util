"use strict";
import { File_props } from "./_props/File_props.js";
import { json } from "@src/both/_both";

// read jsons
import json_file from "jsonfile";
import fs_extra from "fs-extra";
// read strings
import file_string_reader from "read-file-string";

/**
 *
 */
export class File extends File_props {
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
          json.merge(this.content, other_file.content);
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

  toJSON() {
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
  async read(asText?: boolean) {
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
        // String file
        {
          if (asText) {
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
   * @return {*[]} Row content
   */
  read_row(row_id: number) {
    const content = this.content;
    if (content instanceof Array) {
      return content[0];
    }

    return content.replace(new RegExp(`/^([^\n]\n){${row_id}}([^\n]\n)`), "$2");
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
  async write(sheet_id_or_name: number | string = 1) {
    return new Promise<void>((success, reject) => {
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
    return new Promise<number>((success, reject) => {
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
        this.content = undefined;
        this.excel = undefined;
        success(nb_elmts_updated);
      }, reject);
    });
  }
}
