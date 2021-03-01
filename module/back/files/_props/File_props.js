"use strict";
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
var __cntnt_2rr, __cntnt_str, __xt, __n, __p;
import { obj, text } from "../../../both/_both.js";
import { sep as os_path_separator } from "path";
import { specs as obj_specs } from "../../../both/obj/_obj.js";
export class File_props extends obj.Obj {
    constructor() {
        super(...arguments);
        //
        // === CONTENT ===
        /**
         * Content as an 2 dimensionals array
         */
        __cntnt_2rr.set(this, void 0);
        /**
         * Content as a string
         */
        __cntnt_str.set(this, void 0);
        /**
         * === File EXTENSION ===
         * Without dot
         */
        __xt.set(this, void 0);
        /**
         * === File NAME ===
         */
        __n.set(this, void 0);
        /**
         * === File PATH ===
         * Ending backslash is added
         * if ending slash/backslash's missing
         */
        __p.set(this, void 0);
    }
    get content() {
        if (__classPrivateFieldGet(this, __cntnt_2rr)) {
            return __classPrivateFieldGet(this, __cntnt_2rr);
        }
        return __classPrivateFieldGet(this, __cntnt_str);
    }
    set content(content) {
        if (content) {
            __classPrivateFieldSet(this, __cntnt_str, content);
            return;
        }
        if (content instanceof Array) {
            __classPrivateFieldSet(this, __cntnt_2rr, content);
            return;
        }
    }
    get ext() {
        return __classPrivateFieldGet(this, __xt);
    }
    set ext(ext) {
        //
        // Remove forbidden characters from name and set
        {
            const formatted = ext.match(/[^:\*\?"<>\|]/g).join("");
            // remove eventual starting dot and spaces
            __classPrivateFieldSet(this, __xt, formatted.replace(/^\s*\.\s*/, ""));
        }
    }
    /**
     * === Full name : name + .ext ===
     */
    get full_name() {
        return this.name + (this.ext != null ? "." + this.ext : "");
    }
    /**
     * Parse the specified name to split name and extension
     */
    set full_name(full_name) {
        const last_dot_idx = full_name.lastIndexOf(".");
        if (last_dot_idx < 0) {
            __classPrivateFieldSet(this, __n, full_name);
            return;
        }
        __classPrivateFieldSet(this, __n, full_name.slice(0, last_dot_idx));
        __classPrivateFieldSet(this, __xt, full_name.slice(last_dot_idx));
    }
    /**
     * === Full path : full_name + path ===
     */
    get full_path() {
        return this.path + this.full_name;
    }
    /**
     * Parse the specified path to split directories path,
     * file's name and extension
     */
    set full_path(full_path) {
        const last_delimiter_idx = full_path.search(/\\|\/(?=.+\\|\/)/);
        if (last_delimiter_idx < 0) {
            __classPrivateFieldSet(this, __p, full_path);
            return;
        }
        __classPrivateFieldSet(this, __p, full_path.slice(0, last_delimiter_idx + 1));
        this.full_name = full_path.slice(last_delimiter_idx + 1);
    }
    get name() {
        return __classPrivateFieldGet(this, __n);
    }
    set name(name) {
        //
        // Remove forbidden characters from name and set
        {
            const formatted = name.match(/[^:\*\?"<>\|]/g).join("");
            __classPrivateFieldSet(this, __n, formatted);
        }
    }
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
                */
            const formatted = path.match(/(?<=[A-Z]):|[^:\*\?"\<\>\|]/g).join("");
            __classPrivateFieldSet(this, __p, formatted);
            //
            // No ending slash or backslash
            if (!/(\/|\\)$/.test(__classPrivateFieldGet(this, __p))) {
                __classPrivateFieldSet(this, __p, __classPrivateFieldGet(this, __p) + os_path_separator);
            }
        }
    }
    //
    // === CONTENT ===
    /**
     * Return the number of items in files (if read)
     * Can be a number of :
     * objects (json files),
     * characters (string files),
     * rows (excel file or converted to array)
     */
    get nb() {
        //
        // If set
        {
            const symb = Symbol.for("_nb_rws");
            if (!this[symb] != null) {
                return this[symb];
            }
        }
        //
        // If must be computed
        {
            if (text.string.is(this.content) || this.content instanceof Array) {
                return this.content.length;
            }
            if (typeof this.content === "object") {
                return Object.values(this.content).length;
            }
            const msg = "Wrong content type for file " +
                this.name +
                ". Expected string, array or object";
            logger.error = msg;
            throw TypeError(msg);
        }
    }
    set nb(nb) {
        const symb = Symbol.for("_nb_rws");
        {
            if (this[symb] == null) {
                this.define_property(symb, {
                    writable: true,
                    enumerable: false,
                    configurable: false,
                });
            }
        }
        this[symb] = nb;
    }
}
__cntnt_2rr = new WeakMap(), __cntnt_str = new WeakMap(), __xt = new WeakMap(), __n = new WeakMap(), __p = new WeakMap();
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "content", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "ext", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "full_name", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "full_path", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "name", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "path", null);
__decorate([
    obj_specs.decs.meths.enum
], File_props.prototype, "nb", null);
//# sourceMappingURL=File_props.js.map