import { obj } from "@both_types/_types.js";
import { specs as obj_specs } from "@both_types/obj/_obj.js";

import { Directory_Tree } from "../common/Directory_Tree.js";
import {
  iDirectory_Tree_Slave,
  tDirectory_Tree_Slave,
} from "./iDirectory_Tree_Slave.js";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
} from "../common/iDirectory_Tree.js";
import { Json_File } from "@src/back/files/Json_File.js";
import { Directory_Tree_Slave_props } from "./_props/Directory_Tree_Slave_props.js";
import { iDirectory_Tree_Root } from "../iDirectory_Tree_Root.js";
import {
  iDirectory_Tree_Node,
  iDirectory_Tree_Node_meths,
  iDirectory_Tree_Root_or_Node,
} from "../iDirectory_Tree_Node.js";
import { Directory_Tree_Node } from "../Directory_Tree_Node.js";

export class Directory_Tree_Slave<
    Tmaster_tree extends iDirectory_Tree_Root_or_Node
  >
  //extends Directory_Tree
  extends Directory_Tree_Slave_props<Tmaster_tree>
  implements iDirectory_Tree_Slave<Tmaster_tree> {
  constructor(
    obj:
      | tDirectory_Tree_Slave<Tmaster_tree>
      | Directory_Tree_Slave<Tmaster_tree>
  ) {
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
  // === GETTERS/SETTERS ===
  //
  // === PATH
  get path() {
    return this.master_or_slave.path;
  }

  get full_path() {
    return this.master_or_slave.full_path;
  }

  get relative_path() {
    return this.master_or_slave.relative_path;
  }

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
      this.dirs.set(
        dname,
        new Directory_Tree_Slave<Directory_Tree_Node>(json[dname])
      );
    }
  }

  //
  // === ROOT ===
  get root(): iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node> {
    if (this.parent) {
      return this.parent.root;
    }

    return <iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node>>(<any>this);
  }

  get virtual_root() {
    return this.root.master_or_slave.virtual_root;
  }

  get_subdir(dir_name: string): iDirectory_Tree_Slave<iDirectory_Tree_Node> {
    if (!this.dirs) {
      return undefined;
    }

    return this.dirs.get(dir_name);
  }

  /**
   * Clone master and set the result to slave
   * Remove slave.dirs
   */
  init_slave_from_master() {
    if (!this.master) {
      throw new TypeError("No master to init a slave from");
    }

    this.slave = this.master.clone();
    this.slave.dirs = undefined;
  }

  /**
   * Add the specified directory tree to this.dirs,
   * and its slave to this.slave.dirs
   *
   * If one with this name already exists, update its
   * values with those in dir_tree
   * => enable slaves to keep their value up to date
   */
  set_subdir(
    dir_tree: iDirectory_Tree_Slave<iDirectory_Tree_Node>
  ): iDirectory_Tree_Slave<iDirectory_Tree_Node> {
    dir_tree.parent = this;

    //
    // Add the dir_tree's master slave
    {
      this.slave.set_subdir(dir_tree.slave);
    }

    //
    // Add the slave dir_tree
    {
      this.ensure_dirs_map();
      const dir_set = this.dirs.get(dir_tree.name);
      //
      // Must add the new one
      {
        if (!dir_set) {
          this.dirs.set(dir_tree.name, dir_tree);
          return dir_tree;
        }
      }
      //
      // Else update the existing one's values
      dir_set.set(dir_tree);
      return dir_set;
    }
  }

  /**
   * Process both this.set_new_master and this.set_stats_to_master
   */
  apply_to_master(recursive_to_children?: boolean) {
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
    if (this.master) {
      return;
    }

    if (recursive_to_children) {
      this.master = this.slave;
    } else {
      this.master = this.slave.clone();

      if (this.master.dirs) {
        this.master.dirs.clear();
      }
    }

    if (!this.master.is_root) {
      (<iDirectory_Tree_Node>this.master).parent = this.parent.master;
    }

    if (recursive_to_children) {
      if (this.dirs) {
        this.dirs.forEach((subdir) => {
          subdir.set_new_master(recursive_to_children);
        });
      }
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
    //
    // Ensure there is a master
    {
      if (!this.master) {
        this.set_new_master();
      }
    }

    this.master.stats = this.slave.stats;

    if (recursive_to_children) {
      if (this.dirs) {
        this.dirs.forEach((subdir) => {
          subdir.set_stats_to_master(recursive_to_children);
        });
      }
    }
  }
}
