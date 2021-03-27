import { obj } from "@src/both/_both.js";
import { Dirent, Stats } from "fs";
import { iDirent_json } from "../entry/iDirent.js";

export interface Entry_Stats_intf extends iDirent_json {
  stats?: Stats;
}

//
// === TREE ===
export interface iDirent_Directory_Tree {
  dirent: Dirent | iDirent_json;
  parent: iDirectory_Tree_props;
}

export interface iDirectory_Tree_props extends obj.Obj {
  name: string;
  dirent?: Dirent | iDirent_json;
  stats?: Stats;

  id: string;
  root: iDirectory_Tree_Root;

  //
  // === PATH ===
  path: string;
  full_path: string;
  relative_path: string;
}

export interface iDirectory_Tree extends iDirectory_Tree_props {
  parent?: iDirectory_Tree;
  dirs: Map<string, iDirectory_Tree>;

  //
  // === GETTERS ===
  dirs_json?: any;
  files_json?: any;

  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, iDirectory_Tree | Entry_Stats_intf>;

  get_path(
    path: string | string[],
    absolute?: boolean
  ): iDirectory_Tree | Entry_Stats_intf;

  get_dirs_files_table_arr(
    recursive?: boolean,
    other_trees?: iDirectory_Tree[]
  ): any;

  get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;

  //
  // === TREES ===
  scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ): Promise<iDirectory_Tree>;

  //
  // === TO STRING ===
  tree_str(nb_indents: number): string;
}

//
// === TREE ROOT ===
export interface iDirectory_Tree_Root extends iDirectory_Tree {
  virtual_root?: iDirectory_Tree_props;
}

//
// === TREE NODE ===
export interface iDirectory_Tree_Node_props extends iDirectory_Tree_props {}

export interface iDirectory_Tree_Node extends iDirectory_Tree {}

//
// === TREE SLAVE ===
export interface iDirectory_Tree_Slave<Tmaster_tree extends iDirectory_Tree>
  extends iDirectory_Tree {
  parent?: iDirectory_Tree_Slave<Tmaster_tree>;

  master?: Tmaster_tree;
  master_new?: Tmaster_tree;

  scan_regex?: string | string[];
}
