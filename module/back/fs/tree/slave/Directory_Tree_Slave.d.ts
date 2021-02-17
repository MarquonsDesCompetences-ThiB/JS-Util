import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf } from "../_props/Directory_Tree_props.js";
export declare class Directory_Tree_Slave extends Directory_Tree {
    protected _master: Directory_Tree;
    protected _parent: Directory_Tree_Slave;
    dirs?: Map<string, Directory_Tree_Slave>;
    constructor(master: Directory_Tree, slave_parent: Directory_Tree_Slave);
    get master(): Directory_Tree;
    get path(): any;
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, Directory_Tree_Slave | Entry_Stats_intf>;
    /**
     * Ensure the map this.dirs exist ; if not, create it
     */
    ensure_dirs_map(): void;
    get_slave_subdir(dir_name: string): Directory_Tree_Slave;
    set slave_subdirs(dirs_trees: Directory_Tree_Slave[]);
    /**
     * Add the specified directory tree to this.dirs
     * If one with this name already exists, update its
     * values with those in dir_tree
     * => enable slaves to keep their value up to date
     */
    set slave_subdir(dir_tree: Directory_Tree_Slave);
    /**
     * Set this' stats to its master
     * Recursive by default : also this' files and dirs
     *                        set their stats to their master
     *
     * After setting, removes itself calling its parent :
     *  - if this is a directory, only if is now an empty Directory_Tree
     *  - always otherwise
     *
     * @param recursive_to_children To also set sub directories trees' stats
     *                              to their master
     */
    set_stats_to_master(recursive_to_children?: boolean): void;
    /**
     * Delete the specified tree directory from this.dirs
     * If this is now empty, call parent.delete(this.name)
     */
    delete(dir_name: string): void;
}
