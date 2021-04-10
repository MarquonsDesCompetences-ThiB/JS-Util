import { Directory_Tree_Root } from "../../Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "../../slave/Directory_Tree_Slave.js";
import { iDirectory_Tree_Root_Slave } from "../../slave/iDirectory_Tree_Slave.js";
import { Entry_Stats_intf, iDirectory_Tree } from "../../common/iDirectory_Tree.js";
import { Directory_Tree } from "../../common/Directory_Tree.js";
import { iVirtual_Directory_Tree_props } from "../iVirtual_Directory_Tree.js";
import { iDirectory_Tree_Root, iDirectory_Tree_Root_props } from "../../iDirectory_Tree_Root.js";
export declare class Virtual_Directory_Tree_props extends Directory_Tree implements iVirtual_Directory_Tree_props {
    readonly is_root = true;
    name: string;
    get full_path(): string;
    get path(): string;
    get root(): any;
    get virtual_root(): this;
    get relative_path(): string;
    dirs: Map<string, iDirectory_Tree_Root>;
    /**
     * When a requested path does not start
     * with a dir name from this.dirs,
     * look in directory names of every specified dirs
     *
     */
    search_order: string[];
    set add_dir(dir_tree: iDirectory_Tree_Root);
    set dirs_json(dir_trees: (iDirectory_Tree_Root | iDirectory_Tree_Root_props)[]);
    get_dir(dir_name: string): iDirectory_Tree_Root_Slave;
    get_dirs_names(): string[];
    get_path(path: string | string[]): iDirectory_Tree | Entry_Stats_intf;
    /**
     * Cf. util/select<Tmaster_tree extends Directory_Tree>
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     * @returns
     */
    select(from_dir: string, entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp): Directory_Tree_Slave<iDirectory_Tree_Root>;
    /**
     * Select (this.select)
     * then add (this.add_dir)
     * the result to this
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     */
    select_add(from_dir: string, entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp): void;
    /**
     * this.select but running on all this.directories
     *
     * Cf. util/select<Tmaster_tree extends Directory_Tree>
     *
     * @param from_dir
     * @param entries_matching_path
     * @param file_in_each_dir_matching_pattern
     * @returns
     */
    select_from_all(entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp): Directory_Tree_Slave<Directory_Tree_Root>[];
    /**
     * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
     * @param from_dir
     * @param path
     * @returns
     */
    get_fs_updates(from_dir: string, path?: string): Promise<Directory_Tree_Slave<iDirectory_Tree_Root>>;
    /**
     * this.get_fs_updates but running on all this.directories
     *
     * Cf. util/get_fs_updates<Tmaster_tree extends Directory_Tree>
     * @param from_dir
     * @param path
     * @returns
     */
    get_fs_updates_from_all(path?: string): Promise<iDirectory_Tree_Root_Slave[]>;
}
