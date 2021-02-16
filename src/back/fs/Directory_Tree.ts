import { Directory_Tree_props } from "./_props/Directory_Tree_props";
import { Dirent, promises as fs_promises, Stats } from "fs";
import { Entry_Tree } from "./Entry_Tree";

export class Directory_Tree extends Directory_Tree_props {
  /**
   *
   * @param entries_matching_path
   * @param get_stats If stats must also be set in the returned value
   */
  scan(entries_matching_path?: string, get_stats?: boolean) {
    return new Promise<Entry_Tree>(async (success) => {
      //
      // Get parent' stats if stats are requested
      if (get_stats) {
        //
        //Fetch directory_path's Dirent
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

          const dir_path = this.path.slice(0, last_separator_idx);
          fs_promises.stat(dir_path).then((stats) => {
            this.parent_stats = stats;

            _scan_directory(
              this.path,
              this,
              entries_matching_path,
              get_stats
            ).then(on_scanned_tree);
          });
        }
      } else {
        _scan_directory(this.path, this, entries_matching_path, get_stats).then(
          on_scanned_tree
        );
      }

      function on_scanned_tree(tree: Entry_Tree) {
        for (const key in Entry_Tree) {
          this[key] = tree[key];
        }

        success(this);
      }
    });
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

//
// === RECURSIVE SCAN ===
function _scan_directory(
  dir_path: string,
  dir_entry?: Entry_Tree,
  entries_matching_path?: string | string[],
  get_stats?: boolean
): Promise<Entry_Tree> {
  return new Promise((success, reject) => {
    const fTree: Entry_Tree = new Entry_Tree(dir_entry);

    //
    // Format path
    {
      if (entries_matching_path) {
        //
        // Convert path to string[] of needed
        {
          if (entries_matching_path as string) {
            //
            // Split by slash or backslash
            if (/\//.test(<string>entries_matching_path)) {
              entries_matching_path = (<string>entries_matching_path).split(
                "/"
              );
            } else {
              entries_matching_path = (<string>entries_matching_path).split(
                "\\"
              );
            }
          }
        }

        //
        // Only "**" in path <=> all files
        if (
          entries_matching_path.length === 1 &&
          entries_matching_path[0] === "**"
        ) {
          entries_matching_path = undefined;
        }
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
      const scan_proms: Promise<Entry_Tree>[] = [];
      const stats_proms: Promise<Stats>[] = get_stats ? [] : undefined;

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
                  if (bIterate_subdirs) {
                    //
                    // scan the found directory
                    scan_proms.push(
                      _scan_directory(dir_path, fTree, recursive_path)
                    );
                  } else {
                    fTree.dirs.push(new Entry_Tree(fTree, entry));
                  }
                } else {
                  fTree.files.push(entry);
                }

                //
                // Fetch entry' stats if requested
                {
                  if (stats_proms) {
                    stats_proms.push(fs_promises.stat(dir_path));
                  }
                }

                continue;
              }
            }

            //
            // === path case ===
            // Otherwise an entry...
            {
              //
              // ... must be found
              if (!entries) {
                if (entry_to_find_reg.test(entry.name)) {
                  if (entry.isDirectory()) {
                    if (bEntry_to_find_is_dir) {
                      if (bIterate_subdirs) {
                        //
                        // scan the found directory
                        scan_proms.push(
                          _scan_directory(dir_path, fTree, recursive_path)
                        );
                      } else {
                        fTree.dirs.push(new Entry_Tree(fTree, entry));
                      }
                    }
                  }
                  //
                  // Else entry is a file
                  else {
                    if (!bEntry_to_find_is_dir) {
                      fTree.files.push(entry);
                    }
                  }

                  //
                  // Fetch entry' stats if requested
                  {
                    if (stats_proms) {
                      stats_proms.push(fs_promises.stat(dir_path));
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
                    if (bIterate_subdirs) {
                      //
                      // scan the found directory
                      scan_proms.push(
                        _scan_directory(dir_path, fTree, recursive_path)
                      );
                    } else {
                      fTree.dirs.push(new Entry_Tree(fTree, entry));
                    }

                    // do not break, the regex could math other entries
                  }
                }
                //
                // Else entry is a file
                else {
                  if (!bEntry_to_find_is_dir) {
                    fTree.files.push(entry);

                    // do not break, the regex could math other entries
                  }
                }

                //
                // Fetch entry' stats if requested
                {
                  if (stats_proms) {
                    stats_proms.push(fs_promises.stat(dir_path));
                  }
                }
              });
            }
          }
        }

        //
        // Wait for promises
        {
          if (scan_proms.length === 0) {
            return success(fTree);
          }

          Promise.all(scan_proms).then((dirTrees) => {
            directory.close();
            fTree.dirs = dirTrees;

            //
            // If no stats requested
            if (!stats_proms || stats_proms.length === 0) {
              return success(fTree);
            }
            //
            // else stats are requested
            Promise.all(stats_proms).then((stats: Stats[]) => {
              let file_idx = 0,
                dir_idx = 0;

              for (let i = 0; i < stats.length; i++) {
                if (stats[i].isFile()) {
                  fTree.files[file_idx].stats = stats[i];
                  file_idx++;
                } else {
                  fTree.dirs[dir_idx].stats = stats[i];
                  dir_idx++;
                }
              }
            });
          });
        }
      });
    }
  });
}
