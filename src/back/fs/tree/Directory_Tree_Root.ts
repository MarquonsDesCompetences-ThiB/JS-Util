import { Dirent, promises as fs_promises, Stats } from "fs";
import { Directory_Tree } from "./Directory_Tree.js";
import { sep as os_path_separator } from "path";
import { file } from "@src/back/_back";
import { Directory_Tree_Slave } from "./slave/Directory_Tree_Slave.js";

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

  constructor(dirent: Dirent) {
    super(null, dirent);
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

  select(
    entries_matching_path: string | string[],
    file_in_each_dir_matching_pattern?: RegExp
  ): Directory_Tree_Slave {
    return super.select(
      entries_matching_path,
      file_in_each_dir_matching_pattern,
      this.path
    );
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
        return super
          .scan(this.path, entries_matching_path, get_stats)
          .then(() => {
            success(this);
          });
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
        super.scan(this.path, entries_matching_path, get_stats);
      });
    });
  }

  //
  // === STORE FILE ===
  set store_file(file_or_fullPath: file.Json | string) {
    if (file_or_fullPath as file.Json) {
      this._store = <file.Json>file_or_fullPath;
      return;
    }

    this._store = new file.Json({
      full_path: file_or_fullPath,
    });
  }

  load() {
    return new Promise((success) => {
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

  store() {
    return new Promise((success) => {
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
