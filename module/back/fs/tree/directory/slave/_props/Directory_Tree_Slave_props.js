var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { obj } from "../../../../../../both/types/_types.js";
export class Directory_Tree_Slave_props
//extends Directory_Tree
 extends obj.Obj {
    constructor() {
        super(...arguments);
        this.dirs = new Map();
    }
    get is_root() {
        return this.parent == null;
    }
    //
    // === ID ===
    get id() {
        if (this.master) {
            return this.master.id;
        }
    }
    //
    // === MASTER ===
    get master_or_slave() {
        return this._master || this._slave;
    }
    get master() {
        return this._master;
    }
    set master(master) {
        this._master = master;
    }
    get slave() {
        return this._slave;
    }
    set slave(master) {
        this._slave = master;
    }
    //
    // === COMMON MASTER/SLAVE PROXIES ===
    //
    // === NAME
    get name() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.name;
        }
        return undefined;
    }
    //
    // === PATH
    get path() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.path;
        }
        return undefined;
    }
    get_path(path, absolute) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_path(path, absolute);
        }
        return undefined;
    }
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path, recursive) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_map(full_parent_path, recursive);
        }
        return undefined;
    }
    get is_empty() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.is_empty;
        }
        return undefined;
    }
    //
    // === Directories
    get dirs_names() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.dirs_names;
        }
        return undefined;
    }
    get dirs_names_modifiedTime() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.dirs_names_modifiedTime;
        }
        return undefined;
    }
    //
    // === Files
    get files_names() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.files_names;
        }
        return undefined;
    }
    get files_names_modifiedTime() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.files_names_modifiedTime;
        }
        return undefined;
    }
    get_file_entry(file_name) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_file_entry(file_name);
        }
        return undefined;
    }
    get_files_matching_pattern(pattern) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_files_matching_pattern(pattern);
        }
        return undefined;
    }
    //
    // === Trees
    get_dirs_files_table_arr(recursive, other_trees) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_dirs_files_table_arr(recursive, other_trees);
        }
        return undefined;
    }
    scan(dir_path, entries_matching_path, get_stats) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.scan(dir_path, entries_matching_path, get_stats);
        }
        return undefined;
    }
    tree_str(nb_indents) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.tree_str(nb_indents);
        }
        return undefined;
    }
    //
    // === MASTER PROXIES ===
    //
    // === NAME
    get master_name() {
        if (this.master) {
            return this.master.name;
        }
        return undefined;
    }
    //
    // === PATH
    get master_path() {
        if (this.master) {
            return this.master.path;
        }
        return undefined;
    }
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_master_map(full_parent_path, recursive) {
        if (this.master) {
            return this.master.get_map(full_parent_path, recursive);
        }
        return undefined;
    }
    get_master_subdir(dir_name) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.get_subdir(dir_name);
        }
        return undefined;
    }
    set_master_subdir(dir_tree) {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.set_subdir(dir_tree);
        }
        return undefined;
    }
    //
    // === SLAVE PROXIES ===
    ensure_files_map() {
        if (this.slave) {
            this.slave.ensure_files_map();
        }
        else {
            throw new TypeError("Slave directory " +
                this.name +
                " : No slave to ensure a files map exists");
        }
    }
    get file_entry() {
        const master_or_slave = this.master_or_slave;
        if (master_or_slave) {
            return master_or_slave.file_entry;
        }
        return undefined;
    }
    set file_entry(entry) {
        if (this.slave) {
            this.slave.file_entry = entry;
        }
        else {
            throw new TypeError("Slave directory " + this.name + " : No slave to set the file entry to");
        }
    }
    make_new(obj) {
        if (this.slave) {
            return this.slave.make_new(obj);
        }
        else {
            throw new TypeError("Slave directory " + this.name + " : No slave to make a new directory");
        }
    }
    load_fs_stats(entry_name, dir_path) {
        if (this.slave) {
            return this.slave.load_fs_stats(entry_name, dir_path);
        }
        else {
            throw new TypeError("Slave directory " + this.name + " : No slave to load FS stats");
        }
    }
    slave_tree_str(nb_indents) {
        if (this.slave) {
            return this.slave.tree_str(nb_indents);
        }
        else {
            throw new TypeError("Slave directory " + this.name + " : No slave to fetch a tree from");
        }
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
    /*  get_slave_subdir(dir_name: string): Directory_Tree_Slave {
      return <Directory_Tree_Slave>super.get_subdir(dir_name);
    }*/
    /*set slave_subdirs(dirs_trees: Directory_Tree_Slave[]) {
      this.ensure_dirs_map();
      dirs_trees.forEach((tree) => {
        this.dirs.set(tree.name, tree);
      });
    }
  
    set slave_subdir(dir_tree: Directory_Tree_Slave) {
      dir_tree.parent = this;
  
      this.ensure_dirs_map();
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
    }*/
    /**
     * Delete the specified tree directory from this.dirs
     * If this is now empty, call parent.delete(this.name)
     */
    delete(dir_name) {
        this.dirs.delete(dir_name);
        if (this.is_empty && this.parent) {
            this.parent.delete(this.name);
        }
    }
    //
    // === iDIRECTORY_TREE_ROOT ===
    load(file_or_fullPath) {
        return this.root.load(file_or_fullPath);
    }
    store(file_or_fullPath) {
        return this.root.store(file_or_fullPath);
    }
}
__decorate([
    obj.specs.decs.props.jsonified
], Directory_Tree_Slave_props.prototype, "_master", void 0);
__decorate([
    obj.specs.decs.props.jsonified
], Directory_Tree_Slave_props.prototype, "_slave", void 0);
__decorate([
    obj.specs.decs.meths.jsonify
], Directory_Tree_Slave_props.prototype, "master", null);
__decorate([
    obj.specs.decs.meths.jsonify
], Directory_Tree_Slave_props.prototype, "slave", null);
//# sourceMappingURL=Directory_Tree_Slave_props.js.map