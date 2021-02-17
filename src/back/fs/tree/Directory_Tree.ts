import {
  Directory_Tree_props,
  Entry_Stats_intf,
} from "./_props/Directory_Tree_props";
import { Dirent, promises as fs_promises, Stats } from "fs";
import { Directory_Tree_Slave } from "./slave/Directory_Tree_Slave";
import { equal as stats_equal } from "../stats.js";
import { sanitize_regex_path } from "../_fs";

export class Directory_Tree extends Directory_Tree_props {
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
   * Construct a slave tree
   * of directories and files (from this.dirs and this.files)
   * matching entries_matching_path or file_in_each_dir_matching_pattern
   *
   * @param entries_matching_path Directories/full file path
   *                              of entries to retrieve
   * @param file_in_each_dir_matching_pattern Files to retrieve
   *                                          from every directory
   * @param parent_dir_path Path of the parent directory
   */
  select(
    entries_matching_path: string | string[],
    file_in_each_dir_matching_pattern?: RegExp,
    parent_dir_path?: string
  ): Directory_Tree_Slave {
    const tree = new Directory_Tree_Slave(this.master, undefined);

    //
    // Fetch requested files through file_in_each_dir_matching_pattern
    {
      if (file_in_each_dir_matching_pattern) {
        tree.files = this.get_files_matching_pattern(
          file_in_each_dir_matching_pattern
        );
      }
    }

    //
    // Format requested path
    {
      entries_matching_path = sanitize_regex_path(entries_matching_path);
    }
    /*
      entries_matching_path is now null or its length is>0
      If entries_matching_path[0]='**', its length is >1
    */

    //
    // Fetch requested dirs through entries_matching_path
    {
      const fetch = {
        // if entries_matching_path[0] === "**"
        bAll_wilcard: false,

        /*
        If !bAll_wilcard :  entries_matching_path[0] as regex
        Otherwise : entries_matching_path[1] as regex

        If no entries_matching_path, regex matching everything
      */
        requested_match: undefined,
      };
      const dir_path = parent_dir_path + this.name + "/";

      //
      // Fill fetch to be as requested
      {
        if (entries_matching_path) {
          if (entries_matching_path[0] === "**") {
            fetch.bAll_wilcard = true;
          }

          fetch.requested_match = fetch.bAll_wilcard
            ? new RegExp(entries_matching_path[1])
            : new RegExp(entries_matching_path[1]);
        } else {
          fetch.requested_match = /^.+$/;
        }
      }

      //
      // Fetch directories that match fetch
      {
        // path to give to children
        const sub_matching = entries_matching_path
          ? fetch.bAll_wilcard
            ? //slice handled in loop
              entries_matching_path
            : //slice now
              entries_matching_path.slice(1)
          : undefined;

        this.dirs.forEach((subdir_tree, name) => {
          if (fetch.bAll_wilcard || fetch.requested_match.test(name)) {
            const subtree = subdir_tree.select(
              fetch.bAll_wilcard && fetch.requested_match.test(name)
                ? sub_matching.slice(2)
                : sub_matching,
              file_in_each_dir_matching_pattern,
              dir_path
            );

            if (subtree) {
              tree.subdir = subtree;
            }
          }
        });
      }
    }

    //
    // If no dirs or files added
    if (tree.is_empty) {
      return undefined;
    } else {
      return tree;
    }
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

  /**
   * Fetch a slave tree of only entries having any updated stats in file system
   *
   * @param parent_path Required for calls to non root parent,
   *                    as they have not their full path
   */
  get_fs_updates(
    parent_path?: string
  ): Promise<Directory_Tree_Slave | undefined> {
    return new Promise<Directory_Tree_Slave | undefined>((success) => {
      //
      // Check preconds
      {
        if ((!parent_path || parent_path.length === 0) && !this.path) {
          throw TypeError(
            "This Directory_Tree is not a root thus has no path, and no one is set as argument"
          );
        }
      }

      if (!parent_path) {
        parent_path = this.path;
      }
      const entry_full_path = parent_path + this.name;
      fs_promises.stat(entry_full_path).then((stats) => {
        //
        // If no change in file system
        {
          if (stats_equal(this.stats, stats)) {
            return success(undefined);
          }
        }

        /**
         * Create a Directory_Tree_Slave with the specified stats
         * and look for updates in files and subdirs
         */
        {
          const tree_slave = new Directory_Tree_Slave(this.master, undefined);
          const proms = [];

          //
          // Look for files updates
          {
            this.files.forEach((entry_stats) => {
              const prom = fs_promises.stat(
                entry_full_path + "/" + entry_stats.name
              );
              proms.push(prom);

              prom.then((stats) => {
                //
                // No fs update
                {
                  if (stats_equal(entry_stats.stats, stats)) {
                    return;
                  }
                }

                //
                // else add to tree slave
                tree_slave.file_entry = Object.assign(stats, {
                  name: entry_stats.name,
                });
              });
            });
          }

          //
          // Look for directories updates
          {
            this.dirs.forEach((subdir_tree) => {
              const prom = subdir_tree.get_fs_updates(entry_full_path + "/");
              proms.push(prom);

              prom.then((subdir_tree_slave) => {
                //
                // No fs update
                {
                  if (!subdir_tree_slave) {
                    return;
                  }
                }

                //
                // else add to tree slave
                {
                  subdir_tree_slave.parent = tree_slave;
                  tree_slave.slave_subdir = subdir_tree_slave;
                }
              });
            });
          }

          //
          // Wait for promises
          {
            Promise.all(proms).then(() => {
              success(tree_slave);
            });
          }
        }
      });
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

  load(json_dir_tree) {
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

//
// === PATH REQUEST PARSING ===
interface Path_Request_intf {
  bAll_wildcard: boolean;
  entry_to_find_reg: RegExp | undefined;
  bEntry_to_find_is_dir: boolean;
  bIterate_subdirs: boolean;
}

function get_path_request(path?: string | string[]): Path_Request_intf {
  const ret: Path_Request_intf = {
    /**
     * True if path starts with an all wildcard (**) and has others dirs/files following it
     */
    bAll_wildcard: false,

    entry_to_find_reg: undefined,
    bEntry_to_find_is_dir: undefined,
    bIterate_subdirs: undefined,
  };

  if (path) {
    if (path[0] === "**") {
      ret.bAll_wildcard = true;
      ret.entry_to_find_reg = new RegExp("^" + path[1] + "$");
      ret.bEntry_to_find_is_dir = path.length > 2;
    } else {
      ret.entry_to_find_reg = new RegExp("^" + path[0] + "$");
      ret.bEntry_to_find_is_dir = path.length > 1;
    }

    ret.bIterate_subdirs =
      ret.bEntry_to_find_is_dir &&
      // path[1] could be empty if slash only used
      // to specify path[0] is a directory (bEntry_is_dir)
      path[1] !== "";
  } else {
    ret.bIterate_subdirs = true;
  }

  return ret;
}
