export interface Caller_Infos {
    class_name: string;
    method_name: string;
    file_path?: string;
    file_name?: string;
    line?: number;
}
/**
 *
 * @param {integer} line_from
 * @param {integer | optional} line_to Line included in result
 *
 * @return{string[]}
 */
export declare function get_stack_trace(line_from: any, line_to?: any): string[];
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
export declare function get_caller_infos(stack_trace_line: any, include_file_infos?: boolean): Caller_Infos;
/**
 * Return a string including specified message and debug informations
 *
 * @param {string} message
 *
 * @return{string}
 */
export declare function add_debug_infos(message: any, include_file_infos?: boolean, include_stack_trace?: boolean, row?: number): string;
