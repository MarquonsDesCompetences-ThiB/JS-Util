import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf } from "../_props/Directory_Tree_props.js";
export interface iDirectory_Tree_Slave extends Directory_Tree {
    dirs?: Map<string, iDirectory_Tree_Slave>;
    master: Directory_Tree;
    path: string;
    slave_subdirs: iDirectory_Tree_Slave[];
    slave_subdir: iDirectory_Tree_Slave;
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, iDirectory_Tree_Slave | Entry_Stats_intf>;
    ensure_dirs_map(): void;
    get_slave_subdir(dir_name: string): iDirectory_Tree_Slave;
    set_stats_to_master(recursive_to_children?: boolean): void;
    delete(dir_name: string): void;
}
/**
 * Not to have an empty generated JS resulting
 * in an error when importing this module
 */
export declare const foo: any;
