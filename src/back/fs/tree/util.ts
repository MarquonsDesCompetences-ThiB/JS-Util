import { Directory_Tree } from "./Directory_Tree.js";
import { Directory_Tree_Slave } from "./directory_tree_slave/Directory_Tree_Slave.js";
import { sanitize_regex_path } from "../fs.js";
import { equal as stats_equal } from "../stats.js";
import { promises as fs_promises } from "fs";
import { Directory_Tree_Root } from "./Directory_Tree_Root.js";

/**
 * Construct a slave tree
 * of directories and files (from directory_tree.dirs and directory_tree.files)
 * matching entries_matching_path or file_in_each_dir_matching_pattern
 *
 * @param entries_matching_path Directories/full file path
 *                              of entries to retrieve
 * @param file_in_each_dir_matching_pattern Files to retrieve
 *                                          from every directory
 * @param parent_dir_path Path of the parent directory
 */
export function select(
  directory_tree: Directory_Tree,
  entries_matching_path: string | string[],
  file_in_each_dir_matching_pattern?: RegExp,
  parent_dir_path?: string
): Directory_Tree_Slave {
  if (!parent_dir_path) {
    parent_dir_path = directory_tree.path;
  }

  const tree = new Directory_Tree_Slave(directory_tree.master, undefined);

  //
  // Fetch requested files through file_in_each_dir_matching_pattern
  {
    if (file_in_each_dir_matching_pattern) {
      tree.files = directory_tree.get_files_matching_pattern(
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
    const dir_path = parent_dir_path + directory_tree.name + "/";

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

      directory_tree.dirs.forEach((subdir_tree, name) => {
        if (fetch.bAll_wilcard || fetch.requested_match.test(name)) {
          const subtree = select(
            subdir_tree,
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
 * Fetch a slave tree of only entries having any updated stats in file system
 *
 * @param parent_path Required when directory_tree is not a Directory_Tree_Root,
 *                    as they don't store their full path
 */
export function get_fs_updates(
  directory_tree: Directory_Tree,
  parent_path?: string
): Promise<Directory_Tree_Slave | undefined> {
  return new Promise<Directory_Tree_Slave | undefined>((success) => {
    //
    // Check preconds
    {
      if (
        !(directory_tree instanceof Directory_Tree_Root) &&
        (!parent_path || parent_path.length === 0)
      ) {
        throw TypeError(
          "The specified directory_tree is not a root thus has no path, and no one is set as argument"
        );
      }
    }

    if (!parent_path) {
      parent_path = directory_tree.path;
    }
    const entry_full_path = parent_path + directory_tree.name;
    fs_promises.stat(entry_full_path).then((stats) => {
      //
      // If no change in file system
      {
        if (stats_equal(directory_tree.stats, stats)) {
          return success(undefined);
        }
      }

      /**
       * Create a Directory_Tree_Slave with the specified stats
       * and look for updates in files and subdirs
       */
      {
        const tree_slave = new Directory_Tree_Slave(
          directory_tree.master,
          undefined
        );
        const proms = [];

        //
        // Look for files updates
        {
          directory_tree.files.forEach((entry_stats) => {
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
          directory_tree.dirs.forEach((subdir_tree) => {
            const prom = get_fs_updates(subdir_tree, entry_full_path + "/");
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
