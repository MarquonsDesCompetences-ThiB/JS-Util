/// <reference types="node" />
import { obj } from "../../../_util";
import { Dirent } from "fs";
export interface Dir_Entry_intf {
  dirs: Directory_Tree[];
  files: Dirent[];
}
export interface Directory_Tree {
  dir: Dirent;
  subtree?: Dir_Entry_intf;
}
export declare abstract class Directory_Tree_props extends obj.Obj {
  #private;
  tree: Directory_Tree;
  constructor(obj?: any);
  get path(): string;
  set path(path: string);
}
