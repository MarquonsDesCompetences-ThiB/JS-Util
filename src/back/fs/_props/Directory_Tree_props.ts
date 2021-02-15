import { obj } from "@src/_util";
import { Dirent } from "fs";

export interface Files_Tree_intf {
  dirs: Dir_Tree_intf[];
  files: Dirent[];
}

export interface Dir_Tree_intf {
  dir: Dirent;
  tree?: Files_Tree_intf;
}

export abstract class Directory_Tree_props extends obj.Obj {
  tree: Dir_Tree_intf;

  constructor(obj?: any) {
    super(obj);
  }
}
