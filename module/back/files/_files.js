"use strict";
import fs from "fs";
import fs_extra from "fs-extra";
import { File } from "./File.js";
export { File as File };
import { Csv_File } from "./Csv_File.js";
export { Csv_File as Csv };
import { Xlsx_File } from "./xlsx/Xlsx_File.js";
export { Xlsx_File as Xlsx };
import { Json_File } from "./Json_File.js";
export { Json_File as Json };
const { readJsonSync } = fs_extra;
export function file_factory(obj) {
    if (obj.ext) {
        switch (obj.ext) {
            case "csv":
                return new Csv_File(obj);
            case "json":
                return new Json_File(obj);
            case "xlsx":
                return new Xlsx_File(obj);
        }
    }
    return new File(obj);
}
export function is_directory(path) {
    const stat = fs.statSync(path);
    if (!stat) {
        return false;
    }
    return stat.isDirectory();
}
export function is_file(path) {
    const stat = fs.statSync(path);
    if (!stat) {
        return false;
    }
    return stat.isFile();
}
/**
 * Read all json files in specified directory and subdirs
 * @param path
 */
export function read_dir_files_json(path) {
    let contents = {};
    const dir = fs.opendirSync(path);
    //https://nodejs.org/api/fs.html#fs_dirent
    let dirent;
    while ((dirent = dir.readSync())) {
        const name = dirent.name;
        if (dirent.isFile()) {
            contents[name] = readJsonSync(path + "/" + name);
        }
        //
        // Is a directory
        else {
            contents = read_dir_files_json(path + "/" + name);
        }
    }
    try {
        dir.close();
    }
    catch (ex) { }
    return contents;
}
//# sourceMappingURL=_files.js.map