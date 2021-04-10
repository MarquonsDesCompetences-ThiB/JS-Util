/// <reference types="node" />
import { Stats } from "fs";
import { Directory_Tree_props } from "./_props/Directory_Tree_props.js";
import { Entry_Stats_intf, iDirectory_Tree, tDirectory_Tree } from "./iDirectory_Tree.js";
import { iDirectory_Tree_Node, tDirectory_Tree_Node } from "../iDirectory_Tree_Node.js";
import { iDirectory_Tree_Root, tDirectory_Tree_Root } from "../iDirectory_Tree_Root.js";
export declare abstract class Directory_Tree extends Directory_Tree_props implements iDirectory_Tree {
    /**
     * Set by Directory_Tree_Node declaration
     */
    static make_node: (node_dir: tDirectory_Tree_Node | iDirectory_Tree_Node) => iDirectory_Tree_Node;
    /**
     * Set by Directory_Tree_Root declaration
     * */
    static make_root: (dirent_or_full_path_or_obj: tDirectory_Tree_Root | iDirectory_Tree_Root) => iDirectory_Tree_Root;
    abstract readonly is_root: boolean;
    /**
     *
     *
     */
    constructor(obj?: tDirectory_Tree | Directory_Tree);
    get master(): iDirectory_Tree;
    set subdirs(dirs_trees: iDirectory_Tree_Node[]);
    /**
     * Add the specified directory tree to this.dirs
     * If one with this name already exists, update its
     * values with those in dir_tree
     * => enable slaves to keep their value up to date
     */
    set_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree;
    get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;
    /**
     *
     * @param entry_name Must be a key in this.dirs or this.files
     * @param dir_path If nt set, fetched from this.path
     * @returns
     */
    load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats>;
    /**
     * Scan this directory in file system to fill this.dirs and this.files
     * @param dir_path
     * @param entries_matching_path
     * @param get_stats
     */
    scan(dir_path: string, entries_matching_path?: string | string[], get_stats?: boolean): Promise<Directory_Tree>;
    /**
     * Return directories and files data to be displayable by console.table
     * @param recursive
     * @param path
     */
    get_dirs_files_table_arr(recursive?: boolean, other_trees?: iDirectory_Tree[]): any;
    get dirs_json(): any;
    set dirs_json(json: any);
    get dirs_names(): string[];
    /**
     * Return all directories' names in this directory
     * and their respective modified time (when stats is set)
     */
    get dirs_names_modifiedTime(): [string, string][];
    print_dirs_files_table(recursive?: boolean, other_trees?: iDirectory_Tree[]): void;
    static error(file_name: string, ex: string | Error): void;
    static info(file_name: string, msg: string): void;
    static log(file_name: string, msg: string): void;
    static trace(file_name: string, msg: string): void;
    static warn(file_name: string, msg: string): void;
}
