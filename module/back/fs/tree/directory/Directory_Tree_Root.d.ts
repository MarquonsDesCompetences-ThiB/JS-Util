import { Directory_Tree } from "./common/Directory_Tree.js";
import { Json as Json_File } from "../../../files/_files.js";
import { Virtual_Directory_Tree } from "./virtual/Virtual_Directory_Tree.js";
import { iDirectory_Tree_Root, tDirectory_Tree_Root } from "./iDirectory_Tree_Root.js";
import { iDirectory_Tree_Node } from "./iDirectory_Tree_Node.js";
export declare class Directory_Tree_Root extends Directory_Tree implements iDirectory_Tree_Root {
    #private;
    readonly is_root = true;
    dirs: Map<string, iDirectory_Tree_Node>;
    /**
     * Saving file
     */
    protected _store: Json_File;
    /**
     * Regex used to load the directory tree
     */
    scan_regex?: string | string[];
    constructor(dirent_or_full_path_or_obj: tDirectory_Tree_Root | Directory_Tree_Root);
    get root(): iDirectory_Tree_Root;
    get virtual_root(): Virtual_Directory_Tree;
    set virtual_root(virtual_root: Virtual_Directory_Tree);
    /**
     *
     * @param entries_matching_path
     * @param get_stats If stats must also be set in the returned value
     */
    scan(dir_path?: string, entries_matching_path?: string, get_stats?: boolean): Promise<Directory_Tree>;
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
    set store_file(file_or_fullPath: Json_File | string);
    get store_file(): Json_File | string;
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    load(file_or_fullPath?: Json_File | string): Promise<{
        nb_set: number;
        nb_already: number;
        nb_nset: number;
        nb_nset_ro: number;
    }>;
    /**
     *
     * @param file_or_fullPath If set, set it to this._store with store_file setter
     */
    store(file_or_fullPath?: Json_File | string): Promise<any>;
}
