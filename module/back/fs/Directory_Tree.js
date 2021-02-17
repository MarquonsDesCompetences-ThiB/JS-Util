var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
import { Directory_Tree_props } from "./_props/Directory_Tree_props";
import { promises as fs_promises } from "fs";
export class Directory_Tree extends Directory_Tree_props {
  scan(entries_matching_path) {
    return new Promise((success) =>
      __awaiter(this, void 0, void 0, function* () {
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
          const parent_dir_path = this.path.slice(0, last_separator_idx);
          const dir_name = this.path.slice(
            last_separator_idx + 1,
            end_dir_name_idx
          );
          let dir_found = false;
          fs_promises.opendir(parent_dir_path).then((parent_directory) => {
            var parent_directory_1, parent_directory_1_1;
            return __awaiter(this, void 0, void 0, function* () {
              var e_1, _a;
              try {
                for (
                  parent_directory_1 = __asyncValues(parent_directory);
                  (parent_directory_1_1 = yield parent_directory_1.next()),
                    !parent_directory_1_1.done;

                ) {
                  const parent_dir_entry = parent_directory_1_1.value;
                  if (parent_dir_entry.name === dir_name) {
                    dir_found = true;
                    _scan(
                      parent_dir_path,
                      parent_dir_entry,
                      entries_matching_path
                    ).then((tree) => {
                      this.tree = tree;
                      success(this);
                    });
                  }
                }
              } catch (e_1_1) {
                e_1 = { error: e_1_1 };
              } finally {
                try {
                  if (
                    parent_directory_1_1 &&
                    !parent_directory_1_1.done &&
                    (_a = parent_directory_1.return)
                  )
                    yield _a.call(parent_directory_1);
                } finally {
                  if (e_1) throw e_1.error;
                }
              }
              if (!dir_found) {
                throw ReferenceError("Directory not found : " + this.path);
              }
            });
          });
        }
      })
    );
  }
}
function get_path_request(path) {
  const ret = {
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
function _scan(parent_dir_path, dir_ent, path) {
  return new Promise((success, reject) => {
    const fTree = {
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
          if (path) {
            //
            // Split by slash or backslash
            if (/\//.test(path)) {
              path = path.split("/");
            } else {
              path = path.split("\\");
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
    let entries = bAll_wildcard ? [] : undefined;
    const matching_entries = entries ? [] : undefined;
    //
    // path argument for recursive calls to scan
    // to be used only if !bAll_wildcard
    let recursive_path = !path ? undefined : path.slice(1);
    {
      const scan_proms = [];
      const dir_path = parent_dir_path + "/" + dir_ent.name;
      fs_promises.opendir(dir_path).then((directory) => {
        var directory_1, directory_1_1;
        return __awaiter(this, void 0, void 0, function* () {
          var e_2, _a;
          //
          // Iterate files
          {
            try {
              for (
                directory_1 = __asyncValues(directory);
                (directory_1_1 = yield directory_1.next()), !directory_1_1.done;

              ) {
                const entry = directory_1_1.value;
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
                            scan_proms.push(
                              _scan(dir_path, entry, recursive_path)
                            );
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
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (
                  directory_1_1 &&
                  !directory_1_1.done &&
                  (_a = directory_1.return)
                )
                  yield _a.call(directory_1);
              } finally {
                if (e_2) throw e_2.error;
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
                subtree: fTree,
              });
            }
            Promise.all(scan_proms).then((dirTrees) => {
              directory.close();
              fTree.dirs = dirTrees;
              return success({
                dir: dir_ent,
                subtree: fTree,
              });
            });
          }
        });
      });
    }
  });
}
//# sourceMappingURL=Directory_Tree.js.map
