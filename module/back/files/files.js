"use strict";
import fs from "fs";
import fs_extra from "fs-extra";
import { File } from "./File.js";
import { Csv_File } from "./Csv_File.js";
import { Xlsx_File } from "./Xlsx_File.js";
const { readJsonSync } = fs_extra;
export { File as File };
export { Csv_File as Csv_File };
export { Xlsx_File as Xlsx_File };
export function file_factory(obj) {
    if (obj.ext) {
        switch (obj.ext) {
            case "csv":
                return new Csv_File(obj);
            case "xlsx":
                return new Xlsx_File(obj);
        }
    }
    return new File(obj);
}
export const colors = {
    black: {
        argb: "FFFFFFFF",
    },
    blue: {
        argb: "FF0000FF",
    },
    green: {
        argb: "FF00FF00",
    },
    red: {
        argb: "FFFF0000",
    },
    white: {
        argb: "FF000000",
    },
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
export function cell_ids_to_alphanum(col_id, row_id) {
    return column_id_to_letters(col_id) + row_id;
}
/**
 * Convert the specified column number to its letter(s) equivalent
 *
 * @param {int} col_id
 * @param {int} exp Internal use for recursivity
 *                  Exponential to apply to 26
 *
 * @return {string}
 */
export function column_id_to_letters(col_id, exp = 0) {
    let id = col_id, letters = "";
    //
    // Recursive call if next exponential is lower than id
    {
        const exp_incr = exp + 1;
        if (Math.pow(26, exp_incr) < id) {
            const res = column_id_to_letters(col_id, exp_incr);
            id = res.id;
            letters = res.letters;
        }
    }
    //
    // Computation of caller's id to use and letter of this generation
    {
        const gen_pow = Math.pow(26, exp);
        const next_id = Math.ceil(id / gen_pow);
        // ASCII : A=65, ..., Z=90
        letters = letters + String.fromCharCode((id % gen_pow) + 64);
        //
        // 1st call => returns only letters
        if (exp === 0) {
            return letters;
        }
        //
        // else returns data needed by callers
        else {
            return {
                id,
                letters,
            };
        }
    }
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
    return contents;
}
//# sourceMappingURL=files.js.map