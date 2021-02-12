"use strict";
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
var __cntnt_2rr, __cntnt_str, __cntnt_bj, __xt, __n, __p;
import { obj, text } from "../../../both/_both";
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
         * Content as a json (object)
         */
        __cntnt_bj.set(this, void 0);
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
        if (__classPrivateFieldGet(this, __cntnt_bj)) {
            return __classPrivateFieldGet(this, __cntnt_bj);
        }
        return __classPrivateFieldGet(this, __cntnt_str);
    }
    set content(content) {
        if (text.string.is(content)) {
            __classPrivateFieldSet(this, __cntnt_str, content);
            return;
        }
        if (content instanceof Array) {
            __classPrivateFieldSet(this, __cntnt_2rr, content);
            return;
        }
        __classPrivateFieldSet(this, __cntnt_bj, content);
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
     * === Full path : full_name + path ===
     */
    get full_path() {
        return this.path + this.full_name;
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
                __classPrivateFieldSet(this, __p, __classPrivateFieldGet(this, __p) + "\\");
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
__cntnt_2rr = new WeakMap(), __cntnt_str = new WeakMap(), __cntnt_bj = new WeakMap(), __xt = new WeakMap(), __n = new WeakMap(), __p = new WeakMap();
//# sourceMappingURL=File_props.js.map