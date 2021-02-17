/// <reference types="node" />
import { Dirent, Stats } from "fs";
import { Directory_Tree } from "../Directory_Tree.js";
export interface Entry_Stats_intf extends Dirent {
    stats?: Stats;
}
export declare abstract class Directory_Tree_props extends Dirent implements Entry_Stats_intf {
    stats?: Stats;
    dirs?: Map<string, Directory_Tree>;
    files?: Map<string, Entry_Stats_intf>;
    protected parent: Directory_Tree;
    constructor(parent: Directory_Tree, dirent?: Dirent);
    set dirent(dirent: Dirent);
    get path(): string;
    get is_empty(): boolean;
    /**
     * Get a map of subdirs' trees and files,
     * as map whose keys are the full_path
     */
    get_map(full_parent_path?: string, recursive?: boolean): Map<string, Directory_Tree | Entry_Stats_intf>;
    /**
     * Ensure the map this.dirs exist ; if not, create it
     */
    ensure_dirs_map(): void;
    get_subdir(dir_name: string): Directory_Tree;
    /**
     * Ensure the map this.files exist ; if not, create it
     */
    ensure_files_map(): void;
    get_file_entry(file_name: string): Entry_Stats_intf;
    /**
     * Add the specified file entry to this.files
     * If one with this name already exists, update its
     * values with those in entry_stats
     */
    set file_entry(entry_stats: Entry_Stats_intf);
}
