var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs_promises } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { sep as os_path_separator } from "path";
import { file } from "../../_back.js";
export class Directory_Tree_Root extends Directory_Tree {
    constructor(dirent) {
        super(null, dirent);
    }
    //
    // === PATH ===
    get path() {
        const entry_name = this.isDirectory() ? this.name + "/" : this.name;
        return this._path + entry_name;
    }
    set path(path) {
        //
        // Remove eventual starting/ending spaces
        {
            path = path.replace(/^\s+/, "");
            path = path.replace(/\s+$/, "");
        }
        //
        // Add ending slash if missing
        {
            if (!/\\|\/$/.test(path)) {
                path += os_path_separator;
            }
        }
        this._path = path;
    }
    select(entries_matching_path, file_in_each_dir_matching_pattern) {
        return super.select(entries_matching_path, file_in_each_dir_matching_pattern, this.path);
    }
    /**
     *
     * @param entries_matching_path
     * @param get_stats If stats must also be set in the returned value
     */
    scan(dir_path, entries_matching_path, get_stats) {
        return new Promise((success) => __awaiter(this, void 0, void 0, function* () {
            if (dir_path) {
                this.path = dir_path;
            }
            //
            // Directly call super.scan
            if (!get_stats) {
                return super
                    .scan(this.path, entries_matching_path, get_stats)
                    .then(() => {
                    success(this);
                });
            }
            //
            // Else first get parent' stats as requested
            const proms = [];
            {
                //
                //Fetch parent's directory's stats
                {
                    let last_separator_idx;
                    let end_dir_name_idx = this.path.length;
                    {
                        // used separator is a slash or backslash ?
                        const separator_char = /\//.test(this.path) ? "/" : "\\";
                        const dir_path_last_idx = this.path.length - 1;
                        //
                        // Fetch from path the slash or backslash preceding the dir name
                        {
                            last_separator_idx = this.path.lastIndexOf(separator_char);
                            //
                            // If slash|backslash is the last char, get the previous one
                            if (last_separator_idx === dir_path_last_idx) {
                                end_dir_name_idx = last_separator_idx;
                                last_separator_idx = this.path.lastIndexOf(separator_char, dir_path_last_idx - 1);
                            }
                        }
                    }
                    const parent_dir_path = this.path.slice(0, last_separator_idx);
                    const prom = fs_promises.stat(parent_dir_path);
                    proms.push(prom);
                    prom.then((stats) => {
                        this.parent_stats = stats;
                    });
                }
                //
                // Fetch this dir stats
                // (because super.scan fetch stats of its subdirs and files)
                {
                    const prom = fs_promises.stat(dir_path);
                    proms.push(prom);
                    prom.then((stats) => {
                        this.stats = stats;
                    });
                }
            }
            Promise.all(proms).then(() => {
                super.scan(this.path, entries_matching_path, get_stats);
            });
        }));
    }
    //
    // === STORE FILE ===
    /**
     * Set file_or_fullPath if different from the already set one
     */
    set store_file(file_or_fullPath) {
        //
        // file_or_fullPath is a Json file
        if (file_or_fullPath) {
            // ignore if already set
            if (this._store === file_or_fullPath) {
                return;
            }
            this._store = file_or_fullPath;
            return;
        }
        //
        // Else file_or_fullPath is a string full_path
        // ignore if already set
        if (this._store.full_path === file_or_fullPath) {
            return;
        }
        this._store = new file.Json({
            full_path: file_or_fullPath,
        });
    }
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    load(file_or_fullPath) {
        return new Promise((success) => {
            if (file_or_fullPath) {
                this.store_file = file_or_fullPath;
            }
            if (!this._store) {
                throw ReferenceError("No store file in Directory_Tree_Root of " + this.path + this.name);
            }
            this._store.read().then((json) => {
                super.load(json);
                success(this);
            });
        });
    }
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    store(file_or_fullPath) {
        return new Promise((success) => {
            if (file_or_fullPath) {
                this.store_file = file_or_fullPath;
            }
            if (!this._store) {
                throw ReferenceError("No store file in Directory_Tree_Root of " + this.path + this.name);
            }
            this._store.content = this.getJson();
            this._store.write().then(() => {
                success(this);
            });
        });
    }
}
//# sourceMappingURL=Directory_Tree_Root.js.map