/// <reference types="node" />
import { obj } from "../../../../../both/_both.js";
import { Dirent, Stats } from "fs";
import { Entry } from "../../entry/Entry.js";
import { iDirent_json } from "../../entry/iDirent.js";
import { iDirectory_Tree_Root } from "../iDirectory_Tree_Root.js";
export interface Entry_Stats_intf extends iDirent_json {
    stats?: Stats;
}
export interface iDirent_Directory_Tree {
    dirent: Dirent | iDirent_json;
    parent: iDirectory_Tree_props;
}
export interface iDirectory_Tree_props {
    id?: string;
    name?: string;
    dirent?: Dirent | iDirent_json;
    stats?: Stats;
    path?: string;
    full_path?: string;
    relative_path?: string;
    dirs?: Map<string, iDirectory_Tree>;
    dirs_json?: any;
    files?: Map<string, Entry_Stats_intf | Entry>;
    files_json?: any;
}
export interface iDirectory_Tree_meths extends obj.Obj {
    readonly is_root: boolean;
    root: iDirectory_Tree_Root;
    is_empty: boolean;
    readonly dirs_names: string[];
    readonly dirs_names_modifiedTime: [string, string][];
    ensure_dirs_map(): void;
    get_subdir(dir_name: string): iDirectory_Tree;
    set_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree;
    ensure_files_map(): void;
    readonly files_names: string[];
    readonly files_names_modifiedTime: [string, string][];
    get_file_entry(file_name: string): Entry_Stats_intf;
    file_entry: Entry_Stats_intf;
    get_files_matching_pattern(pattern?: RegExp): Map<string, Entry_Stats_intf>;
    get_dirs_files_table_arr(recursive?: boolean, other_trees?: iDirectory_Tree[]): any;
    master?: iDirectory_Tree;
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, iDirectory_Tree | Entry_Stats_intf>;
    get_path(path: string | string[], absolute?: boolean): iDirectory_Tree | Entry_Stats_intf;
    make_new(obj?: any): iDirectory_Tree;
    load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats>;
    scan(dir_path: string, entries_matching_path?: string | string[], get_stats?: boolean): Promise<iDirectory_Tree>;
    tree_str(nb_indents: number): string;
}
export declare type iDirectory_Tree = iDirectory_Tree_props & iDirectory_Tree_meths;
export declare type tDirectory_Tree = iDirectory_Tree_props | iDirectory_Tree;
