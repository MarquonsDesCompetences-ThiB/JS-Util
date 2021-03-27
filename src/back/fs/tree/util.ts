import { Directory_Tree } from "./directory/Directory_Tree.js";
import { Directory_Tree_Slave } from "./directory/slave/Directory_Tree_Slave.js";
import { sanitize_regex_path } from "@path/_path.js";
import { Dirent, promises as fs_promises } from "fs";
import { Directory_Tree_Root } from "./directory/Directory_Tree_Root.js";
import { join as join_path, sep as os_path_separator } from "path";
import {
  Entry_Stats_intf,
  iDirectory_Tree,
  iDirectory_Tree_Slave,
} from "./directory/directory_intfs.js";

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
export function select<Tmaster_tree extends Directory_Tree>(
  directory_tree: iDirectory_Tree | iDirectory_Tree_Slave<Tmaster_tree>,
  entries_matching_path: string | string[],
  file_in_each_dir_matching_pattern?: RegExp,
  parent_dir_path?: string
): Directory_Tree_Slave<Tmaster_tree> {
  if (!parent_dir_path) {
    parent_dir_path = directory_tree.path;
  }

  const tree = new Directory_Tree_Slave<Tmaster_tree>({
    master: (<any>directory_tree).master
      ? (<iDirectory_Tree_Slave<Tmaster_tree>>directory_tree).master
      : directory_tree,
    scan_regex: entries_matching_path,
  });

  //
  // Fetch requested files through file_in_each_dir_matching_pattern
  {
    tree.files = directory_tree.get_files_matching_pattern(
      file_in_each_dir_matching_pattern
    );
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
    const dir_path = parent_dir_path + directory_tree.name + os_path_separator;

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
            tree.set_subdir(subtree);
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
 * @param path Required when directory_tree is not a Directory_Tree_Root,
 *                    as they don't store their full path
 */
export async function get_fs_updates<Tmaster_tree extends Directory_Tree>(
  directory_Tree_or_Dirent: Directory_Tree | Dirent,
  path?: string,
  parent_slave?: Directory_Tree_Slave<Tmaster_tree>
): Promise<Directory_Tree_Slave<Tmaster_tree> | undefined> {
  //
  // Check preconds
  {
    if (
      !(directory_Tree_or_Dirent instanceof Directory_Tree_Root) &&
      (!path || path.length === 0)
    ) {
      throw TypeError(
        "The specified directory_Tree_or_Dirent is not a root thus has no path, and no one is set as argument"
      );
    }
  }

  //
  // According to the precondition above,
  // directoryTree_or_parentSlaveTree is a Directory_Tree_Root
  if (!path) {
    path = (<Directory_Tree>directory_Tree_or_Dirent).full_path;
  }

  return fs_promises.stat(path).then((stats) => {
    //
    // If no change in file system
    {
      if (
        directory_Tree_or_Dirent instanceof Directory_Tree &&
        directory_Tree_or_Dirent.stats &&
        directory_Tree_or_Dirent.stats.mtime === stats.mtime
      ) {
        return undefined;
      }
    }

    /**
     * Create a Directory_Tree_Slave with the loaded stats
     * and look for updates in files and subdirs
     */
    {
      const tree_slave = new Directory_Tree_Slave<Tmaster_tree>({
        master:
          directory_Tree_or_Dirent instanceof Directory_Tree
            ? directory_Tree_or_Dirent
            : undefined,
        dirent:
          directory_Tree_or_Dirent instanceof Directory_Tree
            ? undefined
            : directory_Tree_or_Dirent,

        parent: parent_slave,
        stats: stats,
      });

      //
      // Open the directory
      return fs_promises.opendir(path).then((dir) => {
        let dirent_i;
        const proms = [];

        while ((dirent_i = dir.readSync())) {
          //to access the right dirent_i in every promise below
          const dirent = dirent_i;
          const entry_path = join_path(path, dirent.name);

          let known_entry_stats: Entry_Stats_intf | iDirectory_Tree;
          if (directory_Tree_or_Dirent instanceof Directory_Tree) {
            known_entry_stats = dirent.isFile()
              ? directory_Tree_or_Dirent.get_file_entry(dirent.name)
              : directory_Tree_or_Dirent.get_subdir(dirent.name);
          }

          //
          // Look for entry updates
          const prom = fs_promises.stat(entry_path).then((stats) => {
            //
            // No fs update
            {
              if (
                known_entry_stats &&
                known_entry_stats.stats &&
                known_entry_stats.stats.mtime === stats.mtime
              ) {
                return;
              }
            }

            dirent.stats = stats;

            if (dirent.isFile()) {
              //
              // else add dirent+stats to the tree slave
              tree_slave.file_entry = dirent;

              return;
            }
            //
            // else directory scan
            {
              //
              // Update from the known directory
              if (known_entry_stats) {
                return get_fs_updates(
                  <Directory_Tree>known_entry_stats,
                  entry_path,
                  tree_slave
                ).then((subdir_tree_slave) => {
                  //
                  // No fs update
                  {
                    if (!subdir_tree_slave) {
                      return undefined;
                    }
                  }

                  //
                  // else add to tree slave
                  {
                    subdir_tree_slave.parent = tree_slave;
                    tree_slave.set_subdir(subdir_tree_slave);
                  }
                });
              }
              //
              // else directory newly created -> scan it
              {
                return get_fs_updates<Tmaster_tree>(
                  dirent,
                  entry_path,
                  tree_slave
                ).then((new_sub_tree_slave) => {
                  tree_slave.set_subdir(new_sub_tree_slave);
                  return new_sub_tree_slave;
                });
              }
            }
          });

          proms.push(prom);
        }

        //
        // Wait for promises
        {
          return Promise.all(proms).then(() => {
            try {
              dir.close();
            } catch (ex) {}

            return tree_slave;
          });
        }
      });
    }
  });
}
