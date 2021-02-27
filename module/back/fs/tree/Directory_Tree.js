var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { Directory_Tree_props, } from "./_props/Directory_Tree_props.js";
import { promises as fs_promises } from "fs";
import { sanitize_regex_path } from "../fs.js";
import { get_path_request } from "../path/path_request.js";
export class Directory_Tree extends Directory_Tree_props {
    //
    // === MASTER ===
    get master() {
        return this;
    }
    //
    // === DIRECTORY TREES SETTERS
    set subdirs(dirs_trees) {
        this.ensure_dirs_map();
        dirs_trees.forEach((tree) => {
            tree.parent = this;
            this.dirs.set(tree.name, tree);
        });
    }
    /**
     * Add the specified directory tree to this.dirs
     * If one with this name already exists, update its
     * values with those in dir_tree
     * => enable slaves to keep their value up to date
     */
    set subdir(dir_tree) {
        this.ensure_dirs_map();
        dir_tree.parent = this;
        const dir_set = this.dirs.get(dir_tree.name);
        //
        // Must add the new one
        {
            if (!dir_set) {
                this.dirs.set(dir_tree.name, dir_tree);
                return;
            }
        }
        //
        // Else update the existing one's values
        for (const key in dir_tree) {
            dir_set[key] = dir_tree[key];
        }
    }
    get_files_matching_pattern(pattern) {
        if (!this.files) {
            return undefined;
        }
        const map = new Map();
        this.files.forEach((entry, name) => {
            if (pattern.test(name)) {
                map.set(name, entry);
            }
        });
        if (map.size === 0) {
            return undefined;
        }
        return map;
    }
    /**
     * Scan this directory in file system to fill this.dirs and this.files
     * @param dir_path
     * @param entries_matching_path
     * @param get_stats
     */
    scan(dir_path, entries_matching_path, get_stats) {
        return new Promise((success) => {
            //
            // Format path
            {
                if (entries_matching_path) {
                    entries_matching_path = sanitize_regex_path(entries_matching_path);
                }
            }
            /**
              Now path.length>0
                  || path[0]="**" and path.length>1
            */
            const { bAll_wildcard, entry_to_find_reg, bEntry_to_find_is_dir, bIterate_subdirs, } = get_path_request(entries_matching_path);
            //
            // Not to iterate all entries twice
            // If bAll_wildcard, we have to first check the next entry
            // (entry_to_find) is not in this to fetch all directories/files
            let entries = bAll_wildcard ? [] : undefined;
            const matching_entries = entries ? [] : undefined;
            //
            // path argument for recursive calls to scan
            // to be used only if !bAll_wildcard
            let recursive_path = !entries_matching_path
                ? undefined
                : entries_matching_path.slice(1);
            {
                const proms = [];
                fs_promises.opendir(dir_path).then((directory) => { var directory_1, directory_1_1; return __awaiter(this, void 0, void 0, function* () {
                    var e_1, _a;
                    //
                    // Iterate files
                    {
                        try {
                            for (directory_1 = __asyncValues(directory); directory_1_1 = yield directory_1.next(), !directory_1_1.done;) {
                                const entry = directory_1_1.value;
                                //
                                // If all entries are requested
                                {
                                    // <=> !path
                                    if (!entry_to_find_reg) {
                                        if (entry.isDirectory()) {
                                            const subtree = new Directory_Tree(this, entry);
                                            this.subdir = subtree;
                                            //
                                            // scan the found directory
                                            if (bIterate_subdirs) {
                                                proms.push(subtree.scan(dir_path, recursive_path));
                                            }
                                        }
                                        else {
                                            this.file_entry = entry;
                                        }
                                        //
                                        // Fetch entry' stats if requested
                                        {
                                            if (get_stats) {
                                                proms.push(load_stats(entry));
                                            }
                                        }
                                        continue;
                                    }
                                }
                                //
                                // === path case ===
                                // Otherwise a specific entry...
                                {
                                    //
                                    // ... must be found
                                    if (!entries) {
                                        if (entry_to_find_reg.test(entry.name)) {
                                            if (entry.isDirectory()) {
                                                if (bEntry_to_find_is_dir) {
                                                    const subtree = new Directory_Tree(this, entry);
                                                    this.subdir = subtree;
                                                    //
                                                    // scan the found directory
                                                    if (bIterate_subdirs) {
                                                        proms.push(subtree.scan(dir_path, recursive_path));
                                                    }
                                                }
                                            }
                                            //
                                            // Else entry is a file
                                            else {
                                                if (!bEntry_to_find_is_dir) {
                                                    this.file_entry = entry;
                                                }
                                            }
                                            //
                                            // Fetch entry' stats if requested
                                            {
                                                if (get_stats) {
                                                    proms.push(load_stats(entry));
                                                }
                                            }
                                            // do not break, the regex could math other entries
                                        }
                                    }
                                    //
                                    // ...or if entry(ies) matching the regex is/are found,
                                    //      should be the only ones used
                                    //     If no matching entry found, all entries are used
                                    else {
                                        if (entry_to_find_reg.test(entry.name)) {
                                            matching_entries.push(entry);
                                        }
                                        else {
                                            entries.push(entry);
                                        }
                                    }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (directory_1_1 && !directory_1_1.done && (_a = directory_1.return)) yield _a.call(directory_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    //
                    // === bAll_wildcard case ===
                    {
                        if (matching_entries) {
                            //
                            //Use matching entries if any
                            if (matching_entries.length > 0) {
                                entries = matching_entries;
                                //
                                // Update recursive path accordingly
                                // => remove '**' and entry regex
                                entries_matching_path = !entries_matching_path
                                    ? undefined
                                    : entries_matching_path.slice(2);
                            }
                            //
                            // Iterate entries
                            {
                                entries.forEach((entry) => {
                                    if (entry.isDirectory()) {
                                        if (bEntry_to_find_is_dir) {
                                            const subtree = new Directory_Tree(this, entry);
                                            this.subdir = subtree;
                                            if (bIterate_subdirs) {
                                                //
                                                // scan the found directory
                                                proms.push(subtree.scan(dir_path, recursive_path));
                                            }
                                            // do not break, the regex could math other entries
                                        }
                                    }
                                    //
                                    // Else entry is a file
                                    else {
                                        if (!bEntry_to_find_is_dir) {
                                            this.file_entry = entry;
                                            // do not break, the regex could math other entries
                                        }
                                    }
                                    //
                                    // Fetch entry' stats if requested
                                    {
                                        if (get_stats) {
                                            proms.push(load_stats(entry));
                                        }
                                    }
                                });
                            }
                        }
                    }
                    //
                    // To load stats when requested
                    function load_stats(entry) {
                        const prom = fs_promises.stat(dir_path + entry.name);
                        prom.then((stats) => {
                            if (entry.isDirectory()) {
                                this.dirs[entry.name].stats = stats;
                            }
                            else {
                                this.files[entry.name].stats = stats;
                            }
                        });
                        return prom;
                    }
                    //
                    // Wait for promises
                    {
                        if (proms.length === 0) {
                            return success(this);
                        }
                        Promise.all(proms).then(() => {
                            directory.close();
                            success(this);
                        });
                    }
                }); });
            }
        });
    }
    //
    // === LOAD/GET AS JSON ===
    getJson() {
        const ret = {
            name: this.name,
            stats: JSON.stringify(this.stats),
            dirs: undefined,
            files: undefined,
        };
        if (this.dirs) {
            ret.dirs = [];
            this.dirs.forEach((dir_tree) => {
                ret.dirs.push(dir_tree.getJson());
            });
        }
        if (this.files) {
            ret.files = [];
            this.files.forEach((entry_stats) => {
                ret.files.push(JSON.stringify(entry_stats));
            });
        }
        return ret;
    }
    load(json_dir_tree) {
        if (json_dir_tree.stats) {
            this.stats = json_dir_tree.stats;
        }
        if (json_dir_tree.dirs) {
            this.ensure_dirs_map;
            json_dir_tree.dirs.forEach((sub_json_dir_tree) => {
                const subtree = new Directory_Tree(this, json_dir_tree);
                subtree.load(sub_json_dir_tree);
                this.dirs.set(subtree.name, subtree);
            });
        }
        if (json_dir_tree.files) {
            this.ensure_files_map;
            json_dir_tree.files.forEach((sub_json_entry_stats) => {
                this.files.set(sub_json_entry_stats.name, sub_json_entry_stats);
            });
        }
    }
}
//# sourceMappingURL=Directory_Tree.js.map