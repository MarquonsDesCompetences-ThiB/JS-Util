import { Json_File } from "@src/back/files/Json_File.js";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
  iDirectory_Tree_meths,
  iDirectory_Tree_props,
} from "../iDirectory_Tree.js";
import { iDirectory_Tree_Node } from "../iDirectory_Tree_Node.js";
import {
  iDirectory_Tree_Root,
  iDirectory_Tree_Root_props,
} from "../iDirectory_Tree_Root.js";

// === Properties
export interface iDirectory_Tree_Slave_props<
  Tmaster_tree extends iDirectory_Tree
> extends iDirectory_Tree_props {
  root?: iDirectory_Tree_Slave<iDirectory_Tree_Root>;

  parent?: iDirectory_Tree_Slave<iDirectory_Tree>;

  master?: iDirectory_Tree;
  master_new?: iDirectory_Tree;
  master_or_new?: iDirectory_Tree;

  scan_regex?: string | string[];

  dirs?: Map<string, iDirectory_Tree_Slave<iDirectory_Tree_Node>>;

  slave_subdirs?: iDirectory_Tree_Slave<iDirectory_Tree_Node>[];
  slave_subdir?: iDirectory_Tree_Slave<iDirectory_Tree_Node>;
}

//
// === Methods
export interface iDirectory_Tree_Slave_meths<
  Tmaster_tree extends iDirectory_Tree
> extends iDirectory_Tree_meths {
  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, iDirectory_Tree_Slave<iDirectory_Tree> | Entry_Stats_intf>;
  ensure_dirs_map(): void;

  // get_slave_subdir(dir_name: string): iDirectory_Tree_Slave<Tmaster_tree>;

  apply_to_master(recursive_to_children?: boolean): void;
  set_new_master(recursive_to_children?: boolean): void;
  set_stats_to_master(recursive_to_children?: boolean): void;

  delete(dir_name: string): void;

  //
  // === iDIRECTORY_TREE_ROOT ===
  load(file_or_fullPath?: Json_File | string): Promise<any>;
  store(file_or_fullPath?: Json_File | string): Promise<any>;
}

export type iDirectory_Tree_Slave<
  Tmaster_tree extends iDirectory_Tree
> = iDirectory_Tree_Slave_props<Tmaster_tree> &
  iDirectory_Tree_Slave_meths<Tmaster_tree>;

// Slave props only or full object
export type tDirectory_Tree_Slave<Tmaster_tree extends iDirectory_Tree> =
  | iDirectory_Tree_Slave_props<Tmaster_tree>
  | iDirectory_Tree_Slave<Tmaster_tree>;

//
// === ROOT OR SLAVE
export type tDirectory_Tree_Root_Slave =
  | iDirectory_Tree_Root
  | iDirectory_Tree_Root_props
  | iDirectory_Tree_Slave<iDirectory_Tree_Root>
  | iDirectory_Tree_Slave_props<iDirectory_Tree_Root>;

export type iDirectory_Tree_Root_Slave =
  | iDirectory_Tree_Root
  | iDirectory_Tree_Slave<iDirectory_Tree_Root>;
