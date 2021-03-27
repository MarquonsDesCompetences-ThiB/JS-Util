import { Dirent, Stats } from "fs";

import { obj } from "@both_types/_types.js";
import { specs as obj_specs } from "@both_types/obj/_obj.js";

import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf, iDirectory_Tree_Slave } from "../directory_intfs.js";

export class Directory_Tree_Slave<Tmaster_tree extends Directory_Tree>
  extends Directory_Tree
  implements iDirectory_Tree_Slave<Tmaster_tree> {
  @obj.specs.decs.props.jsonified
  protected _master: Tmaster_tree;

  /**
   * When no _master, to temporarily create it
   * until its ready/completely validated
   */
  @obj.specs.decs.props.jsonified
  protected _master_new?: Tmaster_tree;

  /**
   * Regex used to genereta this tree
   */
  scan_regex: string | string[];

  //
  // === Directory_Tree OVERRIDES ===
  //
  // === If not root only
  parent: Directory_Tree_Slave<Tmaster_tree>;

  dirs: Map<string, Directory_Tree_Slave<Directory_Tree>> = new Map<
    string,
    Directory_Tree_Slave<Directory_Tree>
  >();

  constructor(obj: iDirectory_Tree_Slave<Tmaster_tree> | any) {
    super();

    //
    // Check preconds
    /*{
      Wrong when a folder is new in file system
      if (!obj.master) {
        throw new TypeError(
          "Property master is missing in obj {iDirectory_Tree_Slave} argument"
        );
      }
    }*/

    this.set(obj, undefined, true);
  }

  //
  // === ID ===
  get id() {
    if (this.master) {
      return this.master.id;
    }
  }

  //
  // === ROOT ===
  get root() {
    if (this.parent) {
      return this.parent.root;
    }

    return this;
  }

  get virtual_root() {
    return this.root.master_or_new.virtual_root;
  }

  //
  // === MASTER ===
  get master_or_new(): Tmaster_tree {
    return this._master || this._master_new;
  }

  @obj.specs.decs.meths.jsonify
  get master(): Tmaster_tree {
    return this._master;
  }

  set master(master: Tmaster_tree) {
    this._master = master;
    this.name = master.name;
  }

  @obj.specs.decs.meths.jsonify
  get master_new(): Tmaster_tree {
    return this._master_new;
  }

  set master_new(master: Tmaster_tree) {
    this._master_new = master;
    this.name = master.name;
  }

  //
  // === PATH ===
  get path(): string {
    if (this.master) {
      return this.master.path;
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
  ): Map<string, Directory_Tree_Slave<Tmaster_tree> /*| Entry_Stats_intf*/> {
    return <any>super.get_map(full_parent_path, recursive);
  }

  //
  // === SUB-DIRECTORIES

  /**
   * Ensure the map this.dirs exist ; if not, create it
   */
  ensure_dirs_map() {
    if (!this.dirs) {
      this.dirs = new Map<string, Directory_Tree_Slave<Tmaster_tree>>();
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
   * Process both this.set_new_master and this.set_stats_to_master
   */
  apply_to_master(recursive_to_children?: boolean) {
    this.set_new_master();
    this.set_stats_to_master();

    if (recursive_to_children) {
      if (this.dirs) {
        this.dirs.forEach((dir_tree) => {
          dir_tree.apply_to_master(true);
        });
      }
    }
  }

  /**
   *  Set this._master_new to this._master
   *
   * @param recursive_to_children To also set sub directories trees' stats
   *                              to their master
   */
  set_new_master(recursive_to_children?: boolean): void {
    //
    // This is a new directory in fs => no master
    if (!this._master) {
      //
      // Apply _master_new or create a new master
      if (!apply_master_new.call(this)) {
        this._master = this.parent.make_new(this);

        // the created master's parent is the slave one
        // => set the original
        this._master.parent = this.parent.master;
      }
    }

    if (this.files) {
      this.files.forEach((file_entry, name) => {
        this.master.file_entry = file_entry;
        this.files.delete(name);
      });
    }

    //
    // Recursive call to subtrees
    {
      if (recursive_to_children) {
        if (this.dirs) {
          this.dirs.forEach((dir_tree) => {
            dir_tree.set_new_master(recursive_to_children);
          });
        }
      }
    }

    if (this.is_empty && this.parent) {
      this.parent.delete(this.name);
    }

    function apply_master_new() {
      if (this._master_new) {
        this._master = this._master_new;
        this._master_new = undefined;

        // the created master's parent is the slave one
        // => set the original
        this._master.parent = this.parent.master;
        return true;
      }

      return false;
    }
  }

  /**
   * Set this' stats to its master
   * Recursive by default : also this' files and dirs
   *                        set their stats to their master
   *
   * After setting, removes itself calling its parent :
   *  - if this is a directory, only if is now an empty Directory_Tree
   *  - always otherwise
   *
   * @param recursive_to_children To also set sub directories trees' stats
   *                              to their master
   */
  set_stats_to_master(recursive_to_children?: boolean): void {
    this.master.stats = this.stats;

    //
    // Recursive call to subtrees
    {
      if (recursive_to_children) {
        if (this.dirs) {
          this.dirs.forEach((dir_tree) => {
            dir_tree.set_stats_to_master(recursive_to_children);
          });
        }
      }
    }

    if (this.is_empty && this.parent) {
      this.parent.delete(this.name);
    }
  }

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
  // === GETTERS/SETTERS
  @obj_specs.decs.meths.jsonify
  get dirs_json(): any {
    const dirs: any = {};

    this.dirs.forEach((dir_tree, dname) => {
      dirs[dname] = dir_tree.toJSON();
    });

    return dirs;
  }

  set dirs_json(json: any) {
    for (const dname in json) {
      json[dname].parent = this;
      this.dirs.set(dname, new Directory_Tree_Slave(json[dname]));
    }
  }
}
