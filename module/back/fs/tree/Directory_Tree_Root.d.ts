/// <reference types="node" />
import { Dirent, Stats } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { file } from "../../_back";
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
    constructor(dirent: Dirent);
    get path(): string;
    set path(path: string);
    select(entries_matching_path: string | string[], file_in_each_dir_matching_pattern?: RegExp): Directory_Tree_Slave;
    /**
     *
     * @param entries_matching_path
     * @param get_stats If stats must also be set in the returned value
     */
    scan(dir_path?: string, entries_matching_path?: string, get_stats?: boolean): Promise<Directory_Tree_Root>;
    set store_file(file_or_fullPath: file.Json | string);
    load(): Promise<unknown>;
    store(): Promise<unknown>;
}
