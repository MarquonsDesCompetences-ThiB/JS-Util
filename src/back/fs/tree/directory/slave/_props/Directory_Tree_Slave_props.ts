import { obj } from "@both_types/_types.js";
import { specs as obj_specs } from "@both_types/obj/_obj.js";
import { Stats } from "fs";

import {
  iDirectory_Tree_Slave,
  iDirectory_Tree_Slave_props,
  tDirectory_Tree_Slave,
} from "../iDirectory_Tree_Slave.js";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
} from "../../common/iDirectory_Tree.js";
import { Json_File } from "@src/back/files/Json_File.js";
import { Directory_Tree_Slave } from "../Directory_Tree_Slave.js";
import {
  iDirectory_Tree_Node,
  iDirectory_Tree_Root_or_Node,
} from "../../iDirectory_Tree_Node.js";
import { iDirectory_Tree_Root } from "../../iDirectory_Tree_Root.js";

export abstract class Directory_Tree_Slave_props<
    Tmaster_tree extends iDirectory_Tree_Root_or_Node
  >
  //extends Directory_Tree
  extends obj.Obj
  implements iDirectory_Tree_Slave_props<Tmaster_tree> {
  @obj.specs.decs.props.jsonified
  protected _master: Tmaster_tree;

  /**
   * Temporarily directory state to work on
   * until its ready/completely validated
   * and pushed to the master
   */
  @obj.specs.decs.props.jsonified
  protected _slave?: Tmaster_tree;

  /**
   * Regex used to genereta this tree
   */
  scan_regex: string | string[];

  //
  // === Directory_Tree OVERRIDES ===
  //
  // === If not root only
  parent: iDirectory_Tree_Slave<Tmaster_tree | iDirectory_Tree_Root>;

  dirs: Map<string, iDirectory_Tree_Slave<iDirectory_Tree_Node>> = new Map<
    string,
    iDirectory_Tree_Slave<iDirectory_Tree_Node>
  >();

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

  abstract get root(): iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node>;

  //
  // === MASTER ===
  get master_or_slave(): Tmaster_tree {
    return this._master || this._slave;
  }

  @obj.specs.decs.meths.jsonify
  get master(): Tmaster_tree {
    return this._master;
  }

  set master(master: Tmaster_tree) {
    this._master = master;
  }

  @obj.specs.decs.meths.jsonify
  get slave(): Tmaster_tree {
    return this._slave;
  }

  set slave(master: Tmaster_tree) {
    this._slave = master;
  }

  //
  // === COMMON MASTER/SLAVE PROXIES ===
  //
  // === NAME
  get name(): string {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.name;
    }

    return undefined;
  }

  //
  // === PATH
  get path(): string {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.path;
    }

    return undefined;
  }

  get_path(path: string | string[], absolute?: boolean) {
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
  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, Tmaster_tree | Entry_Stats_intf> {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return <any>master_or_slave.get_map(full_parent_path, recursive);
    }

    return undefined;
  }

  get is_empty(): boolean {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.is_empty;
    }

    return undefined;
  }

  //
  // === Directories
  get dirs_names(): string[] {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.dirs_names;
    }

    return undefined;
  }

  get dirs_names_modifiedTime(): [string, string][] {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.dirs_names_modifiedTime;
    }

    return undefined;
  }

  //
  // === Files
  get files_names(): string[] {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.files_names;
    }

    return undefined;
  }

  get files_names_modifiedTime(): [string, string][] {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.files_names_modifiedTime;
    }

    return undefined;
  }

  get_file_entry(file_name: string): Entry_Stats_intf {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.get_file_entry(file_name);
    }

    return undefined;
  }

  get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf> {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.get_files_matching_pattern(pattern);
    }

    return undefined;
  }

  //
  // === Trees
  get_dirs_files_table_arr(
    recursive?: boolean,
    other_trees?: iDirectory_Tree[]
  ): any {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.get_dirs_files_table_arr(recursive, other_trees);
    }

    return undefined;
  }

  scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ) {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.scan(dir_path, entries_matching_path, get_stats);
    }

    return undefined;
  }

  tree_str(nb_indents: number) {
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
  get master_name(): string {
    if (this.master) {
      return this.master.name;
    }

    return undefined;
  }

  //
  // === PATH
  get master_path(): string {
    if (this.master) {
      return this.master.path;
    }

    return undefined;
  }

  /**
   * Get a map of subdirs' trees and files,
   * as map whose keys are the full_path
   */
  get_master_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, Tmaster_tree | Entry_Stats_intf> {
    if (this.master) {
      return <any>this.master.get_map(full_parent_path, recursive);
    }

    return undefined;
  }

  get_master_subdir(dir_name: string): iDirectory_Tree {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.get_subdir(dir_name);
    }

    return undefined;
  }

  set_master_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree {
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
    } else {
      throw new TypeError(
        "Slave directory " +
          this.name +
          " : No slave to ensure a files map exists"
      );
    }
  }

  get file_entry(): Entry_Stats_intf {
    const master_or_slave = this.master_or_slave;
    if (master_or_slave) {
      return master_or_slave.file_entry;
    }

    return undefined;
  }

  set file_entry(entry: Entry_Stats_intf) {
    if (this.slave) {
      this.slave.file_entry = entry;
    } else {
      throw new TypeError(
        "Slave directory " + this.name + " : No slave to set the file entry to"
      );
    }
  }

  make_new(obj?): iDirectory_Tree {
    if (this.slave) {
      return this.slave.make_new(obj);
    } else {
      throw new TypeError(
        "Slave directory " + this.name + " : No slave to make a new directory"
      );
    }
  }

  load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats> {
    if (this.slave) {
      return this.slave.load_fs_stats(entry_name, dir_path);
    } else {
      throw new TypeError(
        "Slave directory " + this.name + " : No slave to load FS stats"
      );
    }
  }

  slave_tree_str(nb_indents: number) {
    if (this.slave) {
      return this.slave.tree_str(nb_indents);
    } else {
      throw new TypeError(
        "Slave directory " + this.name + " : No slave to fetch a tree from"
      );
    }
  }

  //
  // === SUB-DIRECTORIES

  /**
   * Ensure the map this.dirs exist ; if not, create it
   */
  ensure_dirs_map() {
    if (!this.dirs) {
      this.dirs = new Map<
        string,
        iDirectory_Tree_Slave<iDirectory_Tree_Node>
      >();
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
  delete(dir_name: string): void {
    this.dirs.delete(dir_name);

    if (this.is_empty && this.parent) {
      this.parent.delete(this.name);
    }
  }

  //
  // === iDIRECTORY_TREE_ROOT ===
  load(file_or_fullPath?: Json_File | string): Promise<any> {
    return this.root.load(file_or_fullPath);
  }

  store(file_or_fullPath?: Json_File | string): Promise<any> {
    return this.root.store(file_or_fullPath);
  }
}
