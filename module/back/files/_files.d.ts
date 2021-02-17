import { File } from "./File.js";
import { Csv_File } from "./Csv_File.js";
import { Xlsx_File } from "./Xlsx_File.js";
export { File as File };
export { Csv_File as Csv };
export { Json_File as Json } from "./Json_File";
export { Xlsx_File as Xlsx };
export declare function file_factory(obj: any): File | Xlsx_File;
export declare const colors: {
    black: {
        argb: string;
    };
    blue: {
        argb: string;
    };
    green: {
        argb: string;
    };
    red: {
        argb: string;
    };
    white: {
        argb: string;
    };
};
/**
 * Convert the specified column and row numbers
 * to its letter(s)+number equivalent
 * Ex. :
 *    1, 1 => A1
 *    1, 2 => A2
 *    ...
 *    2, 1 => B1
 *    2, 2 => B2
 *    ...
 *
 *
 * @param {int} col_id
 * @param {int} row_id
 *
 * @return {string}
 */
export declare function cell_ids_to_alphanum(col_id: number, row_id: number): string;
/**
 * Convert the specified column number to its letter(s) equivalent
 *
 * @param {int} col_id
 * @param {int} exp Internal use for recursivity
 *                  Exponential to apply to 26
 *
 * @return {string}
 */
export declare function column_id_to_letters(col_id: number, exp?: number): string | any;
export declare function is_directory(path: string): boolean;
export declare function is_file(path: string): boolean;
/**
 * Read all json files in specified directory and subdirs
 * @param path
 */
export declare function read_dir_files_json(path: string): {};
