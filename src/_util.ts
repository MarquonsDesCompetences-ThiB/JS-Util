//
// === Back

// all
import * as back from "./back/_back.js";
export { back };

// direct access
export const { logger, file, fs } = back;
//
// global Logger's access initialized by back.logger.new_global_logger()
declare global {
  var logger: back.logger.Logger;
  var debug;
  var info;
  var error;
  var ex;
  var fatal;
  var log;
  var table;
  var trace;
  var warn;
}

//
// === Both
import * as both from "./both/_both.js";
export default { both };

// direct access
export const { bool, json } = both;

export const { text, number } = both;

export const { types, obj } = both;

export const { geo, graphic } = both;

export const { regex, time } = both;
