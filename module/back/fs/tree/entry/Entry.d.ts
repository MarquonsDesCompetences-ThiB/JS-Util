/// <reference types="node" />
import { Dirent } from "fs";
import { Obj } from "../../../../both/types/obj/_obj.js";
import { iDirent_json } from "./iDirent.js";
export declare class Entry extends Obj implements iDirent_json {
    #private;
    static full_names(files: Entry[]): string[];
    static full_pathes(files: Entry[]): string[];
    /**
     * Dirent version to be loaded from json
     * Used when this._dirent is undefined
     */
    isFile: boolean;
    isDirectory: boolean;
    isBlockDevice: boolean;
    isCharacterDevice: boolean;
    isSymbolicLink: boolean;
    isFIFO: boolean;
    isSocket: boolean;
    name: string;
    ext: string;
    /**
     * Dirent version to be read from fs
     *
    @obj_specs.decs.props.jsonified
    protected _dirent: Dirent;*/
    constructor(path_or_Dirent_or_obj?: string | Dirent | any, obj?: any);
    set dirent(dirent: Dirent | iDirent_json);
    get path(): string;
    set path(path: string);
    get full_path(): string;
    /**
     * path and name parts are extracted
     * from the specified full path
     *
     * If full_path contains only 1 item
     * (eg there is no '\\' or '/' delimiting path's entries),
     * This is set as the name and the path is fetched
     * from module.get_root_dir_path
     *
     * Path is read to read the file system
     * and fetch the associated Dirent
     */
    set full_path(full_path: string);
    get full_name(): string;
    set full_name(full_name: string);
}
