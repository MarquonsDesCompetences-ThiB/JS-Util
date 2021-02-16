import { obj } from "@src/_util";
import { Stats } from "fs";
import { Entry_Tree } from "../Entry_Tree";
import { sep as os_path_separator } from "path";

export abstract class Directory_Tree_props extends Entry_Tree {
  parent_stats?: Stats;

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
        path += os_path_separator;
      }
    }

    this.#_p = path;
  }
}
