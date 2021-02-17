import { Directory_Tree_props, Entry_Stats_intf } from "./_props/Directory_Tree_props";
import { Directory_Tree_Slave } from "./slave/Directory_Tree_Slave";
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
     * Construct a slave tree
     * of directories and files (from this.dirs and this.files)
     * matching entries_matching_path or file_in_each_dir_matching_pattern
     *
     * @param entries_matching_path Directories/full file path
     *                              of entries to retrieve
     * @param file_in_each_dir_matching_pattern Files to retrieve
     *                                          from every directory
     * @param parent_dir_path Path of the parent directory
     */
    select(entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp, parent_dir_path?: string): Directory_Tree_Slave;
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
/**
 * Postcond :
 *  typeof path = string
 *  path.length>0
 *  || path[0]="**" and path.length>1
 *
 * @param path
 */
export declare function sanitize_regex_path(path: string | string[]): string[] | undefined;
