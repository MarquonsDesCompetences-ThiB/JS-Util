import { Directory_Tree } from "./Directory_Tree.js";
import { Directory_Tree_Slave } from "./directory_tree_slave/Directory_Tree_Slave.js";
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
export declare function select(directory_tree: Directory_Tree, entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp, parent_dir_path?: string): Directory_Tree_Slave;
/**
 * Fetch a slave tree of only entries having any updated stats in file system
 *
 * @param parent_path Required when directory_tree is not a Directory_Tree_Root,
 *                    as they don't store their full path
 */
export declare function get_fs_updates(directory_tree: Directory_Tree, parent_path?: string): Promise<Directory_Tree_Slave | undefined>;
