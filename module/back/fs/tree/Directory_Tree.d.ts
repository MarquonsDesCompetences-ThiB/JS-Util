import { Directory_Tree_props, Entry_Stats_intf } from "./_props/Directory_Tree_props.js";
export declare class Directory_Tree extends Directory_Tree_props {
    get master(): Directory_Tree;
    set subdirs(dirs_trees: Directory_Tree[]);
    /**
     * Add the specified directory tree to this.dirs
     * If one with this name already exists, update its
     * values with those in dir_tree
     * => enable slaves to keep their value up to date
     */
    set subdir(dir_tree: Directory_Tree);
    get_files_matching_pattern(pattern: RegExp): Map<string, Entry_Stats_intf>;
    /**
     * Scan this directory in file system to fill this.dirs and this.files
     * @param dir_path
     * @param entries_matching_path
     * @param get_stats
     */
    scan(dir_path: string, entries_matching_path?: string | string[], get_stats?: boolean): Promise<Directory_Tree>;
    /**
     * Fetch a slave tree of only entries having any updated stats in file system
     *
     * @param parent_path Required for calls to non root parent,
     *                    as they have not their full path
     */
    get_fs_updates(parent_path?: string): Promise<Directory_Tree_Slave | undefined>;
    getJson(): {
        name: string;
        stats: string;
        dirs: any;
        files: any;
    };
    load(json_dir_tree: any): void;
}
declare class Directory_Tree_Slave extends Directory_Tree {
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
export {};
