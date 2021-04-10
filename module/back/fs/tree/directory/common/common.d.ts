import { Entry_Stats_intf, iDirectory_Tree } from "./iDirectory_Tree.js";
/**
 * Get a map of subdirs' trees and files,
 * as map whose keys are the full_path
 */
export declare function get_map<Tdir extends iDirectory_Tree, Tfile extends Entry_Stats_intf>(directory_tree: iDirectory_Tree, full_parent_path?: string, recursive?: boolean): Map<string, Tdir | Tfile>;
