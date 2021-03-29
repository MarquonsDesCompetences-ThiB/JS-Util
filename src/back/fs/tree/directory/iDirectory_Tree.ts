import { obj } from "@src/both/_both.js";
import { Dirent, Stats } from "fs";
import { Entry } from "../entry/Entry.js";
import { iDirent_json } from "../entry/iDirent.js";
import { iDirectory_Tree_Root } from "./iDirectory_Tree_Root.js";
import { Virtual_Directory_Tree_props } from "./virtual/_props/Virtual_Directory_Tree_props.js";

export interface Entry_Stats_intf extends iDirent_json {
  stats?: Stats;
}

//
// === DIRENT TREE ===
export interface iDirent_Directory_Tree {
  dirent: Dirent | iDirent_json;
  parent: iDirectory_Tree_props;
}

//
// === DIRECTORY TREE ===
//
// === Properties
export interface iDirectory_Tree_props {
  parent?: iDirectory_Tree;

  id?: string;
  name?: string;
  dirent?: Dirent | iDirent_json;
  stats?: Stats;

  //
  // === PATH ===
  path?: string;
  full_path?: string;
  relative_path?: string;

  //
  // === DIRS ===
  dirs?: Map<string, iDirectory_Tree>;
  dirs_json?: any;

  //
  // === FILES ===
  files?: Map<string, Entry_Stats_intf | Entry>;
  files_json?: any;
}

//
// === Methods
export interface iDirectory_Tree_meths extends obj.Obj {
  //
  // === GETTERS ===
  is_empty: boolean;

  //
  // === Dirs
  readonly dirs_names: string[];
  readonly dirs_names_modifiedTime: [string, string][];
  ensure_dirs_map(): void;
  get_subdir(dir_name: string): iDirectory_Tree;
  set_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree;

  //
  // === Files
  ensure_files_map(): void;
  readonly files_names: string[];
  readonly files_names_modifiedTime: [string, string][];
  get_file_entry(file_name: string): Entry_Stats_intf;
  file_entry: Entry_Stats_intf;
  get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;

  get_dirs_files_table_arr(
    recursive?: boolean,
    other_trees?: iDirectory_Tree[]
  ): any;

  //
  // === CHILDREN ===
  root: iDirectory_Tree_Root;
  virtual_root: Virtual_Directory_Tree_props;

  //
  // === Slave
  master?: iDirectory_Tree;

  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, iDirectory_Tree | Entry_Stats_intf>;

  get_path(
    path: string | string[],
    absolute?: boolean
  ): iDirectory_Tree | Entry_Stats_intf;

  //
  // === TREES ===
  make_new(obj?): iDirectory_Tree;

  load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats>;

  scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ): Promise<iDirectory_Tree>;

  //
  // === TO STRING ===
  tree_str(nb_indents: number): string;
}

export type iDirectory_Tree = iDirectory_Tree_props & iDirectory_Tree_meths;
// Directory tree props only or full object
export type tDirectory_Tree = iDirectory_Tree_props | iDirectory_Tree;
