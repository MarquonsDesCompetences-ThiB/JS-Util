/// <reference types="node" />
import { Entry } from "../../../entry/Entry.js";
import { Stats } from "fs";
import { Entry_Stats_intf, iDirectory_Tree } from "../iDirectory_Tree.js";
import { iDirectory_Tree_Root } from "../../iDirectory_Tree_Root.js";
export declare abstract class Directory_Tree_props extends Entry implements Entry_Stats_intf {
    #private;
    abstract readonly is_root: boolean;
    /**
     * If no enum decorator, value wouldn't be set
     * by Obj.set if this.stats = undefined
     */
    stats?: Stats;
    dirs: Map<string, iDirectory_Tree>;
    files: Map<string, Entry_Stats_intf>;
    parent?: iDirectory_Tree;
    get root(): iDirectory_Tree_Root;
    get virtual_root(): import("../../_directory.js").Virtual;
    abstract get_dirs_files_table_arr(recursive?: boolean, other_trees?: iDirectory_Tree[]): any;
    abstract scan(dir_path: string, entries_matching_path?: string | string[], get_stats?: boolean): Promise<iDirectory_Tree>;
    abstract get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;
    /**
     * Required :
     *  dirent {Dirent}
     *  parent {Directory_Tree_props}
     *
     *
    constructor() {
      super();
    }
    */
    /**
     * Create a new instance of this with the specified parameters
     * Usefull to create a new master for a slave which have none,
     * keeping all slaves' values
     *
     * @param obj
     * @returns
     */
    make_new(obj?: any): any;
    toString(): string;
    get id(): string;
    set id(id: string);
    tree_str(nb_indents?: number): string;
    get path(): string;
    /**
     * To make the getter overriding above
     * not to turn the property to read-only
     */
    set path(path: string);
    get full_path(): string;
    /**
     * To make the getter overriding above
     * not to turn the property to read-only
     */
    set full_path(full_path: string);
    get relative_path(): string;
    get is_empty(): boolean;
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, iDirectory_Tree | Entry_Stats_intf>;
    /**
     * Ensure the map this.dirs exist ; if not, create it
     */
    ensure_dirs_map(): void;
    get_subdir(dir_name: string): iDirectory_Tree;
    /**
     * Ensure the map this.files exist ; if not, create it
     */
    ensure_files_map(): void;
    get_file_entry(file_name: string): Entry_Stats_intf;
    /**
     * Add the specified file entry to this.files
     * If one with this name already exists, update its
     * values with those in entry_stats
     */
    set file_entry(entry_stats: Entry_Stats_intf);
    get files_json(): any;
    set files_json(json: any);
    get files_names(): string[];
    /**
     * Return all files' names in this directory
     * and their respective modified time (when stats is set)
     */
    get files_names_modifiedTime(): [string, string][];
    /**
     *
     * @param path
     * @param absolute If the path set is absolute, eg :
     *                  no starting slash -> go to root to fetch the path
     *                  starting ./ or ../ -> look from current directory
     * @returns
     */
    get_path(path: string | string[], absolute?: boolean): iDirectory_Tree | Entry_Stats_intf;
}
