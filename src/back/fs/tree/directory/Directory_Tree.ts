import { Dir, Dirent, promises as fs_promises, Stats } from "fs";
import { join as join_path } from "path";

import { string } from "@both_types/_types.js";
import { specs as obj_specs } from "@both_types/obj/_obj.js";
import { sanitize_regex_path } from "@path/_path.js";
import { get_path_request } from "../../path/path_request.js";

import { from_Dirent } from "../entry/iDirent.js";
import { Directory_Tree_props } from "./_props/Directory_Tree_props.js";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
  tDirectory_Tree,
} from "./iDirectory_Tree.js";

export class Directory_Tree
  extends Directory_Tree_props
  implements iDirectory_Tree {
  //
  // === _PROPS OVERRIDES ===
  //@obj_specs.decs.props.jsonified
  //dirs: Map<string, iDirectory_Tree> = new Map<string, iDirectory_Tree>();

  /**
   *
   * @param obj Required if Directory_Tree is the final class of this
   */
  constructor(obj?: tDirectory_Tree | Directory_Tree) {
    super();

    this.set(obj, undefined, true);

    //
    // Check postconds
    {
      //
      // Final Directory_Tree must have an obj and parent argument
      if (Object.getPrototypeOf(this).constructor.name === "Directory_Tree") {
        if (!obj) {
          throw new TypeError("Missing argument obj{iDirectory_Tree_Node}");
        }

        if (!this.parent) {
          throw new TypeError(
            "Directory " + this.name + " : Parent is missing"
          );
        }
      }
    }
  }

  //
  // === MASTER ===
  get master(): iDirectory_Tree {
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
  set_subdir(dir_tree: iDirectory_Tree): iDirectory_Tree {
    dir_tree.parent = this;

    this.ensure_dirs_map();
    const dir_set = this.dirs.get(dir_tree.name);
    //
    // Must add the new one
    {
      if (!dir_set) {
        this.dirs.set(dir_tree.name, dir_tree);
        return dir_tree;
      }
    }
    //
    // Else update the existing one's values
    dir_set.set(dir_tree);
    return <Directory_Tree>dir_set;
  }

  get_files_matching_pattern(pattern?: RegExp) {
    if (!this.files) {
      return undefined;
    }

    const map = new Map<string, Entry_Stats_intf>();
    this.files.forEach((entry, name) => {
      if (!pattern || pattern.test(name)) {
        map.set(name, entry);
      }
    });

    if (map.size === 0) {
      return undefined;
    }
    return map;
  }

  /**
   *
   * @param entry_name Must be a key in this.dirs or this.files
   * @param dir_path If nt set, fetched from this.path
   * @returns
   */
  async load_fs_stats(entry_name: string, dir_path?: string): Promise<Stats> {
    let file = this.files ? this.files.get(entry_name) : undefined;
    let dir = this.dirs ? this.dirs.get(entry_name) : undefined;

    if (!file && !dir) {
      throw new ReferenceError(
        "Directory " +
          this.name +
          " : " +
          entry_name +
          " is neither in this' files or directories"
      );
    }

    if (!dir_path) {
      if (file) {
        dir_path = this.full_path;
      } else {
        dir_path = this.path;
      }
    }

    return fs_promises.stat(join_path(dir_path, entry_name)).then((stats) => {
      if (file) {
        file.stats = stats;
      } else {
        dir.stats = stats;
      }

      return stats;
    });
  }

  /**
   * Scan this directory in file system to fill this.dirs and this.files
   * @param dir_path
   * @param entries_matching_path
   * @param get_stats
   */
  async scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ): Promise<Directory_Tree> {
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
      const proms: Promise<iDirectory_Tree | Stats>[] = [];

      return fs_promises.opendir(dir_path).then(async (directory: Dir) => {
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
                  const subtree = this.set_subdir(
                    new Directory_Tree({
                      dirent: entry,
                      path: dir_path,
                      parent: this,
                    })
                  );

                  //
                  // scan the found directory
                  if (bIterate_subdirs) {
                    proms.push(
                      subtree.scan(
                        join_path(dir_path, entry.name),
                        recursive_path
                      )
                    );
                  }
                } else {
                  this.file_entry = from_Dirent(entry);
                }

                //
                // Fetch entry' stats if requested
                {
                  if (get_stats) {
                    proms.push(this.load_fs_stats(entry.name, dir_path));
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
                      const subtree = this.set_subdir(
                        new Directory_Tree({
                          dirent: entry,
                          path: dir_path,
                          parent: this,
                        })
                      );
                      //
                      // scan the found directory
                      if (bIterate_subdirs) {
                        proms.push(
                          subtree.scan(
                            join_path(dir_path, entry.name),
                            recursive_path
                          )
                        );
                      }
                    }
                  }
                  //
                  // Else entry is a file
                  else {
                    if (!bEntry_to_find_is_dir) {
                      this.file_entry = from_Dirent(entry);
                    }
                  }

                  //
                  // Fetch entry' stats if requested
                  {
                    if (get_stats) {
                      proms.push(this.load_fs_stats(entry.name, dir_path));
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
                    const subtree = this.set_subdir(
                      new Directory_Tree({
                        dirent: entry,
                        path: dir_path,
                        parent: this,
                      })
                    );
                    if (bIterate_subdirs) {
                      //
                      // scan the found directory
                      proms.push(
                        subtree.scan(
                          join_path(dir_path, entry.name),
                          recursive_path
                        )
                      );
                    }

                    // do not break, the regex could math other entries
                  }
                }
                //
                // Else entry is a file
                else {
                  if (!bEntry_to_find_is_dir) {
                    this.file_entry = from_Dirent(entry);

                    // do not break, the regex could math other entries
                  }
                }

                //
                // Fetch entry' stats if requested
                {
                  if (get_stats) {
                    proms.push(this.load_fs_stats(entry.name, dir_path));
                  }
                }
              });
            }
          }
        }

        //
        // Wait for promises
        {
          if (proms.length === 0) {
            try {
              directory.close();
            } catch (ex) {}

            return <Directory_Tree>this;
          }

          return Promise.all(proms).then(() => {
            try {
              directory.close();
            } catch (ex) {}

            return <Directory_Tree>this;
          });
        }
      });
    }
  }

  //
  // === GETTERS/SETTERS
  /**
   * Return directories and files data to be displayable by console.table
   * @param recursive
   * @param path
   */
  get_dirs_files_table_arr(
    recursive?: boolean,
    other_trees?: Directory_Tree[]
  ): any {
    const arr = [];

    //
    // Fetch dirs
    {
      const dirs = {
        path_end:
          (this.parent ? this.parent.name + "/" : "") + this.name + " : dirs",
        0: string.format.array(<[]>this.dirs_names_modifiedTime, ""),
      };

      if (other_trees) {
        other_trees.forEach((tree, idx) => {
          if (tree) {
            //
            // Set tree's directories as a readable (eg well formatted)
            // array string
            dirs[idx + 1] = string.format.array(
              <[]>tree.dirs_names_modifiedTime,
              ""
            );
          }
        });
      }

      arr.push(dirs);
    }

    //
    // Fetch files
    {
      const files = {
        path_end:
          (this.parent ? this.parent.name + "/" : "") + this.name + " : files",
        0: string.format.array(<[]>this.files_names_modifiedTime, ""),
      };

      if (other_trees) {
        other_trees.forEach((tree, idx) => {
          if (tree) {
            //
            // Set tree's files as a readable (eg well formatted)
            // array string
            files[idx + 1] = string.format.array(
              <[]>tree.files_names_modifiedTime,
              ""
            );
          }
        });
      }

      arr.push(files);
    }

    if (!recursive || !this.dirs) {
      return arr;
    }

    //
    // else recursive calls on every directory
    {
      this.dirs.forEach((dir_tree, dir_name) => {
        const recursive_trees = other_trees ? [] : undefined;
        if (other_trees) {
          other_trees.forEach((tree, idx) => {
            if (tree) {
              recursive_trees[idx] = tree.get_subdir(dir_name);
            }
          });
        }

        arr.push(...dir_tree.get_dirs_files_table_arr(true, recursive_trees));
      });
    }

    return arr;
  }

  @obj_specs.decs.meths.jsonify
  get dirs_json(): any {
    const dirs: any = {};

    //
    // Undefined directoriess
    {
      if (!this.dirs) {
        return dirs;
      }
    }

    this.dirs.forEach((dir_tree, dname) => {
      dirs[dname] = dir_tree.toJSON();
    });

    return dirs;
  }

  set dirs_json(json: any) {
    //
    // Init directories if needed
    {
      if (!this.dirs) {
        this.dirs = new Map<string, Directory_Tree>();
      }
    }

    for (const dname in json) {
      json[dname].parent = this;

      this.dirs.set(dname, new Directory_Tree(json[dname]));
    }
  }

  get dirs_names(): string[] {
    const dnames = [];

    //
    // Undefined directoriess
    {
      if (!this.dirs) {
        return dnames;
      }
    }

    this.dirs.forEach(({ name }) => {
      dnames.push(name);
    });

    return dnames;
  }

  /**
   * Return all directories' names in this directory
   * and their respective modified time (when stats is set)
   */
  get dirs_names_modifiedTime(): [string, string][] {
    const dnames_stats = [];

    //
    // Undefined directoriess
    {
      if (!this.dirs) {
        return dnames_stats;
      }
    }

    this.dirs.forEach(({ name, stats = undefined }) => {
      dnames_stats.push([name, stats ? stats.mtime : undefined]);
    });

    return dnames_stats;
  }

  //
  // === DISPLAY IN TABLE ===
  print_dirs_files_table(recursive?: boolean, other_trees?: Directory_Tree[]) {
    /*const cols_order = ["path_end", "0"];

    if (other_trees) {
      for (let i = 1; i <= other_trees.length; i++) {
        cols_order.push(i + "");
      }
    }*/

    console.table(
      this.get_dirs_files_table_arr(recursive, other_trees) //, cols_order
    );
  }

  //
  // === LOGS ===
  // Preconds : global.Logger loaded
  static error(file_name: string, ex: string | Error) {
    if (ex instanceof Error) {
      ex.message = "Directory " + file_name + " : " + ex.message;
      logger.error = ex;
    } else {
      logger.error = "Directory " + file_name + " : " + ex;
    }
  }

  static info(file_name: string, msg: string) {
    logger.info = "Directory " + file_name + " : " + msg;
  }

  static log(file_name: string, msg: string) {
    logger.log = "Directory " + file_name + " : " + msg;
  }

  static trace(file_name: string, msg: string) {
    logger.trace = "Directory " + file_name + " : " + msg;
  }

  static warn(file_name: string, msg: string) {
    logger.warn = "Directory " + file_name + " : " + msg;
  }
}
