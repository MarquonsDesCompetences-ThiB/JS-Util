import { Json_File } from "../../../files/Json_File.js";
import { iDirectory_Tree_meths, iDirectory_Tree_props } from "./common/iDirectory_Tree.js";
import { iDirectory_Tree_Node } from "./iDirectory_Tree_Node.js";
import { Virtual_Directory_Tree } from "./virtual/Virtual_Directory_Tree.js";
export interface iDirectory_Tree_Root_props extends iDirectory_Tree_props {
    virtual_root?: Virtual_Directory_Tree;
    dirs?: Map<string, iDirectory_Tree_Node>;
    /**
     * Saving file
     */
    store_file?: Json_File | string;
    /**
     * Regex used to load the directory tree
     */
    scan_regex?: string | string[];
}
export interface iDirectory_Tree_Root_meths extends iDirectory_Tree_meths {
    load(file_or_fullPath?: Json_File | string): Promise<any>;
    store(file_or_fullPath?: Json_File | string): Promise<any>;
}
export declare type iDirectory_Tree_Root = iDirectory_Tree_Root_props & iDirectory_Tree_Root_meths;
export declare type tDirectory_Tree_Root = iDirectory_Tree_Root_props | iDirectory_Tree_Root;
