/// <reference types="node" />
import { Directory_Tree_Slave } from "./directory/slave/Directory_Tree_Slave.js";
import { Dirent } from "fs";
import { iDirectory_Tree_Slave } from "./directory/slave/iDirectory_Tree_Slave.js";
import { iDirectory_Tree_Node } from "./directory/iDirectory_Tree_Node.js";
import { iDirectory_Tree_Root } from "./directory/iDirectory_Tree_Root.js";
/**
 * Construct a slave tree
 * of directories and files (from directory_tree.dirs and directory_tree.files)
 * matching entries_matching_path or file_in_each_dir_matching_pattern
 *
 * @param entries_matching_path Directories/full file path
 *                              of entries to retrieve
 * @param file_in_each_dir_matching_pattern Files to retrieve
 *                                          from every directory
 * @param parent_dir_path Path of the parent directory
 */
export declare function select<Tmaster_tree extends iDirectory_Tree_Root | iDirectory_Tree_Node>(directory_tree: Tmaster_tree, entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp, parent_dir_path?: string): Directory_Tree_Slave<Tmaster_tree>;
/**
 * Fetch a slave tree of only entries having any updated stats in file system
 *
 * @param path Required when directory_tree is not a Directory_Tree_Root,
 *                    as they don't store their full path
 */
export declare function get_fs_updates<Tmaster_tree extends iDirectory_Tree_Root | iDirectory_Tree_Node>(directory_Tree_or_Dirent: Tmaster_tree | Dirent, path?: string, parent_slave?: iDirectory_Tree_Slave<Tmaster_tree | iDirectory_Tree_Root>): Promise<Directory_Tree_Slave<Tmaster_tree> | undefined>;
