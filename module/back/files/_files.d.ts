import { File } from "./File.js";
export { File as File };
import { Csv_File } from "./Csv_File.js";
export { Csv_File as Csv };
import { Xlsx_File } from "./xlsx/Xlsx_File.js";
export { Xlsx_File as Xlsx };
import { Json_File } from "./Json_File.js";
export { Json_File as Json };
export declare function file_factory(obj: any): File | Xlsx_File | Json_File;
export declare function is_directory(path: string): boolean;
export declare function is_file(path: string): boolean;
/**
 * Read all json files in specified directory and subdirs
 * @param path
 */
export declare function read_dir_files_json(path: string): {};
