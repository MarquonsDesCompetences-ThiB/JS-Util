/// <reference types="node" />
import { obj } from "../../../../../../both/types/_types.js";
import { Stats } from "fs";
import { iDirectory_Tree_Slave, iDirectory_Tree_Slave_props } from "../iDirectory_Tree_Slave.js";
import { Entry_Stats_intf, iDirectory_Tree } from "../../common/iDirectory_Tree.js";
import { Json_File } from "../../../../../files/Json_File.js";
import { iDirectory_Tree_Node, iDirectory_Tree_Root_or_Node } from "../../iDirectory_Tree_Node.js";
import { iDirectory_Tree_Root } from "../../iDirectory_Tree_Root.js";
export declare abstract class Directory_Tree_Slave_props<Tmaster_tree extends iDirectory_Tree_Root_or_Node> extends obj.Obj implements iDirectory_Tree_Slave_props<Tmaster_tree> {
    protected _master: Tmaster_tree;
    /**
     * Temporarily directory state to work on
     * until its ready/completely validated
     * and pushed to the master
     */
    protected _slave?: Tmaster_tree;
    /**
     * Regex used to genereta this tree
     */
    scan_regex: string | string[];
    parent: iDirectory_Tree_Slave<Tmaster_tree | iDirectory_Tree_Root>;
    dirs: Map<string, iDirectory_Tree_Slave<iDirectory_Tree_Node>>;
    get is_root(): boolean;
    get id(): string;
    abstract get root(): iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node>;
    get master_or_slave(): Tmaster_tree;
    get master(): Tmaster_tree;
    set master(master: Tmaster_tree);
    get slave(): Tmaster_tree;
    set slave(master: Tmaster_tree);
    get name(): string;
    get path(): string;
    get_path(path: string | string[], absolute?: boolean): iDirectory_Tree | Entry_Stats_intf;
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, Tmaster_tree | Entry_Stats_intf>;
    get is_empty(): boolean;
    get dirs_names(): string[];
    get dirs_names_modifiedTime(): [string, string][];
    get files_names(): string[];
    get files_names_modifiedTime(): [string, string][];
    get_file_entry(file_name: string): Entry_Stats_intf;
    get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;
    get_dirs_files_table_arr(recursive?: boolean, other_trees?: iDirectory_Tree[]): any;
    scan(dir_path: string, entries_matching_path?: string | string[], get_stats?: boolean): Promise<iDirectory_Tree>;
    tree_str(nb_indents: number): string;
    get master_name(): string;
    get master_path(): string;
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_master_map(full_parent_path?: string, recursive?: boolean): Map<string, Tmaster_tree | Entry_Stats_intf>;
    get_master_subdir(dir_name: string): iDirectory_Tree;
    set_master_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree;
    ensure_files_map(): void;
    get file_entry(): Entry_Stats_intf;
    set file_entry(entry: Entry_Stats_intf);
    make_new(obj?: any): iDirectory_Tree;
    load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats>;
    slave_tree_str(nb_indents: number): string;
    /**
     * Ensure the map this.dirs exist ; if not, create it
     */
    ensure_dirs_map(): void;
    /**
     * Delete the specified tree directory from this.dirs
     * If this is now empty, call parent.delete(this.name)
     */
    delete(dir_name: string): void;
    load(file_or_fullPath?: Json_File | string): Promise<any>;
    store(file_or_fullPath?: Json_File | string): Promise<any>;
}
