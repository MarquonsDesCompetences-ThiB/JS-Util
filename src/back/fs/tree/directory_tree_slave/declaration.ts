import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf } from "../_props/Directory_Tree_props.js";

export interface iDirectory_Tree_Slave extends Directory_Tree {
  //
  // === PROPERTIES ===
  //protected _master: Directory_Tree;

  //
  // === Directory_Tree OVERRIDES ===
  //
  // === If not root only
  parent: iDirectory_Tree_Slave;

  dirs?: Map<string, iDirectory_Tree_Slave>;

  //
  // === METHODS ===
  //constructor(master: Directory_Tree, slave_parent: iDirectory_Tree_Slave);

  //
  // === GETTERS / SETTERS
  master: Directory_Tree;
  path: string;

  slave_subdirs: iDirectory_Tree_Slave[];
  slave_subdir: iDirectory_Tree_Slave;

  //
  // === METHODS ===
  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, iDirectory_Tree_Slave | Entry_Stats_intf>;
  ensure_dirs_map(): void;

  get_slave_subdir(dir_name: string): iDirectory_Tree_Slave;

  set_stats_to_master(recursive_to_children?: boolean): void;

  delete(dir_name: string): void;
}

/**
 * Not to have an empty generated JS resulting
 * in an error when importing this module
 */
export const foo = undefined;
