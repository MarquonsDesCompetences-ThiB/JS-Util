import { Directory_Tree } from "../Directory_Tree.js";
import { Directory_Tree_Slave } from "./Directory_Tree_Slave.js";
import { sanitize_regex_path } from "../../fs.js";

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
