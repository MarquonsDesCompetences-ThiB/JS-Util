"use strict";
import fs from "fs";
//import File_  from process.env.SRC_ROOT + "dist/js/util/files/File.js";
import * as log_infos from "./infos.js";
import { Logger_props } from "./_props/Logger_props.js";

export class Logger extends Logger_props {
  /**
   * Override of stream.Writable._write
   * https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback_1
   */
  _write(
    chunk: Buffer | string | any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    let nb_cbks_done = 0;
    const nb_cbks_tot = 1 + (this._thrs_strms ? this._thrs_strms.length : 0);
    const errs = [];

    //
    // Process this stream
    {
      /* do log to file */
      if (this.file_desc != null) {
        let buffer: Buffer;

        if (chunk as string) {
          buffer = Buffer.from(chunk + chunk.EOL);
        } else {
          buffer = chunk;
        }

        fs.write(this.file_desc, buffer, 0, buffer.length, null, cbk_got);
      }
    }

    //
    // Call other(s) stream(s)
    {
      if (this._thrs_strms) {
        this._thrs_strms.forEach((stream) => {
          stream.write(chunk, encoding, cbk_got);
        });
      }
    }

    function cbk_got(err_or_null) {
      if (err_or_null) {
        errs.push(err_or_null);
      }

      {
        nb_cbks_done++;
        if (nb_cbks_done !== nb_cbks_tot) {
          return;
        }
      }

      if (errs.length === 0) {
        return callback(null);
      }
      if (errs.length === 1) {
        return callback(errs[0]);
      }

      //
      // Aggregate errors
      {
        let msg = errs.length + " errors :\n";
        errs.forEach((err, idx) => {
          msg += idx + ". " + err + "\n";
        });

        callback(new Error(msg));
      }
    }
  }
  //
  // === Logs ===
  /**
   * Log specified message as debug
   * Class name is prefixed to log
   */
  set debug(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.debug(formatted);
    this.logs.d(formatted); //Writte to file
  }

  set info(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.info(formatted);
    this.logs.i(formatted); //Writte to file
  }

  /**
   * Log specified message as error
   * Class name is prefixed to log
   */
  set error(message) {
    const formatted = log_infos.add_debug_infos(
      message,
      true, //file infos
      true // stack trace
    );

    console.error(formatted);
    this.logs.e(formatted); //Writte to file
  }

  /**
   * @param {string|Error|(string|Error)[]}
   */
  set ex(ex: string | Error | (string | Error)[]) {
    if (ex instanceof Array) {
      this.error = ex.length + " errors :";
      ex.forEach((err) => {
        const formatted = format_error(err);

        console.error(formatted);
        this.logs.e(formatted); //Writte to file
      });

      return;
    }

    {
      const formatted = format_error(ex);
      /*
      "manually" displays the error instead of using this.err
      otherwise the wrong row is fetched from log_infos.add_debug_infos
      */
      console.error(formatted);
      this.logs.e(formatted); //Writte to file
    }

    function format_error(error) {
      const msg =
        ex instanceof Error
          ? ex.name + " : " + ex.message + "\n" + ex.stack
          : ex;
      return log_infos.add_debug_infos(
        msg,
        true,
        false,
        1 //remove format_error call
      );
    }
  }

  set fatal(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.error(formatted);
    this.logs.f(formatted); //Writte to file
  }

  /**
   * Log specified message
   * Class name is prefixed to log
   */
  set log(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.log(formatted);
    this.logs.i(formatted); //Writte to file
  }

  /**
   * @param{object[]} If 1st element is a string, displayed before the table
   */
  set table(array) {
    if (typeof array[0] === "string" || array[0] instanceof String) {
      const formatted = log_infos.add_debug_infos(array[0]);
      console.log(formatted);
      this.logs.i(formatted); //Writte to file

      array = array.slice(1);
    }

    console.table(array);
    this.logs.i(array); //Writte to file
  }

  /**
   * Log specified message as trace
   * Class name is prefixed to log
   */
  set trace(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.trace(formatted);
    this.logs.t(formatted); //Writte to file
  }

  /**
   * Log specified message as warning
   * Class name is prefixed to log
   */
  set warn(message) {
    const formatted = log_infos.add_debug_infos(message);

    console.warn(formatted);
    this.logs.w(formatted); //Writte to file
  }
}
