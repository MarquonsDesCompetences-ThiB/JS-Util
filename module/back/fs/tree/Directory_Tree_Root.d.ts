/// <reference types="node" />
import { Dirent, Stats } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { file } from "../../_back.js";
import { Directory_Tree_Slave } from "./slave/Directory_Tree_Slave.js";
export declare class Directory_Tree_Root extends Directory_Tree {
    parent_stats?: Stats;
    /**
     * Path
     */
    protected _path: string;
    /**
     * === Save file
     */
    protected _store: file.Json;
    constructor(dirent_or_path: Dirent | string);
    get path(): string;
    set path(path: string);
    select(entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp): Directory_Tree_Slave;
    /**
     *
     * @param entries_matching_path
     * @param get_stats If stats must also be set in the returned value
     */
    scan(dir_path?: string, entries_matching_path?: string, get_stats?: boolean): Promise<Directory_Tree_Root>;
    /**
     * To call super.scan from scan's promises
     * Needed because of a V8 bug
     * Cf. https://stackoverflow.com/questions/32932699/calling-super-method-inside-promise-super-keyword-unexpected-here
     *
     * @param entries_matching_path
     * @param get_stats
     */
    protected super_scan(entries_matching_path?: string, get_stats?: boolean): Promise<Directory_Tree>;
    /**
     * Set file_or_fullPath if different from the already set one
     */
    set store_file(file_or_fullPath: file.Json | string);
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    load(file_or_fullPath?: file.Json | string): Promise<unknown>;
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    store(file_or_fullPath?: file.Json | string): Promise<unknown>;
}
