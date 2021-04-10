import { iDirectory_Tree_meths, iDirectory_Tree_props } from "./common/iDirectory_Tree.js";
import { iDirectory_Tree_Root } from "./iDirectory_Tree_Root.js";
import { Virtual_Directory_Tree } from "./virtual/Virtual_Directory_Tree.js";
export declare type iDirectory_Tree_Root_or_Node = iDirectory_Tree_Root | iDirectory_Tree_Node;
export interface iDirectory_Tree_Node_props extends iDirectory_Tree_props {
    parent: iDirectory_Tree_Root_or_Node;
    dirs?: Map<string, iDirectory_Tree_Node>;
}
export interface iDirectory_Tree_Node_meths extends iDirectory_Tree_meths {
    readonly root: iDirectory_Tree_Root;
    readonly virtual_root: Virtual_Directory_Tree;
}
export declare type iDirectory_Tree_Node = iDirectory_Tree_Node_props & iDirectory_Tree_Node_meths;
export declare type tDirectory_Tree_Node = iDirectory_Tree_Node_props | iDirectory_Tree_Node;
