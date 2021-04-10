"use strict";
import { eMode, to_mode_letters } from "./enums.js";
import { File_props } from "./_props/File_props.js";
import { json } from "@both_types/_types.js";

import * as fs from "fs";
import fs_prom = fs.promises;
import fs_extra from "fs-extra";
import file_string_reader from "read-file-string";

/**
 *
 */
export class File extends File_props {
  constructor(obj = undefined) {
    super();
    if (obj) {
      this.set(obj, undefined, true);
    }
  }

  //
  // === FILE HANDLE ===
  /**
   *
   * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fspromises_open_path_flags_mode
   * http://man7.org/linux/man-pages/man2/open.2.html
   *
   * @returns
   */
  open(mode?: eMode, use_stream?: boolean): Promise<File> {
    if (use_stream) {
      return this.open_stream(mode);
    }

    if (this.file_handle) {
      return Promise.resolve(this);
    }

    if (mode) {
      this._mode = mode;
    }

    fs_prom.open(this.path, to_mode_letters(this.mode)).then((handle) => {
      this.file_handle = handle;
      return this;
    });
  }

  open_stream(mode?: eMode): Promise<File> {
    if (this.write_stream) {
      return Promise.resolve(this);
    }

    if (mode) {
      this._mode = mode;
    }

    //https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fs_createwritestream_path_options
    this.write_stream = fs.createWriteStream(this.path, {
      flags: to_mode_letters(this.mode),
    });

    return Promise.resolve(this);
  }

  close(): Promise<boolean> {
    if (this.write_stream) {
      this.write_stream.close();
    }

    if (this.file_handle) {
      return new Promise<boolean>((success) => {
        fs.close(this.file_handle.fd, (err) => {
          if (err) {
            throw err;
          }

          this.file_handle = undefined;
          success(true);
        });
      });
    }

    return Promise.resolve(true);
  }

  /**
   *
   * @param {File} other_file
   *
   * @return {Promise}
   */
  async merge_file(other_file) {
    //
    // Read this file if needed
    {
      if (!this.content) {
        return this.read().then(
          () => {
            return on_read1.call(this);
          },
          (error) => {
            return Promise.reject(error);
          }
        );
      }
    }

    return on_read1.call(this);
    function on_read1() {
      //
      // Read other file if needed
      {
        if (!other_file.content) {
          return other_file.read().then(
            () => {
              return on_read2.call(this);
            },
            (error) => {
              return Promise.reject(error);
            }
          );
        }
      }

      return on_read2.call(this);
      function on_read2() {
        //
        // Merge
        json.merge(this.content, other_file.content);
        return this.write();
      }
    }
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
    if (!this.content) {
      return this.read().then(
        () => on_read_file1.call(this),
        (error) => {
          return Promise.reject(error);
        }
      );
    }

    return on_read_file1.call(this);
    function on_read_file1() {
      if (!other_file.content) {
        return other_file.read().then(
          () => {
            return on_read_file2.call(this);
          },
          (error) => {
            return Promise.reject(error);
          }
        );
      }

      return on_read_file2.call(this);
      function on_read_file2() {
        Object.assign(this.content, other_file.content);
        return this.write();
      }
    }
  }

  async read_sequential(): Promise<any> {
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
      return Promise.reject(msg);
    }

    if (!fs_extra.pathExistsSync(full_path)) {
      const msg = "Unexisting file " + full_path;
      logger.error = msg;
      return Promise.reject(msg);
    }

    //
    // Read file
    {
      // TODO
      return;
    }
  }

  /**
   *
   * @return {Promise}  Success: {string|string[]|object} content
   *                    Reject: {string} err
   */
  async read(): Promise<string | any | (string | number)[][]> {
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
      return Promise.reject(msg);
    }

    if (!fs_extra.pathExistsSync(full_path)) {
      const msg = "Unexisting file " + full_path;
      logger.error = msg;
      return Promise.reject(msg);
    }

    //
    // Read file
    {
      return file_string_reader(full_path).then((result) => {
        if (!result) {
          const msg = "Error reading file " + full_path + " as text";
          logger.error = msg;
          this.content = undefined;
          return Promise.reject(msg);
        }

        this.content = result;
        logger.info = result.length + " characters parsed in " + this.name;
        return this.content;
      });
    }
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
   * @param{number} cursor_fileHandle If set, use a file handle :
   *                                     fs.write is directly used
   *                                     If value is a negative number,
   *                                     the cursor is not moved
   *                                     Move the cursor to the specified
   *                                     position otherwise
   *
   *                                  If not set, use a WriteStream :
   *                                  => we have to wait for the
   *                                    writing promise
   *                                  If previously used, will always be used
   *                                  whatever is the cursor_fileHandle value
   *                                  as long as the stream is not closed
   *
   *                                  WriteStream: https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fs_createwritestream_path_options
   *
   * @return {Promise}  Success
   *                    Reject: {string} err
   */
  async write(data?, cursor_fileHandle?: number): Promise<number> {
    const full_path = this.full_path;
    if (
      full_path == null ||
      //because full_path is the concatenation of both below
      this.name == null ||
      this.path == null
    ) {
      const msg =
        "Undefined full path ; path : " + this.path + " name : " + this.name;
      return Promise.reject(msg);
    }

    if (data) {
      this.content = data;
    }

    //
    // Write Stream
    {
      if (cursor_fileHandle == null) {
        if (this.write_stream) {
          return write_stream.call(this);
        }
        //
        // Open the stream
        return this.open_stream(eMode.WRITE).then(() => {
          return write_stream.call(this);
        });

        function write_stream() {
          return new Promise<number>((success) => {
            (<File>this).write_stream.write(this.content, (err) => {
              if (err) {
                throw err;
              }

              success(this.content.length);
            });
          });
        }
      }
    }

    //
    // else file handle
    {
      if (this.file_handle) {
        return write_handle.call(this);
      }
      //
      // Open the handle
      return this.open().then(() => {
        return write_handle.call(this);
      });

      function write_handle() {
        return fs_prom
          .write(
            (<File>this).file_handle,
            this.content,
            undefined,
            undefined,
            cursor_fileHandle
          )
          .then(({ bytesWritten }) => {
            return Promise.resolve(bytesWritten);
          });
      }
    }
  }

  /**
   * ppend the specified data to the file
   * @param data
   */
  async append(data, options?) {
    this.append_content = data;

    return fs_prom.appendFile(
      this.file_handle ? this.file_handle : this.path,
      data,
      options
    );
  }

  /**
   * Flush the writing
   */
  async flush() {
    //https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_filehandle_sync
    if (this.file_handle) {
      this.file_handle.sync();
    }
  }

  /**
   * Apply this.output_updates => write file
   *
   * @return {Promise}
   *                  Success: {integer} Nb elements udpated
   *                                    xlsx : Nb cells
   */
  async apply_updates() {
    return new Promise<any>((success, reject) => {
      {
        const msg =
          "Unimplemented format " + this.ext + " (file " + this.name + ")";
        logger.error = msg;
        reject(msg);
      }

      //TODO
    });
  }

  /**
   * @return {Promise} Cf. this.apply_updates
   */
  async release() {
    return this.apply_updates().then((updated_elmts) => {
      this.content = undefined;
      return updated_elmts;
    });
  }

  //
  // === LOGS ===
  // Preconds : global.Logger loaded
  set error(ex: string | Error) {
    if (ex instanceof Error) {
      ex.message = "File " + this.name + " : " + ex.message;
      logger.error = ex;
    } else {
      logger.error = "File " + this.name + " : " + ex;
    }
  }

  set info(msg: string) {
    logger.info = "File " + this.name + " : " + msg;
  }

  set log(msg: string) {
    logger.log = "File " + this.name + " : " + msg;
  }

  set trace(msg: string) {
    logger.trace = "File " + this.name + " : " + msg;
  }

  set warn(msg: string) {
    logger.warn = "File " + this.name + " : " + msg;
  }
}
