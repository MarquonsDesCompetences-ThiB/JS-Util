"use strict";
import { obj, string } from "../../../both/types/_types.js";
import { join as join_path, sep as os_path_separator } from "path";
import { specs as obj_specs } from "@src/both/types/obj/_obj.js";
import { eMode } from "../enums";
import * as fs from "fs";

export abstract class File_props extends obj.Obj {
  //
  // === FILE ===
  /**
   * Default is READ_EXISTING ('r')
   * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fspromises_open_path_flags_mode
   */
  protected _mode: eMode;
  /**
   * File handle
   * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_class_filehandle
   */
  protected file_handle: fs.promises.FileHandle;

  /**
   * Write stream
   * https://nodejs.org/dist/latest-v15.x/docs/api/stream.html#stream_class_stream_writable
   */
  protected write_stream: fs.WriteStream;

  //
  // === STATE ===
  get is_open() {
    return this.file_handle != null || this.write_stream != null;
  }

  get is_closed() {
    return !this.is_open;
  }

  get mode() {
    return this._mode;
  }

  //
  // === CONTENT ===
  /**
   * Content as an 2 dimensionals array
   */
  #_cntnt_2rr?: any[][];

  /**
   * Content as a string
   */
  #_cntnt_str?: string;

  get content(): string | any[][] {
    if (this.#_cntnt_2rr) {
      return this.#_cntnt_2rr;
    }

    return this.#_cntnt_str;
  }

  //
  // === Content setter
  @obj_specs.decs.meths.enum
  set content(content: string | any[][]) {
    if (content as string) {
      this.#_cntnt_str = <string>content;
      return;
    }

    if (content instanceof Array) {
      this.#_cntnt_2rr = content;
      return;
    }
  }

  set append_content(data: string) {
    if (!this.#_cntnt_str) {
      this.#_cntnt_str = data;
      return;
    }

    this.#_cntnt_str += data;
  }

  /**
   * === File EXTENSION ===
   * Without dot
   */
  #_xt: string;
  get ext() {
    return this.#_xt;
  }

  @obj_specs.decs.meths.enum
  set ext(ext) {
    //
    // Remove forbidden characters from name and set
    {
      const formatted = ext.match(/[^:\*\?"<>\|]/g).join("");
      // remove eventual starting dot and spaces
      this.#_xt = formatted.replace(/^\s*\.\s*/, "");
    }
  }

  /**
   * === Full name : name + .ext ===
   */
  get full_name() {
    return this.name + (this.ext != null ? "." + this.ext : "");
  }

  /**
   * Parse the specified name to split name and extension
   */
  @obj_specs.decs.meths.enum
  set full_name(full_name: string) {
    const last_dot_idx = full_name.lastIndexOf(".");
    if (last_dot_idx < 0) {
      this.#_n = full_name;
      return;
    }

    this.#_n = full_name.slice(0, last_dot_idx);
    this.#_xt = full_name.slice(last_dot_idx + 1);
  }

  /**
   * === Full path : full_name + path ===
   */
  get full_path() {
    const path = this.path;
    const full_name = this.full_name;

    if (path) {
      if (full_name) {
        return join_path(path, full_name);
      }

      return path;
    }

    return full_name;
  }

  /**
   * Parse the specified path to split directories path,
   * file's name and extension
   */
  @obj_specs.decs.meths.enum
  set full_path(full_path: string) {
    const last_delimiter_idx = full_path.lastIndexOf(os_path_separator);
    if (last_delimiter_idx < 0) {
      this.#_p = full_path;
      return;
    }

    this.#_p = full_path.slice(0, last_delimiter_idx + 1);
    this.full_name = full_path.slice(last_delimiter_idx + 1);
  }

  /**
   * === File NAME ===
   */
  #_n: string;
  get name() {
    return this.#_n;
  }

  @obj_specs.decs.meths.enum
  set name(name) {
    //
    // Remove forbidden characters from name and set
    {
      const formatted = name.match(/[^:\*\?"<>\|]/g).join("");
      this.#_n = formatted;
    }
  }

  /**
   * === File PATH ===
   * Ending backslash is added
   * if ending slash/backslash's missing
   */
  #_p: string;
  get path() {
    return this.#_p;
  }

  @obj_specs.decs.meths.enum
  set path(path) {
    //
    // Remove forbidden characters from path and set
    {
      /*
            Keep ':' preceded by a drive letter
            Keep everything else which is not : * ? " < > |
          
      const formatted = path.match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g).join("");*/

      this.#_p = path;
      //
      // No ending slash or backslash
      if (!/(\/|\\)$/.test(this.#_p)) {
        this.#_p += os_path_separator;
      }
    }
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

  get nb() {
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
      if (string.is(this.content) || this.content instanceof Array) {
        return this.content.length;
      }

      if (typeof this.content === "object") {
        return Object.values(this.content).length;
      }

      const msg =
        "Wrong content type for file " +
        this.name +
        ". Expected string, array or object";
      logger.error = msg;
      throw TypeError(msg);
    }
  }

  @obj_specs.decs.meths.enum
  set nb(nb) {
    const symb = Symbol.for("_nb_rws");

    {
      if (this[symb] == null) {
        this.define_property(symb, {
          writable: true,
          enumerable: false,
          configurable: false,
        });
      }
    }

    this[symb] = nb;
  }

  /**
   * Updates to apply in file
   */
  protected output_updates: Object;
}
