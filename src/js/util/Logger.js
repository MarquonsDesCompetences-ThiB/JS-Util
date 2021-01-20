"use strict";

const File_ = require(process.env.SRC_ROOT + "js/util/File");
const output = require("output-manager");
const os = require("os");

class Logger {
  /**
   *
   * @param {integer} line_from
   * @param {integer | optional} line_to Line included in result
   */
  static get_stack_trace(line_from, line_to = line_from) {
    // lines are incremented to remove get_stack_trace call
    return new Error().stack.split("\n").slice(line_from + 1, line_to + 2);
  }

  /**
   * Returns info about the calling method from the specified stack traces line
   *
   * Stack trace examples :
   *    Method inside a method
   *       at set_value (C:\Users\taubh\GitProjects\web\WebApps\ClickAndCollect\src\dist\js\util\obj\Obj.js:736:9)
   *
   *    Constructor call
   *       at new child2 (C:\Users\web\obj\Obj\obj_init.test.js:82:5)
   *
   *    Anonymous method
   *      at Object.<anonymous> (C:\Users\web\obj\Obj\obj_init.test.js:107:7)
   *
   *    Class' setter
   *      at child2.set properties [as properties] (C:\Users\web\obj\Obj.js:173:5)
   *
   * @return{object} {    class_name, method_name,
   *                    if include_file_infos = true :
   *                      file_path,
   *                      file_name,
   *                      line {string : "<col>:<line>"}
   *                  }
   */
  static get_caller_infos(stack_trace_line, include_file_infos = false) {
    // increment stack_trace_line to remove get_caller_infos call
    const stack_trace = Obj_Errors.get_stack_trace(stack_trace_line + 1)[0];

    let res = {};

    //
    // Class and method name
    {
      /*
        What follows 'at ' and precedes '('
      */
      const first_part = stack_trace.match(/(?<=at\s)(.+)(?=\s\()/)[0];

      /*
        Either what follows 'new '
        Or what precedes '.'
      */
      const class_name_match = first_part.match(
        /((?<=\bnew\b\s)(.+)|(.+)(?=\.))/
      );
      res.class_name = class_name_match
        ? class_name_match[0]
        : // method is not from a class
          "";

      /*
        Either 'new'
        Or what follows '.'
      */
      res.method_name =
        res.class_name.length === 0
          ? //method not from a class => the entire first_part is the method name
            first_part
          : // name is 'new' or after a dot '.'
            first_part.match(/(\bnew\b|(?<=\.)(.+))/)[0];
    }

    //
    // File infos
    {
      if (include_file_infos) {
        /*
        What are in braces '(' ')'
      */
        const second_part = stack_trace.match(/(?<=\()(.+)(?=\))/)[0];

        // Most of characters preceding a '\'
        res.file_path = second_part.match(/(.+)(?=\\)/)[0] + "\\";
        // What is not a '\' between a '\' and ':'
        res.file_name = second_part.match(/((?<=\\)([^\\:]+)(?=:))+/)[0];
        // Digits preceding by a ':' and including a ':'
        res.line = second_part.match(/(?<=:)(\d+:\d+)/)[0];
      }
    }

    return res;
  }

  static new_global_logger() {
    Logger.logger = new Logger();

    //
    // Override File_'s log functions to enable it writing logs
    {
      File_.debug = Logger.logger.debug;
      File_.error = Logger.logger.error;
      File_.log = Logger.logger.log;
      File_.warn = Logger.logger.warn;
    }

    {
      if (global.logger !== undefined) {
        logger.warn="Logger Overriding global.logger with Logger";
      }
      global.logger = Logger.logger;
    }
  }

  /**
   * Return a string including specified message and debug informations
   *
   * @param {string} message
   *
   * @return{string}
   */
  static add_debug_infos(message, include_file_infos = true) {
    // with 4th stack trace's line
    // (remove debug calls -> to get calling file)
    const caller = Obj_Errors.get_caller_infos(3, include_file_infos);
    return (
      caller.class_name +
      "#" +
      caller.method_name +
      "| " +
      message +
      " |in " +
      caller.file_name +
      " at " +
      caller.line
    );
  }

  constructor() {
    this.logs = new output.Out();
    this.logs_str = "";

    {
      let that = this;
      this.logs.output = (msg) => {
        /* do log to file */
        that.logs_str += msg + os.EOL;
        that.file.write_str(that.logs_str);
      };
      this.logs.level_str = "DEBUG";
      this.logs.level = output.LogLevel.DEBUG;
    }

    this.file = new File_({
      path: process.env.SRC_ROOT + "logs/",
      name: this.logs.level_str + "-" + new Date().toLocaleTimeString(),
      ext: "log",
    });
    this.logs.i("Log file set up with level : " + this.logs.level_str);
  }

  logger(req, res, next) {
    logger.log="mw logger : " + req.url;
    next();
  }

  //
  // === Logs ===
  /**
   * Log specified message as debug
   * Class name is prefixed to log
   */
  set debug(message) {
    const formatted = Logger.add_debug_infos(message);

    console.debug(formatted);
    //Writte to file
    this.logs.d(formatted);
  }

  set info(message) {
    const formatted = Logger.add_debug_infos(message);

    console.info(formatted);
    //Writte to file
    this.logs.i(formatted);
  }

  /**
   * Log specified message as error
   * Class name is prefixed to log
   */
  set error(message) {
    const formatted = Logger.add_debug_infos(message);

    console.error(formatted);
    //Writte to file
    this.logs.e(formatted);
  }

  set fatal(message) {
    const formatted = Logger.add_debug_infos(message);

    console.error(formatted);
    //Writte to file
    this.logs.f(formatted);
  }

  /**
   * Log specified message
   * Class name is prefixed to log
   */
  set log(message) {
    const formatted = Logger.add_debug_infos(message);

    console.log(formatted);
    //Writte to file
    this.logs.i(formatted);
  }

  /**
   * Log specified message as trace
   * Class name is prefixed to log
   */
  set trace(message) {
    const formatted = Logger.add_debug_infos(message);

    console.trace(formatted);
    //Writte to file
    this.logs.t(formatted);
  }

  /**
   * Log specified message as warning
   * Class name is prefixed to log
   */
  set warn(message) {
    const formatted = Logger.add_debug_infos(message);

    console.warn(formatted);

    //Writte to file
    this.logs.w(formatted);
  }
}

if (!global.logger || !global.logger instanceof Logger) {
  Logger.new_global_logger();
}
module.exports = Logger;