/// <reference types="node" />
import { obj } from "../../../_util";
import { Dirent } from "fs";
export interface Files_Tree_intf {
    dirs: Dir_Tree_intf[];
    files: Dirent[];
}
export interface Dir_Tree_intf {
    dir: Dirent;
    subtree?: Files_Tree_intf;
}
export declare abstract class Directory_Tree_props extends obj.Obj {
    #private;
    tree: Dir_Tree_intf;
    constructor(obj?: any);
    get path(): string;
    set path(path: string);
}
