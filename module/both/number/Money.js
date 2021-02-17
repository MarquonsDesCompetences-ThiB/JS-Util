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
var __mnt;
import { obj } from "../_both.js";
export class Money extends obj.Obj {
    constructor(obj = undefined) {
        super(obj);
        /**
         * Amount
         */
        __mnt.set(this, void 0);
    }
    get amount() {
        return __classPrivateFieldGet(this, __mnt);
    }
    set amount(amount) {
        __classPrivateFieldSet(this, __mnt, amount);
    }
    get_amount(currency) {
        if (currency !== this.currency) {
            return 0;
        }
        return __classPrivateFieldGet(this, __mnt);
    }
}
__mnt = new WeakMap();
//# sourceMappingURL=Money.js.map