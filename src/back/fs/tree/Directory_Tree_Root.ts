import { Dirent, promises as fs_promises, Stats } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { sep as os_path_separator } from "path";
import { file } from "@src/back/_back.js";

export class Directory_Tree_Root extends Directory_Tree {
  parent_stats?: Stats;
  /**
   * Path
   */
  protected _path: string;

  /**
   * === Save file
   */
  protected _store: file.Json;

  constructor(dirent_or_path: Dirent | string) {
    super(
      null,
      (dirent_or_path as Dirent) ? <Dirent>dirent_or_path : undefined
    );

    if (dirent_or_path as string) {
      this.path = <string>dirent_or_path;
    }
  }

  //
  // === PATH ===
  get path() {
    const entry_name = this.isDirectory() ? this.name + "/" : this.name;
    return this._path + entry_name;
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

    this._path = path;
  }

  /**
   *
   * @param entries_matching_path
   * @param get_stats If stats must also be set in the returned value
   */
  scan(dir_path?: string, entries_matching_path?: string, get_stats?: boolean) {
    return new Promise<Directory_Tree_Root>(async (success) => {
      if (dir_path) {
        this.path = dir_path;
      }

      //
      // Directly call super.scan
      if (!get_stats) {
        this.super_scan(entries_matching_path, get_stats).then(() => {
          success(this);
        });
        return;
      }
      //
      // Else first get parent' stats as requested
      const proms = [];
      {
        //
        //Fetch parent's directory's stats
        {
          let last_separator_idx;
          let end_dir_name_idx = this.path.length;
          {
            // used separator is a slash or backslash ?
            const separator_char = /\//.test(this.path) ? "/" : "\\";
            const dir_path_last_idx = this.path.length - 1;
            //
            // Fetch from path the slash or backslash preceding the dir name
            {
              last_separator_idx = this.path.lastIndexOf(separator_char);
              //
              // If slash|backslash is the last char, get the previous one
              if (last_separator_idx === dir_path_last_idx) {
                end_dir_name_idx = last_separator_idx;
                last_separator_idx = this.path.lastIndexOf(
                  separator_char,
                  dir_path_last_idx - 1
                );
              }
            }
          }

          const parent_dir_path = this.path.slice(0, last_separator_idx);
          const prom = fs_promises.stat(parent_dir_path);
          proms.push(prom);
          prom.then((stats) => {
            this.parent_stats = stats;
          });
        }

        //
        // Fetch this dir stats
        // (because super.scan fetch stats of its subdirs and files)
        {
          const prom = fs_promises.stat(dir_path);
          proms.push(prom);
          prom.then((stats) => {
            this.stats = stats;
          });
        }
      }
      Promise.all(proms).then(() => {
        this.super_scan(entries_matching_path, get_stats).then(() => {
          success(this);
        });
      });
    });
  }

  /**
   * To call super.scan from scan's promises
   * Needed because of a V8 bug
   * Cf. https://stackoverflow.com/questions/32932699/calling-super-method-inside-promise-super-keyword-unexpected-here
   *
   * @param entries_matching_path
   * @param get_stats
   */
  protected super_scan(entries_matching_path?: string, get_stats?: boolean) {
    return super.scan(this.path, entries_matching_path, get_stats);
  }

  //
  // === STORE FILE ===
  /**
   * Set file_or_fullPath if different from the already set one
   */
  set store_file(file_or_fullPath: file.Json | string) {
    //
    // file_or_fullPath is a Json file
    if (file_or_fullPath as file.Json) {
      // ignore if already set
      if (this._store === file_or_fullPath) {
        return;
      }

      this._store = <file.Json>file_or_fullPath;
      return;
    }

    //
    // Else file_or_fullPath is a string full_path
    // ignore if already set
    if (this._store.full_path === file_or_fullPath) {
      return;
    }
    this._store = new file.Json({
      full_path: file_or_fullPath,
    });
  }

  /**
   *
   * @param file_or_fullPath If set, set it to this._store with store_file setter
   */
  load(file_or_fullPath?: file.Json | string) {
    return new Promise((success) => {
      if (file_or_fullPath) {
        this.store_file = file_or_fullPath;
      }

      if (!this._store) {
        throw ReferenceError(
          "No store file in Directory_Tree_Root of " + this.path + this.name
        );
      }

      this._store.read().then((json: Directory_Tree_Root) => {
        super.load(json);
        success(this);
      });
    });
  }

  /**
   *
   * @param file_or_fullPath If set, set it to this._store with store_file setter
   */
  store(file_or_fullPath?: file.Json | string) {
    return new Promise((success) => {
      if (file_or_fullPath) {
        this.store_file = file_or_fullPath;
      }

      if (!this._store) {
        throw ReferenceError(
          "No store file in Directory_Tree_Root of " + this.path + this.name
        );
      }

      this._store.content = this.getJson();
      this._store.write().then(() => {
        success(this);
      });
    });
  }
}
