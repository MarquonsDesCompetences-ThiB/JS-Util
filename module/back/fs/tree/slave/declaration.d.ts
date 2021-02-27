import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf } from "../_props/Directory_Tree_props.js";
export declare class Directory_Tree_Slave extends Directory_Tree {
    protected _master: Directory_Tree;
    protected _parent: Directory_Tree_Slave;
    dirs?: Map<string, Directory_Tree_Slave>;
    constructor(master: Directory_Tree, slave_parent: Directory_Tree_Slave);
    get master(): Directory_Tree;
    get path(): string;
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, Directory_Tree_Slave | Entry_Stats_intf>;
    ensure_dirs_map(): void;
    get_slave_subdir(dir_name: string): Directory_Tree_Slave;
    set slave_subdirs(dirs_trees: Directory_Tree_Slave[]);
    set slave_subdir(dir_tree: Directory_Tree_Slave);
    set_stats_to_master(recursive_to_children?: boolean): void;
    delete(dir_name: string): void;
}
/**
 * Not to have an empty generated JS resulting
 * in an error when importing this module
 */
export declare const foo: any;
