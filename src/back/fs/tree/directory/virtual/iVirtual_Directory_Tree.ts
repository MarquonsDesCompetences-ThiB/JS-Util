import {
  Entry_Stats_intf,
  iDirectory_Tree,
  iDirectory_Tree_meths,
  iDirectory_Tree_props,
} from "../common/iDirectory_Tree.js";
import { iDirectory_Tree_Root } from "../iDirectory_Tree_Root.js";
import { iDirectory_Tree_Root_Slave } from "../slave/iDirectory_Tree_Slave.js";

//
// === Properties
export interface iVirtual_Directory_Tree_props
  extends Omit<iDirectory_Tree_props, "dirs"> {
  dirs: Map<string, iDirectory_Tree_Root>;
}

//
// === Methods
export interface iVirtual_Directory_Tree_meths
  extends Omit<iDirectory_Tree_meths, "get_path"> {
  get_path(
    path: string | string[]
  ): iDirectory_Tree_Root_Slave | Entry_Stats_intf;
}

export type iVirtual_Directory_Tree<
  Tmaster_tree extends iDirectory_Tree
> = iVirtual_Directory_Tree_props & iVirtual_Directory_Tree_meths;

// Virtul directory props only or full object
export type tVirtual_Directory_Tree =
  | iVirtual_Directory_Tree_props
  | iVirtual_Directory_Tree_meths;
