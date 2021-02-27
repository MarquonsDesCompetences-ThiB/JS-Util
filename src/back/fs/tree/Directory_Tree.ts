import {
  Directory_Tree_props,
  Entry_Stats_intf,
} from "./_props/Directory_Tree_props.js";
import { Dirent, promises as fs_promises, Stats } from "fs";
import { sanitize_regex_path } from "../fs.js";
import { get_path_request } from "../path/path_request.js";

export class Directory_Tree extends Directory_Tree_props {
  //
  // === _PROPS OVERRIDES ===
  dirs?: Map<string, Directory_Tree>;

  //
  // === MASTER ===
  get master(): Directory_Tree {
    return this;
  }

  //
  // === DIRECTORY TREES SETTERS
  set subdirs(dirs_trees: Directory_Tree[]) {
    this.ensure_dirs_map();
    dirs_trees.forEach((tree) => {
      tree.parent = this;
      this.dirs.set(tree.name, tree);
    });
  }

  /**
   * Add the specified directory tree to this.dirs
   * If one with this name already exists, update its
   * values with those in dir_tree
   * => enable slaves to keep their value up to date
   */
  set subdir(dir_tree: Directory_Tree) {
    this.ensure_dirs_map();

    dir_tree.parent = this;
    const dir_set = this.dirs.get(dir_tree.name);
    //
    // Must add the new one
    {
      if (!dir_set) {
        this.dirs.set(dir_tree.name, dir_tree);
        return;
      }
    }
    //
    // Else update the existing one's values
    for (const key in dir_tree) {
      dir_set[key] = dir_tree[key];
    }
  }

  get_files_matching_pattern(pattern: RegExp) {
    if (!this.files) {
      return undefined;
    }

    const map = new Map<string, Entry_Stats_intf>();
    this.files.forEach((entry, name) => {
      if (pattern.test(name)) {
        map.set(name, entry);
      }
    });

    if (map.size === 0) {
      return undefined;
    }
    return map;
  }

  /**
   * Scan this directory in file system to fill this.dirs and this.files
   * @param dir_path
   * @param entries_matching_path
   * @param get_stats
   */
  scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ): Promise<Directory_Tree> {
    return new Promise((success) => {
      //
      // Format path
      {
        if (entries_matching_path) {
          entries_matching_path = sanitize_regex_path(entries_matching_path);
        }
      }
      /**
        Now path.length>0
            || path[0]="**" and path.length>1
      */
      const {
        bAll_wildcard,
        entry_to_find_reg,
        bEntry_to_find_is_dir,
        bIterate_subdirs,
      } = get_path_request(entries_matching_path);

      //
      // Not to iterate all entries twice
      // If bAll_wildcard, we have to first check the next entry
      // (entry_to_find) is not in this to fetch all directories/files
      let entries: Dirent[] | undefined = bAll_wildcard ? [] : undefined;
      const matching_entries = entries ? [] : undefined;

      //
      // path argument for recursive calls to scan
      // to be used only if !bAll_wildcard
      let recursive_path = !entries_matching_path
        ? undefined
        : entries_matching_path.slice(1);

      {
        const proms: Promise<Directory_Tree | Stats>[] = [];

        fs_promises.opendir(dir_path).then(async (directory) => {
          //
          // Iterate files
          {
            for await (const entry of directory) {
              //
              // If all entries are requested
              {
                // <=> !path
                if (!entry_to_find_reg) {
                  if (entry.isDirectory()) {
                    const subtree = new Directory_Tree(this, entry);
                    this.subdir = subtree;
                    //
                    // scan the found directory
                    if (bIterate_subdirs) {
                      proms.push(subtree.scan(dir_path, recursive_path));
                    }
                  } else {
                    this.file_entry = entry;
                  }

                  //
                  // Fetch entry' stats if requested
                  {
                    if (get_stats) {
                      proms.push(load_stats(entry));
                    }
                  }

                  continue;
                }
              }

              //
              // === path case ===
              // Otherwise a specific entry...
              {
                //
                // ... must be found
                if (!entries) {
                  if (entry_to_find_reg.test(entry.name)) {
                    if (entry.isDirectory()) {
                      if (bEntry_to_find_is_dir) {
                        const subtree = new Directory_Tree(this, entry);
                        this.subdir = subtree;
                        //
                        // scan the found directory
                        if (bIterate_subdirs) {
                          proms.push(subtree.scan(dir_path, recursive_path));
                        }
                      }
                    }
                    //
                    // Else entry is a file
                    else {
                      if (!bEntry_to_find_is_dir) {
                        this.file_entry = entry;
                      }
                    }

                    //
                    // Fetch entry' stats if requested
                    {
                      if (get_stats) {
                        proms.push(load_stats(entry));
                      }
                    }

                    // do not break, the regex could math other entries
                  }
                }
                //
                // ...or if entry(ies) matching the regex is/are found,
                //      should be the only ones used
                //     If no matching entry found, all entries are used
                else {
                  if (entry_to_find_reg.test(entry.name)) {
                    matching_entries.push(entry);
                  } else {
                    entries.push(entry);
                  }
                }
              }
            }
          }

          //
          // === bAll_wildcard case ===
          {
            if (matching_entries) {
              //
              //Use matching entries if any
              if (matching_entries.length > 0) {
                entries = matching_entries;

                //
                // Update recursive path accordingly
                // => remove '**' and entry regex
                entries_matching_path = !entries_matching_path
                  ? undefined
                  : entries_matching_path.slice(2);
              }

              //
              // Iterate entries
              {
                entries.forEach((entry) => {
                  if (entry.isDirectory()) {
                    if (bEntry_to_find_is_dir) {
                      const subtree = new Directory_Tree(this, entry);
                      this.subdir = subtree;
                      if (bIterate_subdirs) {
                        //
                        // scan the found directory
                        proms.push(subtree.scan(dir_path, recursive_path));
                      }

                      // do not break, the regex could math other entries
                    }
                  }
                  //
                  // Else entry is a file
                  else {
                    if (!bEntry_to_find_is_dir) {
                      this.file_entry = entry;

                      // do not break, the regex could math other entries
                    }
                  }

                  //
                  // Fetch entry' stats if requested
                  {
                    if (get_stats) {
                      proms.push(load_stats(entry));
                    }
                  }
                });
              }
            }
          }

          //
          // To load stats when requested
          function load_stats(entry) {
            const prom = fs_promises.stat(dir_path + entry.name);

            prom.then((stats) => {
              if (entry.isDirectory()) {
                this.dirs[entry.name].stats = stats;
              } else {
                this.files[entry.name].stats = stats;
              }
            });

            return prom;
          }

          //
          // Wait for promises
          {
            if (proms.length === 0) {
              return success(this);
            }

            Promise.all(proms).then(() => {
              directory.close();
              success(this);
            });
          }
        });
      }
    });
  }

  //
  // === LOAD/GET AS JSON ===
  getJson() {
    const ret = {
      name: this.name,
      stats: JSON.stringify(this.stats),

      dirs: undefined,
      files: undefined,
    };

    if (this.dirs) {
      ret.dirs = [];
      this.dirs.forEach((dir_tree) => {
        ret.dirs.push(dir_tree.getJson());
      });
    }

    if (this.files) {
      ret.files = [];
      this.files.forEach((entry_stats) => {
        ret.files.push(JSON.stringify(entry_stats));
      });
    }

    return ret;
  }

  load(json_dir_tree: any) {
    if (json_dir_tree.stats) {
      this.stats = json_dir_tree.stats;
    }

    if (json_dir_tree.dirs) {
      this.ensure_dirs_map;

      json_dir_tree.dirs.forEach((sub_json_dir_tree: Directory_Tree) => {
        const subtree = new Directory_Tree(this, json_dir_tree);
        subtree.load(sub_json_dir_tree);
        this.dirs.set(subtree.name, subtree);
      });
    }

    if (json_dir_tree.files) {
      this.ensure_files_map;

      json_dir_tree.files.forEach((sub_json_entry_stats: Entry_Stats_intf) => {
        this.files.set(sub_json_entry_stats.name, sub_json_entry_stats);
      });
    }
  }
}
