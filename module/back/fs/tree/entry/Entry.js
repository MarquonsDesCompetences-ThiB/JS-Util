var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __p;
import { Dirent, promises as fs_promises } from "fs";
import { join as join_path, sep as os_path_separator } from "path";
import { string } from "../../../../both/types/_types.js";
import { Obj, specs as obj_specs } from "../../../../both/types/obj/_obj.js";
import { get_root_dir_path } from "../../../module/_module.js";
import { split } from "../../path/_path.js";
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
export class Entry extends Obj {
    /**
     * Dirent version to be read from fs
     *
    @obj_specs.decs.props.jsonified
    protected _dirent: Dirent;*/
    constructor(path_or_Dirent_or_obj, obj) {
        super();
        /**
         * Path
         */
        __p.set(this, void 0);
        if (path_or_Dirent_or_obj) {
            //
            // Path
            if (string.is(path_or_Dirent_or_obj)) {
                this.path = path_or_Dirent_or_obj;
            }
            //
            // Dirent
            else if (path_or_Dirent_or_obj instanceof Dirent) {
                this.dirent = path_or_Dirent_or_obj;
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
    // === STATIC ===
    static full_names(files) {
        const names = [];
        files.forEach((file) => {
            names.push(file.full_name);
        });
        return names;
    }
    static full_pathes(files) {
        const pathes = [];
        files.forEach((file) => {
            pathes.push(file.full_path);
        });
        return pathes;
    }
    //
    // === DIRENT / DIRENT_WRITABLE ===
    set dirent(dirent) {
        if (dirent instanceof Dirent) {
            this.isFile = dirent.isFile();
            this.isDirectory = dirent.isDirectory();
            this.isBlockDevice = dirent.isBlockDevice();
            this.isCharacterDevice = dirent.isCharacterDevice();
            this.isSymbolicLink = dirent.isSymbolicLink();
            this.isFIFO = dirent.isFIFO();
            this.isSocket = dirent.isSocket();
        }
        else {
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
    get path() {
        return __classPrivateFieldGet(this, __p);
    }
    set path(path) {
        //
        // Remove forbidden characters from path and set
        {
            /*
                  Keep ':' preceded by a drive letter
                  Keep everything else which is not : * ? " < > |
                
            const formatted = path.match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g).join("");*/
            __classPrivateFieldSet(this, __p, path);
            //
            // No ending slash or backslash
            if (!/(\/|\\)$/.test(__classPrivateFieldGet(this, __p))) {
                __classPrivateFieldSet(this, __p, __classPrivateFieldGet(this, __p) + os_path_separator);
            }
        }
    }
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
    set full_path(full_path) {
        const delimiter = full_path.match(/\\|\//);
        //
        // Set name and this.path
        {
            if (!delimiter) {
                this.full_name = full_path;
                this.path = get_root_dir_path();
            }
            else {
                let last_delimiter = full_path.lastIndexOf(delimiter[0]);
                //
                // Delimiter is the last character
                // => fetch the previous delimiter
                if (last_delimiter === full_path.length - 1) {
                    last_delimiter = full_path.lastIndexOf(delimiter[0], last_delimiter - 1);
                }
                this.full_name = full_path.slice(last_delimiter + delimiter[0].length);
                this.path = full_path.slice(0, last_delimiter);
            }
        }
        //
        //Fetch Dirent
        {
            fs_promises.opendir(this.path).then(async (dir) => {
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
                    }
                    catch (ex) { }
                }
            });
        }
    }
    //
    // === DIRENT INTERFACE ===
    get full_name() {
        const ext = this.ext ? "." + this.ext : "";
        return this.name + ext;
    }
    set full_name(full_name) {
        const splitted = split.full_name(full_name);
        this.name = splitted.name;
        this.ext = splitted.ext;
    }
}
__p = new WeakMap();
__decorate([
    obj_specs.decs.meths.jsonify
], Entry.prototype, "dirent", null);
__decorate([
    obj_specs.decs.meths.enum
], Entry.prototype, "path", null);
__decorate([
    obj_specs.decs.meths.jsonify
], Entry.prototype, "full_path", null);
__decorate([
    obj_specs.decs.meths.jsonify
], Entry.prototype, "full_name", null);
//# sourceMappingURL=Entry.js.map