import { Directory_Tree } from "../Directory_Tree.js";
import { Entry_Stats_intf } from "../_props/Directory_Tree_props.js";

export class Directory_Tree_Slave extends Directory_Tree {
  protected _master: Directory_Tree;

  //
  // === Directory_Tree OVERRIDES ===
  //
  // === If not root only
  protected _parent: Directory_Tree_Slave;

  dirs?: Map<string, Directory_Tree_Slave>;

  constructor(master: Directory_Tree, slave_parent: Directory_Tree_Slave) {
    super(slave_parent);
    this._master = master;
  }

  //
  // === MASTER ===
  get master(): Directory_Tree {
    return this._master;
  }

  //
  // === PATH ===
  get path(): string {
    return this.master.path;
  }

  /**
   * Get a map of subdirs' trees and files,
   * as map whose keys are the full_path
   */
  get_map(
    full_parent_path?: string,
    recursive?: boolean
  ): Map<string, Directory_Tree_Slave | Entry_Stats_intf> {
    return super.get_map(full_parent_path, recursive);
  }

  //
  // === SUB-DIRECTORIES
  /**
   * Ensure the map this.dirs exist ; if not, create it
   */
  ensure_dirs_map(): void {
    if (!this.dirs) {
      this.dirs = new Map<string, Directory_Tree_Slave>();
    }
  }

  get_slave_subdir(dir_name: string): Directory_Tree_Slave {
    return <Directory_Tree_Slave>super.get_subdir(dir_name);
  }

  set slave_subdirs(dirs_trees: Directory_Tree_Slave[]) {
    this.ensure_dirs_map();
    dirs_trees.forEach((tree) => {
      this.dirs.set(tree.name, tree);
    });
  }

  /**
   * Add the specified directory tree to this.dirs
   * If one with this name already exists, update its
   * values with those in dir_tree
   * => enable slaves to keep their value up to date
   */
  set slave_subdir(dir_tree: Directory_Tree_Slave) {
    this.ensure_dirs_map();

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

  /**
   * Set this' stats to its master
   * Recursive by default : also this' files and dirs
   *                        set their stats to their master
   *
   * After setting, removes itself calling its parent :
   *  - if this is a directory, only if is now an empty Directory_Tree
   *  - always otherwise
   *
   * @param recursive_to_children To also set sub directories trees' stats
   *                              to their master
   */
  set_stats_to_master(recursive_to_children?: boolean): void {
    this.master.stats = this.stats;

    if (this.files) {
      this.files.forEach((file_entry, name) => {
        this.master.file_entry = file_entry;
        this.files.delete(name);
      });
    }

    //
    // Recursive call to subtrees
    {
      if (recursive_to_children) {
        if (this.dirs) {
          this.dirs.forEach((dir_tree) => {
            dir_tree.set_stats_to_master(recursive_to_children);
          });
        }
      }
    }

    if (this.is_empty && this.parent) {
      this._parent.delete(this.name);
    }
  }

  /**
   * Delete the specified tree directory from this.dirs
   * If this is now empty, call parent.delete(this.name)
   */
  delete(dir_name: string): void {
    this.dirs.delete(dir_name);

    if (this.is_empty && this.parent) {
      this._parent.delete(this.name);
    }
  }
}
