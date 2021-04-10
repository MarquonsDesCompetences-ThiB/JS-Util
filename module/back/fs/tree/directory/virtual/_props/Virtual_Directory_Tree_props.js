var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { sep as os_path_separator } from "path";
import { obj } from "../../../../../../both/types/_types.js";
var dMeths = obj.specs.meths.decs;
import { Directory_Tree_Root } from "../../Directory_Tree_Root.js";
import { get_fs_updates, select } from "../../../util.js";
import { Directory_Tree } from "../../common/Directory_Tree.js";
export class Virtual_Directory_Tree_props extends Directory_Tree {
    constructor() {
        super(...arguments);
        this.is_root = true;
        //
        // === iDirectory_Tree ===
        //id = undefined;
        this.name = "Virtual Directory";
        this.dirs = new Map();
        /**
         * When a requested path does not start
         * with a dir name from this.dirs,
         * look in directory names of every specified dirs
         *
         */
        this.search_order = [];
    }
    get full_path() {
        return "/";
    }
    get path() {
        return "";
    }
    get root() {
        return undefined;
    }
    get virtual_root() {
        return this;
    }
    get relative_path() {
        return "/";
    }
    set add_dir(dir_tree) {
        dir_tree.virtual_root = this;
        this.dirs.set(dir_tree.name, dir_tree);
    }
    set dirs_json(dir_trees) {
        dir_trees.forEach((dir_tree) => {
            if (dir_tree instanceof Directory_Tree_Root) {
                this.add_dir = dir_tree;
                return;
            }
            //
            // else construct and add the Directory_Tree_Root
            this.add_dir = new Directory_Tree_Root(dir_tree);
        });
    }
    get_dir(dir_name) {
        if (!this.dirs) {
            return undefined;
        }
        return this.dirs.get(dir_name);
    }
    get_dirs_names() {
        const names = [];
        for (const key of this.dirs.keys()) {
            names.push(key);
        }
        return names;
    }
    get_path(path) {
        if (!this.dirs) {
            return undefined;
        }
        if (!(path instanceof Array)) {
            path = path.split(os_path_separator);
        }
        const next_access = path[0];
        const dir = this.dirs.get(next_access);
        if (dir) {
            if (path.length === 0) {
                return dir;
            }
            //remove the 1st element (dir's name)
            path.shift();
            // recursive call
            return dir.get_path(path);
        }
        if (this.search_order) {
            const order_length = this.search_order.length;
            for (let i = 0; i < order_length; i++) {
                const dir_name = this.search_order[i];
                const dir = this.dirs.get(dir_name);
                if (!dir) {
                    logger.error =
                        "No directory called " +
                            dir_name +
                            " (requested from search_order) in this virtual directory";
                    continue;
                }
                try {
                    const entry_found = dir.get_path(path);
                    if (entry_found) {
                        return entry_found;
                    }
                }
                catch (ex) {
                    // ReferenceError => Entry not found
                }
            }
        }
        throw_ref_error();
        function throw_ref_error() {
            throw new ReferenceError("Directory " +
                next_access +
                " (requested with path " +
                path.join(os_path_separator) +
                ") does not exist in this virtual directory nor in search_order's directories");
        }
    }
    //
    // === TREES ===
    /**
     * Cf. util/select<Tmaster_tree extends Directory_Tree>
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     * @returns
     */
    select(from_dir, entries_matching_path, file_in_each_dir_matching_pattern) {
        const dir = this.get_dir(from_dir);
        if (!dir) {
            throw new ReferenceError("Unexisting directory " + from_dir + " in this virtual directory");
        }
        return select(dir, entries_matching_path, file_in_each_dir_matching_pattern);
    }
    /**
     * Select (this.select)
     * then add (this.add_dir)
     * the result to this
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     */
    select_add(from_dir, entries_matching_path, file_in_each_dir_matching_pattern) {
        this.add_dir = this.select(from_dir, entries_matching_path, file_in_each_dir_matching_pattern).master_or_slave;
    }
    /**
     * this.select but running on all this.directories
     *
     * Cf. util/select<Tmaster_tree extends Directory_Tree>
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     * @returns
     */
    select_from_all(entries_matching_path, file_in_each_dir_matching_pattern) {
        const slaves = [];
        this.dirs.forEach((dir_tree) => {
            slaves.push(select(dir_tree, entries_matching_path, file_in_each_dir_matching_pattern));
        });
        return slaves;
    }
    /**
     * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
     * @param from_dir
     * @param path
     * @returns
     */
    async get_fs_updates(from_dir, path) {
        const dir = this.get_dir(from_dir);
        if (!dir) {
            throw new ReferenceError("Unexisting directory " + from_dir + " in this virtual directory");
        }
        return get_fs_updates(dir, path);
    }
    /**
     * this.get_fs_updates but running on all this.directories
     *
     * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
     * @param from_dir
     * @param path
     * @returns
     */
    async get_fs_updates_from_all(path) {
        const slaves_proms = [];
        this.dirs.forEach((dir_tree) => {
            slaves_proms.push(get_fs_updates(dir_tree, path));
        });
        return Promise.all(slaves_proms);
    }
}
__decorate([
    dMeths.jsonify
], Virtual_Directory_Tree_props.prototype, "dirs_json", null);
//# sourceMappingURL=Virtual_Directory_Tree_props.js.map