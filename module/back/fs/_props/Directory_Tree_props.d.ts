/// <reference types="node" />
import { obj } from "../../../_util";
import { Dirent } from "fs";
export interface Dir_Entry_intf {
  dirs: Entry_Tree[];
  files: Dirent[];
}
export interface Entry_Tree {
  dir: Dirent;
  subtree?: Dir_Entry_intf;
}
export declare abstract class Directory_Tree_props extends obj.Obj {
  #private;
  tree: Entry_Tree;
  constructor(obj?: any);
  get path(): string;
  set path(path: string);
}
