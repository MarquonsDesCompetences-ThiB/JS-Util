declare global {
    var logger: Logger;
    var debug: any;
    var info: any;
    var error: any;
    var ex: any;
    var fatal: any;
    var log: any;
    var table: any;
    var trace: any;
    var warn: any;
}
interface Caller_Infos {
    class_name: string;
    method_name: string;
    file_path?: string;
    file_name?: string;
    line?: number;
}
export declare class Logger {
    #private;
    static logger: Logger;
    protected logs: any;
    protected file_desc: any;
    /**
     * Return a string indicating the type of obj
     * and its constructor (if obj is an object) :
     * "<obj_type> (<obj_constructor>"
     * @param {*} obj
     */
    static get_type_str(obj: any): string;
    /**
     *
     * @param {integer} line_from
     * @param {integer | optional} line_to Line included in result
     *
     * @return{string[]}
     */
    static get_stack_trace(line_from: any, line_to?: any): string[];
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
    static get_caller_infos(stack_trace_line: any, include_file_infos?: boolean): Caller_Infos;
    static new_global_logger(): void;
    /**
     * Return a string including specified message and debug informations
     *
     * @param {string} message
     *
     * @return{string}
     */
    static add_debug_infos(message: any, include_file_infos?: boolean, include_stack_trace?: boolean, row?: number): string;
    constructor(file_name_prefix?: string);
    get file_path(): string;
    set file_path(file_path: string);
    /**
     * Log specified message as debug
     * Class name is prefixed to log
     */
    set debug(message: any);
    set info(message: any);
    /**
     * Log specified message as error
     * Class name is prefixed to log
     */
    set error(message: any);
    /**
     * @param {string|Error|(string|Error)[]}
     */
    set ex(ex: string | Error | (string | Error)[]);
    set fatal(message: any);
    /**
     * Log specified message
     * Class name is prefixed to log
     */
    set log(message: any);
    /**
     * @param{object[]} If 1st element is a string, displayed before the table
     */
    set table(array: any);
    /**
     * Log specified message as trace
     * Class name is prefixed to log
     */
    set trace(message: any);
    /**
     * Log specified message as warning
     * Class name is prefixed to log
     */
    set warn(message: any);
}
export {};
