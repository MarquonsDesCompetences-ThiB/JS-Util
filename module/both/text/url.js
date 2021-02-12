"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _crypt;
import { Crypt } from "./Crypt.js";
export class Url {
    constructor(pwd, iv) {
        /**
         * Pwd and iv specified to enable the endpoint to restart
         *                                /the user to change endpoint
         */
        _crypt.set(this, void 0);
        __classPrivateFieldSet(this, _crypt, new Crypt(pwd, iv));
    }
    /**
     *
     * @param {string} url
     *
     * @return {string} Encrypted url
     */
    encrypt(url) {
        return __classPrivateFieldGet(this, _crypt).encrypt(url).encrypted;
    }
    decrypt(encrypted_url) {
        return __classPrivateFieldGet(this, _crypt).decrypt(encrypted_url);
    }
}
_crypt = new WeakMap();
//# sourceMappingURL=Url.js.map