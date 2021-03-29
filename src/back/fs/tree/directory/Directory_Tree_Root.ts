import { Dirent, promises as fs_promises, Stats } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { Json as Json_File } from "@back/files/_files.js";
import { Virtual_Directory_Tree } from "./virtual/Virtual_Directory_Tree.js";
import {
  iDirectory_Tree_Root,
  tDirectory_Tree_Root,
} from "./iDirectory_Tree_Root.js";

export class Directory_Tree_Root
  extends Directory_Tree
  implements iDirectory_Tree_Root {
  #virtual_root: Virtual_Directory_Tree;

  /**
   * Saving file
   */
  protected _store: Json_File;

  /**
   * Regex used to load the directory tree
   */
  scan_regex?: string | string[];

  constructor(
    dirent_or_full_path_or_obj: tDirectory_Tree_Root | Directory_Tree_Root
  ) {
    super();

    //
    // Check preconds
    {
      if (
        !dirent_or_full_path_or_obj.full_path &&
        !dirent_or_full_path_or_obj.dirent
      ) {
        throw new TypeError(
          "At least one property must be set in argument dirent_or_full_path_or_obj : full_path{string} or dirent{Dirent}"
        );
      }
    }

    this.set(dirent_or_full_path_or_obj, undefined, true);
  }

  get root(): iDirectory_Tree_Root {
    return this;
  }

  //
  // === VIRTUAL ROOT DIRECTORY ===
  get virtual_root() {
    return this.#virtual_root;
  }

  set virtual_root(virtual_root: Virtual_Directory_Tree) {
    this.#virtual_root = virtual_root;
  }

  /**
   *
   * @param entries_matching_path
   * @param get_stats If stats must also be set in the returned value
   */
  async scan(
    dir_path?: string,
    entries_matching_path?: string,
    get_stats?: boolean
  ) {
    this.scan_regex = entries_matching_path;

    if (dir_path) {
      this.path = dir_path;
    }

    //
    // Directly call super.scan
    if (!get_stats) {
      return this.super_scan(entries_matching_path, get_stats);
    }

    //
    // Fetch this dir' stats
    // (because super.scan fetch stats of its subdirs and files)
    {
      return fs_promises.stat(this.full_path).then((stats) => {
        this.stats = stats;
        return this.super_scan(entries_matching_path, get_stats);
      });
    }
  }

  /**
   * To call super.scan from scan's promises
   * Needed because of a V8 bug
   * Cf. https://stackoverflow.com/questions/32932699/calling-super-method-inside-promise-super-keyword-unexpected-here
   *
   * @param entries_matching_path
   * @param get_stats
   */
  protected async super_scan(
    entries_matching_path?: string,
    get_stats?: boolean
  ) {
    return super.scan(this.full_path, entries_matching_path, get_stats);
  }

  //
  // === STORE FILE ===
  /**
   * Set file_or_fullPath if different from the already set one
   */
  set store_file(file_or_fullPath: Json_File | string) {
    //
    // file_or_fullPath is a Json file
    if (file_or_fullPath as Json_File) {
      // ignore if already set
      if (this._store === file_or_fullPath) {
        return;
      }

      this._store = <Json_File>file_or_fullPath;
      return;
    }

    //
    // Else file_or_fullPath is a string full_path
    // ignore if already set
    if (this._store.full_path === file_or_fullPath) {
      return;
    }
    this._store = new Json_File({
      full_path: file_or_fullPath,
    });
  }

  get store_file() {
    return this._store;
  }

  /**
   *
   * @param file_or_fullPath If set, set it to this._store with store_file setter
   */
  async load(file_or_fullPath?: Json_File | string) {
    if (file_or_fullPath) {
      this.store_file = file_or_fullPath;
    }

    if (!this._store) {
      return Promise.reject(
        new ReferenceError(
          "No store file in Directory_Tree_Root of " + this.path + this.name
        )
      );
    }

    return this._store.read().then((json: Directory_Tree_Root) => {
      return this.set(json);
    });
  }

  /**
   *
   * @param file_or_fullPath If set, set it to this._store with store_file setter
   */
  async store(file_or_fullPath?: Json_File | string) {
    if (file_or_fullPath) {
      this.store_file = file_or_fullPath;
    }

    if (!this._store) {
      return Promise.reject(
        new ReferenceError(
          "No store file in Directory_Tree_Root of " + this.path + this.name
        )
      );
    }

    this._store.content = this.toJSON();
    return this._store.write();
  }
}
