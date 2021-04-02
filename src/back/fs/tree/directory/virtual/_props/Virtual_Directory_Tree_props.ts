import { sep as os_path_separator } from "path";
import { obj } from "@both_types/_types.js";
import dMeths = obj.specs.meths.decs;

import { Directory_Tree_Root } from "../../Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "../../slave/Directory_Tree_Slave.js";
import { get_fs_updates, select } from "../../../util.js";
import { iDirectory_Tree_Root_Slave } from "../../slave/iDirectory_Tree_Slave.js";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
} from "../../common/iDirectory_Tree.js";
import { Directory_Tree } from "../../common/Directory_Tree.js";
import { iVirtual_Directory_Tree_props } from "../iVirtual_Directory_Tree.js";
import {
  iDirectory_Tree_Root,
  iDirectory_Tree_Root_props,
} from "../../iDirectory_Tree_Root.js";

export class Virtual_Directory_Tree_props
  extends Directory_Tree
  implements iVirtual_Directory_Tree_props {
  readonly is_root = true;

  //
  // === iDirectory_Tree ===
  //id = undefined;
  name = "Virtual Directory";

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

  dirs: Map<string, iDirectory_Tree_Root> = new Map<
    string,
    iDirectory_Tree_Root
  >();

  /**
   * When a requested path does not start
   * with a dir name from this.dirs,
   * look in directory names of every specified dirs
   *
   */
  search_order: string[] = [];

  set add_dir(dir_tree: iDirectory_Tree_Root) {
    dir_tree.virtual_root = this;
    this.dirs.set(dir_tree.name, dir_tree);
  }

  @dMeths.jsonify
  set dirs_json(
    dir_trees: (iDirectory_Tree_Root | iDirectory_Tree_Root_props)[]
  ) {
    dir_trees.forEach((dir_tree) => {
      if (dir_tree instanceof Directory_Tree_Root) {
        this.add_dir = dir_tree;
        return;
      }
      //
      // else construct and add the Directory_Tree_Root
      this.add_dir = new Directory_Tree_Root(
        <iDirectory_Tree_Root_props>dir_tree
      );
    });
  }

  get_dir(dir_name: string): iDirectory_Tree_Root_Slave {
    if (!this.dirs) {
      return undefined;
    }

    return this.dirs.get(dir_name);
  }

  get_dirs_names(): string[] {
    const names = [];

    for (const key of this.dirs.keys()) {
      names.push(key);
    }
    return names;
  }

  get_path(path: string | string[]): iDirectory_Tree | Entry_Stats_intf {
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
        } catch (ex) {
          // ReferenceError => Entry not found
        }
      }
    }

    throw_ref_error();
    function throw_ref_error() {
      throw new ReferenceError(
        "Directory " +
          next_access +
          " (requested with path " +
          (<string[]>path).join(os_path_separator) +
          ") does not exist in this virtual directory nor in search_order's directories"
      );
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
  select(
    from_dir: string,
    entries_matching_path: string | string[],
    file_in_each_dir_matching_pattern?: RegExp
  ): Directory_Tree_Slave<iDirectory_Tree_Root> {
    const dir = this.get_dir(from_dir);
    if (!dir) {
      throw new ReferenceError(
        "Unexisting directory " + from_dir + " in this virtual directory"
      );
    }

    return select<iDirectory_Tree_Root>(
      <any>dir,
      entries_matching_path,
      file_in_each_dir_matching_pattern
    );
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
  select_add(
    from_dir: string,
    entries_matching_path: string | string[],
    file_in_each_dir_matching_pattern?: RegExp
  ) {
    this.add_dir = this.select(
      from_dir,
      entries_matching_path,
      file_in_each_dir_matching_pattern
    ).master_or_slave;
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
  select_from_all(
    entries_matching_path: string | string[],
    file_in_each_dir_matching_pattern?: RegExp
  ): Directory_Tree_Slave<Directory_Tree_Root>[] {
    const slaves = [];

    this.dirs.forEach((dir_tree) => {
      slaves.push(
        select<iDirectory_Tree_Root>(
          <any>dir_tree,
          entries_matching_path,
          file_in_each_dir_matching_pattern
        )
      );
    });

    return slaves;
  }

  /**
   * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
   * @param from_dir
   * @param path
   * @returns
   */
  async get_fs_updates(
    from_dir: string,
    path?: string
  ): Promise<Directory_Tree_Slave<iDirectory_Tree_Root>> {
    const dir = this.get_dir(from_dir);
    if (!dir) {
      throw new ReferenceError(
        "Unexisting directory " + from_dir + " in this virtual directory"
      );
    }

    return get_fs_updates<iDirectory_Tree_Root>(<any>dir, path);
  }

  /**
   * this.get_fs_updates but running on all this.directories
   *
   * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
   * @param from_dir
   * @param path
   * @returns
   */
  async get_fs_updates_from_all(
    path?: string
  ): Promise<iDirectory_Tree_Root_Slave[]> {
    const slaves_proms: Promise<iDirectory_Tree_Root_Slave>[] = [];

    this.dirs.forEach((dir_tree) => {
      slaves_proms.push(
        get_fs_updates<iDirectory_Tree_Root>(<any>dir_tree, path)
      );
    });

    return Promise.all(slaves_proms);
  }
}
