var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _id;
import { repeat } from "../../../../../../both/types/string/_string.js";
import { Entry } from "../../../entry/Entry.js";
import { specs as obj_specs } from "../../../../../../both/types/obj/_obj.js";
import { join as join_path, sep as os_path_separator } from "path";
import { get_map } from "../common.js";
export class Directory_Tree_props extends Entry {
    constructor() {
        super(...arguments);
        _id.set(this, void 0);
        this.files = new Map();
    }
    get root() {
        if (this.is_root) {
            return this;
        }
        if (this.parent) {
            return this.parent.root;
        }
        throw new TypeError("Directory " + this.name + " : Is not root and has no parent set");
    }
    get virtual_root() {
        return this.root.virtual_root;
    }
    /**
     * Required :
     *  dirent {Dirent}
     *  parent {Directory_Tree_props}
     *
     *
    constructor() {
      super();
    }
    */
    //
    // === CONSTRUCTORS ===
    /**
     * Create a new instance of this with the specified parameters
     * Usefull to create a new master for a slave which have none,
     * keeping all slaves' values
     *
     * @param obj
     * @returns
     */
    make_new(obj) {
        return new (Object.getPrototypeOf(this).constructor)(obj);
    }
    //
    // === TO STRING ===
    toString() {
        return this.tree_str();
    }
    //
    // === ID ===
    get id() {
        if (!this.parent) {
            if (__classPrivateFieldGet(this, _id)) {
                return __classPrivateFieldGet(this, _id) + "." + this.name;
            }
            return this.name;
        }
        return this.parent.id + "." + this.name;
    }
    set id(id) {
        __classPrivateFieldSet(this, _id, id);
    }
    tree_str(nb_indents = 1) {
        let indents = repeat(nb_indents, "\t");
        //
        // Current directory
        const dir_indents = repeat(nb_indents, "+\t");
        let str = dir_indents + (nb_indents === 1 ? this.full_path : this.name) + ":\n";
        if (this.stats) {
            str += indents + JSON.stringify(this.stats) + "\n";
        }
        nb_indents++;
        //
        // Directory's files
        const file_indents = repeat(nb_indents, "-\t");
        indents += "\t";
        if (this.files) {
            this.files.forEach((entry_stats) => {
                str += file_indents + entry_stats.name + "\n";
                str += indents + JSON.stringify(entry_stats) + "\n";
            });
        }
        //
        // Directory's directories
        if (this.dirs) {
            this.dirs.forEach((dir) => {
                str += dir.tree_str(nb_indents) + "\n";
            });
        }
        return str;
    }
    //
    // === PATH ===
    get path() {
        if (this.parent) {
            return this.parent.full_path;
        }
        //
        // else this is root => contains the path
        return super.path;
    }
    /**
     * To make the getter overriding above
     * not to turn the property to read-only
     */
    set path(path) {
        super.path = path;
    }
    get full_path() {
        if (this.parent) {
            const full_path = this.parent.full_path;
            const name = this.name;
            if (full_path) {
                if (name) {
                    return join_path(full_path, name);
                }
                return full_path;
            }
            return name;
        }
        //
        // else this is root => contains the path
        return super.full_path;
    }
    /**
     * To make the getter overriding above
     * not to turn the property to read-only
     */
    set full_path(full_path) {
        super.full_path = full_path;
    }
    get relative_path() {
        if (this.parent) {
            return join_path(this.parent.relative_path, this.name);
        }
        return this.name;
    }
    //
    // === SUB-FILES/SUB-DIRECTORIES
    get is_empty() {
        return ((!this.dirs || this.dirs.size === 0) &&
            (!this.files || this.files.size === 0));
    }
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path, recursive) {
        return get_map(this, full_parent_path, recursive);
    }
    //
    // === SUB-DIRECTORIES
    /**
     * Ensure the map this.dirs exist ; if not, create it
     */
    ensure_dirs_map() {
        if (!this.dirs) {
            this.dirs = new Map();
        }
    }
    get_subdir(dir_name) {
        if (!this.dirs) {
            return undefined;
        }
        return this.dirs.get(dir_name);
    }
    //
    // === SUB-FILES
    /**
     * Ensure the map this.files exist ; if not, create it
     */
    ensure_files_map() {
        if (!this.files) {
            this.files = new Map();
        }
    }
    get_file_entry(file_name) {
        if (!this.files) {
            return undefined;
        }
        return this.files.get(file_name);
    }
    /**
     * Add the specified file entry to this.files
     * If one with this name already exists, update its
     * values with those in entry_stats
     */
    set file_entry(entry_stats) {
        this.ensure_files_map;
        this.files.set(entry_stats.name, entry_stats);
        /*
        const file_set = this.files.get(entry_stats.name);
        //
        // Must add the new one
        {
          if (!file_set) {
            this.files.set(entry_stats.name, entry_stats);
            return;
          }
        }
        //
        // Else update the existing one's values
        for (const key in entry_stats) {
          file_set[key] = entry_stats[key];
        }
        */
    }
    get files_json() {
        const files = {};
        //
        // Undefined files
        {
            if (!this.files) {
                return files;
            }
        }
        this.files.forEach((entr_stat, fname) => {
            files[fname] = entr_stat;
        });
        return files;
    }
    set files_json(json) {
        //
        // Init files if needed
        {
            if (!this.files) {
                this.files = new Map();
            }
        }
        for (const fname in json) {
            this.files.set(fname, json[fname]);
        }
    }
    get files_names() {
        const fnames = [];
        //
        // Undefined files
        {
            if (!this.files) {
                return fnames;
            }
        }
        this.files.forEach(({ name }) => {
            fnames.push(name);
        });
        return fnames;
    }
    /**
     * Return all files' names in this directory
     * and their respective modified time (when stats is set)
     */
    get files_names_modifiedTime() {
        const fnames_stats = [];
        //
        // Undefined files
        {
            if (!this.files) {
                return fnames_stats;
            }
        }
        this.files.forEach(({ name, stats = undefined }) => {
            fnames_stats.push([name, stats ? stats.mtime : undefined]);
        });
        return fnames_stats;
    }
    /**
     *
     * @param path
     * @param absolute If the path set is absolute, eg :
     *                  no starting slash -> go to root to fetch the path
     *                  starting ./ or ../ -> look from current directory
     * @returns
     */
    get_path(path, absolute) {
        if (!(path instanceof Array)) {
            path = path.split(os_path_separator);
            if (absolute) {
                return this.root.get_path(path);
            }
        }
        const next_access = path.shift();
        //
        // Look in dirs
        {
            const dir = this.dirs ? this.dirs.get(next_access) : undefined;
            if (dir) {
                if (path.length === 0) {
                    return dir;
                }
                return dir.get_path(path);
            }
            //
            // Not found in dir but path has other entries
            // => next_access should be a directory
            throw_ref_error.call(this);
        }
        //
        // Look in files
        {
            const file = this.files ? this.files.get(next_access) : undefined;
            if (file) {
                return file;
            }
        }
        throw_ref_error.call(this);
        function throw_ref_error() {
            throw new ReferenceError("Directory " +
                this.name +
                " : Entry " +
                next_access +
                " not found (from path " +
                path.join(os_path_separator) +
                ")");
        }
    }
}
_id = new WeakMap();
__decorate([
    obj_specs.decs.props.enum
], Directory_Tree_props.prototype, "stats", void 0);
__decorate([
    obj_specs.decs.props.jsonified
], Directory_Tree_props.prototype, "dirs", void 0);
__decorate([
    obj_specs.decs.props.jsonified
], Directory_Tree_props.prototype, "files", void 0);
__decorate([
    obj_specs.decs.props.cyclic
], Directory_Tree_props.prototype, "parent", void 0);
__decorate([
    obj_specs.decs.meths.enum
], Directory_Tree_props.prototype, "id", null);
__decorate([
    obj_specs.decs.meths.enum
], Directory_Tree_props.prototype, "path", null);
__decorate([
    obj_specs.decs.meths.enum
], Directory_Tree_props.prototype, "full_path", null);
__decorate([
    obj_specs.decs.meths.jsonify
], Directory_Tree_props.prototype, "files_json", null);
//# sourceMappingURL=Directory_Tree_props.js.map