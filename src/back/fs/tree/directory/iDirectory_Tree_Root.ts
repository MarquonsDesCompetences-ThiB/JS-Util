//

import { Json_File } from "@src/back/files/Json_File.js";
import {
  iDirectory_Tree,
  iDirectory_Tree_meths,
  iDirectory_Tree_props,
} from "./iDirectory_Tree.js";

// === Properties
export interface iDirectory_Tree_Root_props extends iDirectory_Tree_props {
  virtual_root?: iDirectory_Tree;

  /**
   * Saving file
   */
  store_file?: Json_File | string;

  /**
   * Regex used to load the directory tree
   */
  scan_regex?: string | string[];
}

//
// === Methods
export interface iDirectory_Tree_Root_meths extends iDirectory_Tree_meths {
  root: iDirectory_Tree_Root;

  /*super_scan(
    entries_matching_path?: string,
    get_stats?: boolean
  ): Promise<iDirectory_Tree>;*/

  load(file_or_fullPath?: Json_File | string): Promise<any>;
  store(file_or_fullPath?: Json_File | string): Promise<any>;
}

export type iDirectory_Tree_Root = iDirectory_Tree_Root_props &
  iDirectory_Tree_Root_meths;

// Root props only or full object
export type tDirectory_Tree_Root =
  | iDirectory_Tree_Root_props
  | iDirectory_Tree_Root;
