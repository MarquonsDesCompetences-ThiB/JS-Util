import { obj } from "@src/_util";
import { Dirent } from "fs";

export interface Files_Tree_intf {
  dirs: Dir_Tree_intf[];
  files: Dirent[];
}

export interface Dir_Tree_intf {
  dir: Dirent;
  subtree?: Files_Tree_intf;
}

export abstract class Directory_Tree_props extends obj.Obj {
  tree: Dir_Tree_intf;

  /**
   * Path
   */
  #_p: string;

  constructor(obj?: any) {
    super(obj);
  }

  //
  // === PATH ===
  get path() {
    return this.#_p;
  }

  set path(path: string) {
    //
    // Remove eventual starting/ending spaces
    {
      path = path.replace(/^\s+/, "");
      path = path.replace(/\s+$/, "");
    }

    //
    // Add ending slash if missing
    {
      if (!/\\|\/$/.test(path)) {
        path += "/";
      }
    }

    this.#_p = path;
  }
}
