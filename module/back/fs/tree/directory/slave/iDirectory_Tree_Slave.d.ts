import { Json_File } from "../../../../files/Json_File.js";
import { Entry_Stats_intf, iDirectory_Tree_meths, iDirectory_Tree_props } from "../common/iDirectory_Tree.js";
import { iDirectory_Tree_Node, iDirectory_Tree_Root_or_Node } from "../iDirectory_Tree_Node.js";
import { iDirectory_Tree_Root, iDirectory_Tree_Root_props } from "../iDirectory_Tree_Root.js";
export interface iDirectory_Tree_Slave_props<Tmaster_tree extends iDirectory_Tree_Root_or_Node> extends Omit<iDirectory_Tree_props, "parent" | "dirs" | "root"> {
    root?: iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node>;
    parent?: iDirectory_Tree_Slave<Tmaster_tree | iDirectory_Tree_Root>;
    master?: Tmaster_tree;
    slave?: Tmaster_tree;
    master_or_slave?: Tmaster_tree;
    scan_regex?: string | string[];
    dirs?: Map<string, iDirectory_Tree_Slave<iDirectory_Tree_Node>>;
    slave_subdirs?: iDirectory_Tree_Slave<iDirectory_Tree_Node>[];
    slave_subdir?: iDirectory_Tree_Slave<iDirectory_Tree_Node>;
}
export interface iDirectory_Tree_Slave_meths<Tmaster_tree extends iDirectory_Tree_Root_or_Node> extends Omit<iDirectory_Tree_meths, "root" | "get_map" | "get_subdir" | "set_subdir"> {
    readonly is_root: boolean;
    readonly path: string;
    readonly full_path: string;
    readonly relative_path: string;
    /**
     * Clone master and set the result to slave
     * Remove slave.dirs
     */
    init_slave_from_master(): any;
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, Tmaster_tree | Entry_Stats_intf>;
    ensure_dirs_map(): void;
    get_subdir(dir_name: string): iDirectory_Tree_Slave<iDirectory_Tree_Node>;
    set_subdir(dir_tree: iDirectory_Tree_Slave<iDirectory_Tree_Node>): iDirectory_Tree_Slave<iDirectory_Tree_Node>;
    apply_to_master(recursive_to_children?: boolean): void;
    set_new_master(recursive_to_children?: boolean): void;
    set_stats_to_master(recursive_to_children?: boolean): void;
    delete(dir_name: string): void;
    load(file_or_fullPath?: Json_File | string): Promise<any>;
    store(file_or_fullPath?: Json_File | string): Promise<any>;
}
export declare type iDirectory_Tree_Slave<Tmaster_tree extends iDirectory_Tree_Root_or_Node> = iDirectory_Tree_Slave_props<Tmaster_tree> & iDirectory_Tree_Slave_meths<Tmaster_tree>;
export declare type tDirectory_Tree_Slave<Tmaster_tree extends iDirectory_Tree_Root_or_Node> = iDirectory_Tree_Slave_props<Tmaster_tree> | iDirectory_Tree_Slave<Tmaster_tree>;
export declare type tDirectory_Tree_Root_Slave = iDirectory_Tree_Root | iDirectory_Tree_Root_props | iDirectory_Tree_Slave<iDirectory_Tree_Root> | iDirectory_Tree_Slave_props<iDirectory_Tree_Root>;
export declare type iDirectory_Tree_Root_Slave = iDirectory_Tree_Root | iDirectory_Tree_Slave<iDirectory_Tree_Root>;
