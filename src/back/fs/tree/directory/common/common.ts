import { Entry_Stats_intf, iDirectory_Tree } from "./iDirectory_Tree.js";

/**
 * Get a map of subdirs' trees and files,
 * as map whose keys are the full_path
 */
export function get_map<
  Tdir extends iDirectory_Tree,
  Tfile extends Entry_Stats_intf
>(
  directory_tree: iDirectory_Tree,
  full_parent_path?: string,
  recursive?: boolean
): Map<string, Tdir | Tfile> {
  //
  // Sanitize arguments
  {
    if (!full_parent_path) {
      full_parent_path = directory_tree.path;
    } else {
      full_parent_path += "/" + directory_tree.name;
    }
  }

  const map = new Map<string, Tdir | Tfile>();

  //
  // Add subdirs
  {
    if (directory_tree.dirs) {
      directory_tree.dirs.forEach((dir_tree, name) => {
        map.set(full_parent_path + "/" + name, <Tdir>dir_tree);
      });
    }
  }

  //
  // Add files
  {
    if (directory_tree.files) {
      directory_tree.files.forEach((file_entry, name) => {
        map.set(full_parent_path + "/" + name, <Tfile>file_entry);
      });
    }
  }

  //
  // If recursive map requested
  {
    if (recursive && directory_tree.dirs) {
      directory_tree.dirs.forEach((dir_tree) => {
        const submap = dir_tree.get_map(full_parent_path, recursive);
        submap.forEach((subdir_tree, full_path) => {
          map.set(full_path, <Tdir | Tfile>subdir_tree);
        });
      });
    }
  }

  return map;
}
