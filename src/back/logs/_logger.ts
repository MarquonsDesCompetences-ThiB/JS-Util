"use strict";
export * as infos from "./infos.js";
export { Logger } from "./Logger.js";

import { Logger } from "./Logger.js";
import { join as join_path } from "path";

/**
 * Return a string indicating the type of obj
 * and its constructor (if obj is an object) :
 * "<obj_type> (<obj_constructor>"
 * @param {*} obj
 */
export function get_type_str(obj) {
  const type = typeof obj;
  return type + (type === "object" ? " (" + obj.constructor.name + ")" : "");
}
export function new_global_logger(
  path: string = join_path(
    process.env.SRC_ROOT ? process.env.SRC_ROOT : "",
    "logs"
  ),
  file_name_prefix = ""
) {
  Logger.logger = new Logger(path, file_name_prefix);

  /* Now use simple file_path string
    //
    // Override File_'s log functions to enable it writing logs
    {
      File_.debug = Logger.logger.debug;
      File_.error = Logger.logger.error;
      File_.log = Logger.logger.log;
      File_.warn = Logger.logger.warn;
    }*/

  {
    if (global.logger !== undefined) {
      logger.warn = "Logger Overriding global.logger with Logger";
    }
    // global logger access
    //global.Logger = Logger;

    // global access shortcuts
    let l = (global.logger = Logger.logger);

    [
      global.debug,
      global.info,
      global.error,
      global.ex,
      global.fatal,
      global.log,
      global.table,
      global.trace,
      global.warn,
    ] = [
      l.debug,
      l.info,
      l.error,
      l.ex,
      l.fatal,
      l.log,
      l.table,
      l.trace,
      l.warn,
    ];
  }
}

export function new_std_err_logger(
  path: string = join_path(
    process.env.SRC_ROOT ? process.env.SRC_ROOT : "",
    "logs"
  ),
  file_name_prefix = ""
) {
  /*process.stderr =*/ new Logger(path, file_name_prefix, process.stderr);
}

export function new_std_out_logger(
  path: string = join_path(
    process.env.SRC_ROOT ? process.env.SRC_ROOT : "",
    "logs"
  ),
  file_name_prefix = ""
) {
  /*process.stdout = */ new Logger(path, file_name_prefix, process.stdout);
}
