import {
  iDirectory_Tree_meths,
  iDirectory_Tree_props,
} from "./iDirectory_Tree.js";

// === Properties
export interface iDirectory_Tree_Node_props extends iDirectory_Tree_props {}

//
// === Methods
export interface iDirectory_Tree_Node_meths extends iDirectory_Tree_meths {}

export type iDirectory_Tree_Node = iDirectory_Tree_Node_props &
  iDirectory_Tree_Node_meths;
// Node props only or full object
export type tDirectory_Tree_Node =
  | iDirectory_Tree_Node_props
  | iDirectory_Tree_Node;
