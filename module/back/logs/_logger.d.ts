export * as infos from "./infos.js";
export { Logger } from "./Logger.js";
/**
 * Return a string indicating the type of obj
 * and its constructor (if obj is an object) :
 * "<obj_type> (<obj_constructor>"
 * @param {*} obj
 */
export declare function get_type_str(obj: any): string;
export declare function new_global_logger(path?: string, file_name_prefix?: string): void;
export declare function new_std_err_logger(path?: string, file_name_prefix?: string): void;
export declare function new_std_out_logger(path?: string, file_name_prefix?: string): void;
