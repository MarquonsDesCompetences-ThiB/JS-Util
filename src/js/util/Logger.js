"use strict";

const File_ = require(process.env.SRC_ROOT + "js/util/File");
const output = require("output-manager");
const os = require("os");

class Logger {
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
        logger.warn("Logger Overriding global.logger with Logger");
      }
      global.logger = Logger.logger;
    }
  }

  logger(req, res, next) {
    logger.log("mw logger : " + req.url);
    next();
  }

  //
  // === Logs ===
  trace = function (message) {
    console.trace(message);
    //Writte to file
    this.logs.t(message);
  };

  debug = function (message) {
    console.debug(message);
    //Writte to file
    this.logs.d(message);
  };

  info = function (message) {
    console.info(message);
    //Writte to file
    this.logs.i(message);
  };

  log = function (message) {
    console.log(message);
    //Writte to file
    this.logs.i(message);
  };

  warn = function (message) {
    console.warn(message);

    //Writte to file
    this.logs.w(message);
  };

  error = function (message) {
    console.error(message);
    //Writte to file
    this.logs.e(message);
  };

  fatal = function (message) {
    console.error(message);
    //Writte to file
    this.logs.f(message);
  };
}

if (!global.logger || !global.logger instanceof Logger) {
  Logger.new_global_logger();
}
module.exports = Logger;
