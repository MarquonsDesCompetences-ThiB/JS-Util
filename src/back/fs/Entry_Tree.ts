import { Dirent, Stats } from "fs";

export interface Entry_Stats_intf extends Dirent {
  stats?: Stats;
}

export class Entry_Tree extends Dirent {
  stats?: Stats;

  /**
   * If the entry is a directory
   */
  dirs?: Entry_Tree[];
  files?: Entry_Stats_intf[];

  protected parent?: Entry_Tree;

  constructor(parent: Entry_Tree, dirent?: Dirent) {
    super();

    this.parent = <Entry_Tree>parent;

    if (dirent) {
      this.dirent = dirent;
    }
  }

  get path() {
    const entry_name = this.isDirectory() ? this.name + "/" : this.name;

    if (this.parent) {
      return this.parent.path + entry_name;
    }

    return entry_name;
  }

  set dirent(dirent: Dirent) {
    for (const key in Dirent) {
      this[key] = dirent[key];
    }
  }
}
