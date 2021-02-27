import { Dirent, Stats } from "fs";

export interface Entry_Stats_intf extends Dirent {
  stats?: Stats;
}

export abstract class Directory_Tree_props
  extends Dirent
  implements Entry_Stats_intf {
  stats?: Stats;

  dirs?: Map<string, Directory_Tree_props>;
  files?: Map<string, Entry_Stats_intf>;

  //
  // === Children only
  parent: Directory_Tree_props;

  constructor(parent: Directory_Tree_props, dirent?: Dirent) {
    super();

    this.parent = parent;

    if (dirent) {
      this.dirent = dirent;
    }
  }

  set dirent(dirent: Dirent) {
    for (const key in Dirent) {
      this[key] = dirent[key];
    }
  }

  //
  // === PATH ===
  get path() {
    const entry_name = this.isDirectory() ? this.name + "/" : this.name;

    return this.parent.path + entry_name;
  }

  //
  // === SUB-FILES/SUB-DIRECTORIES
  get is_empty() {
    return (
      (!this.dirs || this.dirs.size === 0) &&
      (!this.files || this.files.size === 0)
    );
  }

  /**
   * Get a map of subdirs' trees and files,
   * as map whose keys are the full_path
   */
  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, Directory_Tree_props | Entry_Stats_intf> {
    //
    // Sanitize arguments
    {
      if (!full_parent_path) {
        full_parent_path = this.path;
      } else {
        full_parent_path += "/" + this.name;
      }
    }

    const map = new Map<string, Directory_Tree_props | Entry_Stats_intf>();

    //
    // Add subdirs
    {
      if (this.dirs) {
        this.dirs.forEach((dir_tree, name) => {
          map.set(full_parent_path + "/" + name, dir_tree);
        });
      }
    }

    //
    // Add files
    {
      if (this.files) {
        this.files.forEach((file_entry, name) => {
          map.set(full_parent_path + "/" + name, file_entry);
        });
      }
    }

    //
    // If recursive map requested
    {
      if (recursive && this.dirs) {
        this.dirs.forEach((dir_tree) => {
          const submap = dir_tree.get_map(full_parent_path, recursive);
          submap.forEach((subdir_tree, full_path) => {
            map.set(full_path, subdir_tree);
          });
        });
      }
    }

    return map;
  }

  //
  // === SUB-DIRECTORIES
  /**
   * Ensure the map this.dirs exist ; if not, create it
   */
  ensure_dirs_map() {
    if (!this.dirs) {
      this.dirs = new Map<string, Directory_Tree_props>();
    }
  }

  get_subdir(dir_name: string): Directory_Tree_props {
    if (!this.dirs) {
      return undefined;
    }

    return this.dirs.get(dir_name);
  }

  //
  // === SUB-FILES

  /**
   * Ensure the map this.files exist ; if not, create it
   */
  ensure_files_map() {
    if (!this.files) {
      this.files = new Map<string, Entry_Stats_intf>();
    }
  }

  get_file_entry(file_name: string): Entry_Stats_intf {
    if (!this.files) {
      return undefined;
    }

    return this.files.get(file_name);
  }

  /**
   * Add the specified file entry to this.files
   * If one with this name already exists, update its
   * values with those in entry_stats
   */
  set file_entry(entry_stats: Entry_Stats_intf) {
    this.ensure_files_map;

    const file_set = this.files.get(entry_stats.name);
    //
    // Must add the new one
    {
      if (!file_set) {
        this.files.set(entry_stats.name, entry_stats);
        return;
      }
    }
    //
    // Else update the existing one's values
    for (const key in entry_stats) {
      file_set[key] = entry_stats[key];
    }
  }
}
