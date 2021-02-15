"use strict";
import { Logger } from "./Logger.js";
export { Logger } from "./Logger.js";
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
/**
 *
 * @param {integer} line_from
 * @param {integer | optional} line_to Line included in result
 *
 * @return{string[]}
 */
export function get_stack_trace(line_from, line_to = line_from) {
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
export function get_caller_infos(stack_trace_line, include_file_infos = false) {
    // increment stack_trace_line to remove get_caller_infos call
    const stack_line = get_stack_trace(stack_trace_line + 1)[0];
    let res = {
        class_name: undefined,
        method_name: undefined,
    };
    try {
        //
        // Class and method name
        {
            /*
              What follows 'at ' and precedes '('
            */
            const line_match = stack_line.match(/(?<=at\s)(.+)(?=\s\()/);
            const first_part = line_match ? line_match[0] : stack_line;
            /*
              Either what follows 'new '
              Or what precedes '.'
            */
            const class_name_match = first_part.match(/((?<=\bnew\b\s)(.+)|(.+)(?=\.))/);
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
                What are between braces '(' ')'
              */
                const line_match = stack_line.match(/(?<=\()(.+)(?=\))/);
                const second_part = line_match ? line_match[0] : stack_line;
                // Most of characters preceding a '\' or '  /'
                const path_reg = /(.+)(\\|\/)/;
                res.file_path = second_part.match(path_reg)[0];
                /*
                  To work with pathes from Node URL like file:///C:/Users/[...]
                */
                res.file_name = second_part.replace(path_reg, ""); //remove path
                // keep what is not a ':' preceded by a ':'
                res.file_name = res.file_name.match(/[^\\:]+(?=:)+/)[0];
                // Digits preceding by a ':' and including a ':'
                res.line = Number.parseInt(second_part.match(/(?<=:)(\d+:\d+)/)[0]);
            }
        }
    }
    catch (ex) {
        console.error("Logger#get_caller_infos Exception parsing stack line : " +
            stack_line +
            "\n" +
            ex);
    }
    return res;
}
export function new_global_logger() {
    Logger.logger = new Logger();
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
export function new_std_err_logger() {
    /*process.stderr =*/ new Logger(undefined, process.stderr);
}
export function new_std_out_logger() {
    /*process.stdout = */ new Logger(undefined, process.stdout);
}
/**
 * Return a string including specified message and debug informations
 *
 * @param {string} message
 *
 * @return{string}
 */
export function add_debug_infos(message, include_file_infos = true, include_stack_trace = false, row = 0) {
    // with 4th stack trace's line
    // (remove debug calls -> to get calling file)
    let caller = get_caller_infos(2 + row, include_file_infos);
    //
    // Caller is one of the Logger's output methods
    // (error, debug, trace, warn...)
    if (caller.class_name === "Logger") {
        // get next line
        caller = get_caller_infos(3 + row, include_file_infos);
    }
    const stack = include_stack_trace
        ? "\n" + get_stack_trace(3 + row, 10 + row).join("\n")
        : "";
    return (caller.class_name +
        "#" +
        caller.method_name +
        "| " +
        message +
        " |in " +
        caller.file_name +
        " at " +
        caller.line +
        stack);
}
//# sourceMappingURL=_logger.js.map