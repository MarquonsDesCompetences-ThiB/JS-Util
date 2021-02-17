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
var __cntnt_bj;
import { File } from "../_files.js";
export class Json_File_props extends File {
    constructor() {
        super(...arguments);
        //
        // === CONTENT ===
        /**
         * Content as a json (object)
         */
        __cntnt_bj.set(this, void 0);
    }
    get content() {
        return __classPrivateFieldGet(this, __cntnt_bj);
    }
    set content(content) {
        __classPrivateFieldSet(this, __cntnt_bj, content);
    }
    //
    // === CONTENT ===
    /**
     * Return the number of items in files (if read)
     * Can be a number of :
     * objects (json files)
     */
    get nb() {
        //
        {
            if (__classPrivateFieldGet(this, __cntnt_bj)) {
                return Object.keys(__classPrivateFieldGet(this, __cntnt_bj)).length;
            }
        }
        throw ReferenceError("File not read");
    }
}
__cntnt_bj = new WeakMap();
//# sourceMappingURL=Json_File_props.js.map