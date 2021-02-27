import { Directory_Tree_props, Entry_Stats_intf } from "./_props/Directory_Tree_props.js";
export declare class Directory_Tree extends Directory_Tree_props {
    dirs?: Map<string, Directory_Tree>;
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
    getJson(): {
        name: string;
        stats: string;
        dirs: any;
        files: any;
    };
    load(json_dir_tree: any): void;
}
