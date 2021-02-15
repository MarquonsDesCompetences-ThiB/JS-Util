import { Dirent, promises as fs_promises } from "fs";
import { Directory_Tree } from "./Directory_Tree";
import { Dir_Tree_intf, Files_Tree_intf } from "./_props/Directory_Tree_props";

export function scan(directory_path: string, entries_matching_path?: string) {
  return new Promise<Directory_Tree>(async (success, reject) => {
    //
    // Sanitize directory_path
    {
      //
      // Remove beginning/end spaces
      directory_path = directory_path.replace(/^\s+/, "");
      directory_path = directory_path.replace(/\s+$/, "");
    }
    //
    //Fetch directory_path's Dirent
    {
      let last_separator_idx;
      let end_dir_name_idx = directory_path.length;
      {
        // used separator is a slash or backslash ?
        const spearator_char = /\//.test(directory_path) ? "/" : "\\";
        const dir_path_last_idx = directory_path.length - 1;
        //
        // Fetch from path the slash or backslash preceding the dir name
        {
          last_separator_idx = directory_path.lastIndexOf(spearator_char);
          //
          // If slash|backslash is the last char, get the previous one
          if (last_separator_idx === dir_path_last_idx) {
            end_dir_name_idx = last_separator_idx;
            last_separator_idx = directory_path.lastIndexOf(
              spearator_char,
              dir_path_last_idx - 1
            );
          }
        }
      }

      const parent_dir_path = directory_path.slice(0, last_separator_idx);
      const dir_name = directory_path.slice(
        last_separator_idx + 1,
        end_dir_name_idx
      );
      let dir_found = false;
      fs_promises.opendir(parent_dir_path).then(async (parent_directory) => {
        for await (const parent_dir_entry of parent_directory) {
          if (parent_dir_entry.name === dir_name) {
            dir_found = true;
            _scan(
              parent_dir_path,
              parent_dir_entry,
              entries_matching_path
            ).then((tree: Dir_Tree_intf) => {
              success(
                new Directory_Tree({
                  tree,
                })
              );
            });
          }
        }

        if (!dir_found) {
          throw ReferenceError("Directory not found : " + directory_path);
        }
      });
    }
  });
}

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

function _scan(
  parent_dir_path: string,
  dir_ent: Dirent,
  path?: string | string[]
): Promise<Dir_Tree_intf> {
  return new Promise((success, reject) => {
    const fTree: Files_Tree_intf = {
      dirs: [],
      files: [],
    };

    //
    // Format path
    {
      if (path) {
        //
        // Convert path to string[] of needed
        {
          if (path as string) {
            //
            // Split by slash or backslash
            if (/\//.test(<string>path)) {
              path = (<string>path).split("/");
            } else {
              path = (<string>path).split("\\");
            }
          }
        }

        //
        // Only "**" in path <=> all files
        if (path.length === 1 && path[0] === "**") {
          path = undefined;
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
    } = get_path_request(path);

    //
    // Not to iterate all entries twice
    // If bAll_wildcard, we have to first check the next entry
    // (entry_to_find) is not in this to fetch all directories/files
    let entries: Dirent[] | undefined = bAll_wildcard ? [] : undefined;
    const matching_entries = entries ? [] : undefined;

    //
    // path argument for recursive calls to scan
    // to be used only if !bAll_wildcard
    let recursive_path = !path ? undefined : path.slice(1);

    {
      const scan_proms: Promise<Dir_Tree_intf>[] = [];

      const dir_path = parent_dir_path + "/" + dir_ent.name;
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
                    scan_proms.push(_scan(dir_path, entry, recursive_path));
                  } else {
                    fTree.dirs.push({ dir: entry });
                  }
                } else {
                  fTree.files.push(entry);
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
                        scan_proms.push(_scan(dir_path, entry, recursive_path));
                      } else {
                        fTree.dirs.push({ dir: entry });
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
              path = !path ? undefined : path.slice(2);
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
                      scan_proms.push(_scan(dir_path, entry, recursive_path));
                    } else {
                      fTree.dirs.push({ dir: entry });
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
              });
            }
          }
        }

        //
        // Wait for promises
        {
          if (scan_proms.length === 0) {
            return success({
              dir: dir_ent,
              tree: fTree,
            });
          }

          Promise.all(scan_proms).then((dirTrees) => {
            directory.close();

            fTree.dirs = dirTrees;
            return success({
              dir: dir_ent,
              tree: fTree,
            });
          });
        }
      });
    }
  });
}
