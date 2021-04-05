import { Dir, Dirent, promises as fs_promises } from "fs";
import { join as join_path, sep as os_path_separator } from "path";

import { string } from "@both_types/_types.js";
import { Obj, specs as obj_specs } from "@both_types/obj/_obj.js";
import { get_root_dir_path } from "../../../module/_module.js";

import { split } from "@path/_path.js";
import { iDirent_json, from_Dirent } from "./iDirent.js";

/**
 * Default is a string to be clonable with JSON.parse()
 */
const default_writable_dirent_str = JSON.stringify({
  isFile: false,
  isDirectory: true,
  isBlockDevice: false,
  isCharacterDevice: false,
  isSymbolicLink: false,
  isFIFO: true,
  isSocket: false,
  name: undefined,
});

export class Entry extends Obj implements iDirent_json {
  //
  // === STATIC ===
  static full_names(files: Entry[]): string[] {
    const names = [];
    files.forEach((file) => {
      names.push(file.full_name);
    });
    return names;
  }

  static full_pathes(files: Entry[]): string[] {
    const pathes = [];
    files.forEach((file) => {
      pathes.push(file.full_path);
    });
    return pathes;
  }

  //
  // === INSTANCE ===
  /**
   * Dirent version to be loaded from json
   * Used when this._dirent is undefined
   */
  //#_d: iDirent_json = JSON.parse(default_writable_dirent_str);
  isFile: boolean;
  isDirectory: boolean;
  isBlockDevice: boolean;
  isCharacterDevice: boolean;
  isSymbolicLink: boolean;
  isFIFO: boolean;
  isSocket: boolean;
  name: string;

  ext: string;

  /**
   * Path
   */
  #_p?: string;

  /**
   * Dirent version to be read from fs
   *
  @obj_specs.decs.props.jsonified
  protected _dirent: Dirent;*/

  constructor(path_or_Dirent_or_obj?: string | Dirent | any, obj?: any) {
    super();

    if (path_or_Dirent_or_obj) {
      //
      // Path
      if (string.is(path_or_Dirent_or_obj)) {
        this.path = <string>path_or_Dirent_or_obj;
      }
      //
      // Dirent
      else if (path_or_Dirent_or_obj instanceof Dirent) {
        this.dirent = <Dirent>path_or_Dirent_or_obj;
      }
      //
      // Object
      else {
        this.set(path_or_Dirent_or_obj);
      }

      if (obj) {
        this.set(obj, undefined, true);
      }
    }
  }

  //
  // === DIRENT / DIRENT_WRITABLE ===
  @obj_specs.decs.meths.jsonify
  /*get dirent() {
    return this.#_d;
  }*/
  set dirent(dirent: Dirent | iDirent_json) {
    if (dirent instanceof Dirent) {
      this.isFile = dirent.isFile();
      this.isDirectory = dirent.isDirectory();
      this.isBlockDevice = dirent.isBlockDevice();
      this.isCharacterDevice = dirent.isCharacterDevice();
      this.isSymbolicLink = dirent.isSymbolicLink();
      this.isFIFO = dirent.isFIFO();
      this.isSocket = dirent.isSocket();
    } else {
      this.set(dirent);
    }

    this.full_name = dirent.name;
  }

  /*@obj_specs.decs.meths.jsonify
  get dirent_json(): Dirent | iDirent_json {
    return this.#_d;
  }

  set dirent_json(dirent_json: Dirent | iDirent_json) {
    this.dirent = dirent_json;
  }*/

  //
  // === PATH ===
  @obj_specs.decs.meths.enum
  get path() {
    return this.#_p;
  }

  set path(path: string) {
    //
    // Remove forbidden characters from path and set
    {
      /*
            Keep ':' preceded by a drive letter
            Keep everything else which is not : * ? " < > |
          
      const formatted = path.match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g).join("");*/

      this.#_p = path;
      //
      // No ending slash or backslash
      if (!/(\/|\\)$/.test(this.#_p)) {
        this.#_p += os_path_separator;
      }
    }
  }

  @obj_specs.decs.meths.jsonify
  get full_path() {
    const path = this.path;
    const name = this.full_name;

    if (path) {
      if (name) {
        return join_path(path, name);
      }

      return path;
    }

    return name;
  }

  /**
   * path and name parts are extracted
   * from the specified full path
   *
   * If full_path contains only 1 item
   * (eg there is no '\\' or '/' delimiting path's entries),
   * This is set as the name and the path is fetched
   * from module.get_root_dir_path
   *
   * Path is read to read the file system
   * and fetch the associated Dirent
   */
  set full_path(full_path: string) {
    const delimiter = full_path.match(/\\|\//);

    //
    // Set name and this.path
    {
      if (!delimiter) {
        this.full_name = full_path;
        this.path = get_root_dir_path();
      } else {
        let last_delimiter = full_path.lastIndexOf(delimiter[0]);
        //
        // Delimiter is the last character
        // => fetch the previous delimiter
        if (last_delimiter === full_path.length - 1) {
          last_delimiter = full_path.lastIndexOf(
            delimiter[0],
            last_delimiter - 1
          );
        }

        this.full_name = full_path.slice(last_delimiter + delimiter[0].length);
        this.path = full_path.slice(0, last_delimiter);
      }
    }

    //
    //Fetch Dirent
    {
      fs_promises.opendir(this.path).then(async (dir: Dir) => {
        for await (const entry of dir) {
          if (entry.name === this.full_name) {
            this.dirent = entry;
            close_dir();
            return;
          }
        }

        close_dir();
        logger.error =
          "Directory entry " + this.full_name + " not found in " + this.path;

        function close_dir() {
          try {
            dir.close();
          } catch (ex) {}
        }
      });
    }
  }
  //
  // === DIRENT INTERFACE ===
  @obj_specs.decs.meths.jsonify
  get full_name() {
    const ext = this.ext ? "." + this.ext : "";
    return this.name + ext;
  }

  set full_name(full_name: string) {
    const splitted = split.full_name(full_name);
    this.name = splitted.name;
    this.ext = splitted.ext;
  }

  /*@obj_specs.decs.meths.enum
  get name() {
    if (this.#_d) {
      return this.name;
    }
  }

  set name(name: string) {
    this.name = name;
  }*/

  /*//
  // === isFile ===
  @obj_specs.decs.meths.enum
  get is_file(): boolean {
    return this.isFile;
  }

  set is_file(is_file: boolean) {
    this.isFile = is_file;
  }

  get isFile() {
    return this.is_file;
  }

  //
  // === isDirectory ===
  @obj_specs.decs.meths.enum
  get is_directory(): boolean {
    if (this._dirent) {
      return this._dirent.isDirectory();
    }

    if (this.#_d) {
      return this.isDirectory;
    }
  }

  set is_directory(is_dir: boolean) {
    this.isDirectory = is_dir;
  }

  get isDirectory() {
    return this.is_directory;
  }

  //
  // === isBlockDevice ===
  @obj_specs.decs.meths.enum
  get is_block_device(): boolean {
    if (this._dirent) {
      return this._dirent.isBlockDevice();
    }

    if (this.#_d) {
      return this.isBlockDevice;
    }
  }

  set is_block_device(is_block_dev: boolean) {
    this.isBlockDevice = is_block_dev;
  }

  get isBlockDevice() {
    return this.is_block_device;
  }

  //
  // === isCharacterDevice ===
  @obj_specs.decs.meths.enum
  get is_character_device(): boolean {
    if (this._dirent) {
      return this._dirent.isCharacterDevice();
    }

    if (this.#_d) {
      return this.isCharacterDevice;
    }
  }

  set is_character_device(is_char_dev: boolean) {
    this.isCharacterDevice = is_char_dev;
  }

  get isCharacterDevice() {
    return this.is_character_device;
  }

  //
  // === isSymbolicLink ===
  @obj_specs.decs.meths.enum
  get is_symbolic_link(): boolean {
    if (this._dirent) {
      return this._dirent.isSymbolicLink();
    }

    if (this.#_d) {
      return this.isSymbolicLink;
    }
  }

  set is_symbolic_link(is_symb: boolean) {
    this.isSymbolicLink = is_symb;
  }

  get isSymbolicLink() {
    return this.is_symbolic_link;
  }

  //
  // === isFIFO ===
  @obj_specs.decs.meths.enum
  get is_FIFO(): boolean {
    if (this._dirent) {
      return this._dirent.isFIFO();
    }

    if (this.#_d) {
      return this.isFIFO;
    }
  }

  set is_FIFO(is_fifo: boolean) {
    this.isFIFO = is_fifo;
  }

  get isFIFO() {
    return this.is_FIFO;
  }

  //
  // === isSocket ===
  @obj_specs.decs.meths.enum
  get is_socket(): boolean {
    if (this._dirent) {
      return this._dirent.isSocket();
    }

    if (this.#_d) {
      return this.isSocket;
    }
  }

  set is_socket(is_sock: boolean) {
    this.isSocket = is_sock;
  }

  get isSocket() {
    return this.is_socket;
  }*/
}
