import { repeat } from "@src/both/types/string/_string.js";
import { Entry } from "../../entry/Entry.js";
import { specs as obj_specs } from "@src/both/types/obj/_obj.js";
import { Stats } from "fs";
import { join as join_path, sep as os_path_separator } from "path";
import { Entry_Stats_intf, iDirectory_Tree } from "../directory_intfs.js";

export abstract class Directory_Tree_props
  extends Entry
  implements Entry_Stats_intf, iDirectory_Tree {
  #id?: string;

  /**
   * If no enum decorator, value wouldn't be set
   * by Obj.set if this.stats = undefined
   */
  @obj_specs.decs.props.enum
  stats?: Stats;

  abstract dirs: Map<string, iDirectory_Tree>;

  @obj_specs.decs.props.jsonified
  files: Map<string, Entry_Stats_intf> = new Map<string, Entry_Stats_intf>();

  //
  // === Children only
  @obj_specs.decs.props.cyclic
  parent?: iDirectory_Tree;

  get root() {
    if (this.parent) {
      return this.parent.root;
    }

    throw new TypeError(
      "Directory " + this.name + " : Is not root and has no parent set"
    );
  }

  get virtual_root() {
    return this.root.virtual_root;
  }

  //
  // === iDirectory_Tree ===
  abstract get_dirs_files_table_arr(
    recursive?: boolean,
    other_trees?: iDirectory_Tree[]
  ): any;

  abstract scan(
    dir_path: string,
    entries_matching_path?: string | string[],
    get_stats?: boolean
  ): Promise<iDirectory_Tree>;

  abstract get_files_matching_pattern(
    pattern?: RegExp
  ): Map<string, Entry_Stats_intf>;

  /**
   * Required :
   *  dirent {Dirent}
   *  parent {Directory_Tree_props}
   *
   *
  constructor() {
    super();
  }
  */

  //
  // === CONSTRUCTORS ===
  /**
   * Create a new instance of this with the specified parameters
   * Usefull to create a new master for a slave which have none,
   * keeping all slaves' values
   *
   * @param obj
   * @returns
   */
  make_new(obj?) {
    return new (Object.getPrototypeOf(this).constructor)(obj);
  }

  //
  // === TO STRING ===
  toString() {
    return this.tree_str();
  }

  //
  // === ID ===
  @obj_specs.decs.meths.enum
  get id(): string {
    if (!this.parent) {
      if (this.#id) {
        return this.#id + "." + this.name;
      }
      return this.name;
    }

    return this.parent.id + "." + this.name;
  }

  set id(id: string) {
    this.#id = id;
  }

  tree_str(nb_indents: number = 1): string {
    let indents = repeat(nb_indents, "\t");

    //
    // Current directory
    const dir_indents = repeat(nb_indents, "+\t");

    let str =
      dir_indents + (nb_indents === 1 ? this.full_path : this.name) + ":\n";
    if (this.stats) {
      str += indents + JSON.stringify(this.stats) + "\n";
    }

    nb_indents++;
    //
    // Directory's files
    const file_indents = repeat(nb_indents, "-\t");
    indents += "\t";
    if (this.files) {
      this.files.forEach((entry_stats) => {
        str += file_indents + entry_stats.name + "\n";
        str += indents + JSON.stringify(entry_stats) + "\n";
      });
    }

    //
    // Directory's directories
    if (this.dirs) {
      this.dirs.forEach((dir) => {
        str += dir.tree_str(nb_indents) + "\n";
      });
    }

    return str;
  }

  //
  // === PATH ===
  @obj_specs.decs.meths.enum
  get path() {
    if (this.parent) {
      return this.parent.full_path;
    }
    //
    // else this is root => contains the path
    return super.path;
  }

  /**
   * To make the getter overriding above
   * not to turn the property to read-only
   */
  set path(path: string) {
    super.path = path;
  }

  get full_path() {
    if (this.parent) {
      const full_path = this.parent.full_path;
      const name = this.name;

      if (full_path) {
        if (name) {
          return join_path(full_path, name);
        }

        return full_path;
      }

      return name;
    }
    //
    // else this is root => contains the path
    return super.full_path;
  }

  /**
   * To make the getter overriding above
   * not to turn the property to read-only
   */
  @obj_specs.decs.meths.enum
  set full_path(full_path: string) {
    super.full_path = full_path;
  }

  get relative_path() {
    if (this.parent) {
      return join_path(this.parent.relative_path, this.name);
    }

    return this.name;
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
  ): Map<string, iDirectory_Tree | Entry_Stats_intf> {
    //
    // Sanitize arguments
    {
      if (!full_parent_path) {
        full_parent_path = this.path;
      } else {
        full_parent_path += "/" + this.name;
      }
    }

    const map = new Map<string, iDirectory_Tree | Entry_Stats_intf>();

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

  get_subdir(dir_name: string): iDirectory_Tree {
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

    this.files.set(entry_stats.name, entry_stats);
    /*
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
    */
  }

  @obj_specs.decs.meths.jsonify
  get files_json(): any {
    const files: any = {};

    //
    // Undefined files
    {
      if (!this.files) {
        return files;
      }
    }

    this.files.forEach((entr_stat, fname) => {
      files[fname] = entr_stat;
    });

    return files;
  }

  set files_json(json: any) {
    //
    // Init files if needed
    {
      if (!this.files) {
        this.files = new Map<string, Entry_Stats_intf>();
      }
    }

    for (const fname in json) {
      this.files.set(fname, json[fname]);
    }
  }

  get files_names(): string[] {
    const fnames = [];

    //
    // Undefined files
    {
      if (!this.files) {
        return fnames;
      }
    }

    this.files.forEach(({ name }) => {
      fnames.push(name);
    });

    return fnames;
  }

  /**
   * Return all files' names in this directory
   * and their respective modified time (when stats is set)
   */
  get files_names_modifiedTime(): [string, string][] {
    const fnames_stats = [];

    //
    // Undefined files
    {
      if (!this.files) {
        return fnames_stats;
      }
    }

    this.files.forEach(({ name, stats = undefined }) => {
      fnames_stats.push([name, stats ? stats.mtime : undefined]);
    });

    return fnames_stats;
  }

  /**
   *
   * @param path
   * @param absolute If the path set is absolute, eg :
   *                  no starting slash -> go to root to fetch the path
   *                  starting ./ or ../ -> look from current directory
   * @returns
   */
  get_path(
    path: string | string[],
    absolute?: boolean
  ): iDirectory_Tree | Entry_Stats_intf {
    if (!(path instanceof Array)) {
      path = path.split(os_path_separator);

      if (absolute) {
        return this.root.get_path(path);
      }
    }

    const next_access = path.shift();
    //
    // Look in dirs
    {
      const dir = this.dirs ? this.dirs.get(next_access) : undefined;
      if (dir) {
        if (path.length === 0) {
          return dir;
        }
        return dir.get_path(path);
      }

      //
      // Not found in dir but path has other entries
      // => next_access should be a directory
      throw_ref_error.call(this);
    }

    //
    // Look in files
    {
      const file = this.files ? this.files.get(next_access) : undefined;
      if (file) {
        return file;
      }
    }
    throw_ref_error.call(this);

    function throw_ref_error() {
      throw new ReferenceError(
        "Directory " +
          this.name +
          " : Entry " +
          next_access +
          " not found (from path " +
          (<string[]>path).join(os_path_separator) +
          ")"
      );
    }
  }
}
