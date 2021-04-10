import { iDirectory_Tree_Slave, tDirectory_Tree_Slave } from "./iDirectory_Tree_Slave.js";
import { Directory_Tree_Slave_props } from "./_props/Directory_Tree_Slave_props.js";
import { iDirectory_Tree_Node, iDirectory_Tree_Root_or_Node } from "../iDirectory_Tree_Node.js";
export declare class Directory_Tree_Slave<Tmaster_tree extends iDirectory_Tree_Root_or_Node> extends Directory_Tree_Slave_props<Tmaster_tree> implements iDirectory_Tree_Slave<Tmaster_tree> {
    constructor(obj: tDirectory_Tree_Slave<Tmaster_tree> | Directory_Tree_Slave<Tmaster_tree>);
    get path(): string;
    get full_path(): string;
    get relative_path(): string;
    get dirs_json(): any;
    set dirs_json(json: any);
    get root(): iDirectory_Tree_Slave<iDirectory_Tree_Root_or_Node>;
    get virtual_root(): import("../_directory.js").Virtual;
    get_subdir(dir_name: string): iDirectory_Tree_Slave<iDirectory_Tree_Node>;
    /**
     * Clone master and set the result to slave
     * Remove slave.dirs
     */
    init_slave_from_master(): void;
    /**
     * Add the specified directory tree to this.dirs,
     * and its slave to this.slave.dirs
     *
     * If one with this name already exists, update its
     * values with those in dir_tree
     * => enable slaves to keep their value up to date
     */
    set_subdir(dir_tree: iDirectory_Tree_Slave<iDirectory_Tree_Node>): iDirectory_Tree_Slave<iDirectory_Tree_Node>;
    /**
     * Process both this.set_new_master and this.set_stats_to_master
     */
    apply_to_master(recursive_to_children?: boolean): void;
    /**
     *  Set this._master_new to this._master
     *
     * @param recursive_to_children To also set sub directories trees' stats
     *                              to their master
     */
    set_new_master(recursive_to_children?: boolean): void;
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
}
