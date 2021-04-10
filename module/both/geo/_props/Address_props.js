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
var __nm, __nmbr, __ddrss, __ddrss2, __zp_cd, __ct, __cntr, __lctn;
import { form_identity } from "../../../front/form/form_identity.js";
import { obj, string } from "../../types/_types.js";
import { address } from "../Address_statics.js";
import { Location } from "../Location.js";
export class Address_props extends obj.Obj {
    constructor() {
        super(...arguments);
        __nm.set(this, void 0);
        __nmbr.set(this, void 0);
        __ddrss.set(this, void 0);
        __ddrss2.set(this, void 0);
        __zp_cd.set(this, void 0);
        __ct.set(this, void 0);
        __cntr.set(this, void 0);
        //
        // {Location}
        __lctn.set(this, void 0);
    }
    get name() {
        if (!this.name) {
            throw "undefined";
        }
        return __classPrivateFieldGet(this, __nm);
    }
    set name(name) {
        if (!name || name.length == 0) {
            throw "empty";
        }
        if (name.length > form_identity.maxlengthes.name) {
            logger.warn =
                "Address#set name Too long name : " + name.length + " (" + name + ")";
            throw "too_long";
        }
        __classPrivateFieldSet(this, __nm, name);
    }
    get number() {
        return __classPrivateFieldGet(this, __nmbr);
    }
    set number(number) {
        //
        // Empty
        {
            if (!number || number.length == 0) {
                throw "empty";
            }
        }
        {
            if (!new RegExp(address.regex.number).test(decodeURI(number))) {
                const nb_chars = number.length - string.count_utf8_characters(number) * 2;
                if (nb_chars > address.lengthes.number.max) {
                    throw "too_long";
                }
                // else
                throw "wrong_format";
            }
        }
        __classPrivateFieldSet(this, __nmbr, number);
    }
    get address() {
        return __classPrivateFieldGet(this, __ddrss);
    }
    set address(address) {
        if (!address || address.length == 0) {
            throw "empty";
        }
        if (address.length >= form_identity.maxlengthes.address) {
            logger.warn =
                "Address#set address Too long address : " +
                    address.length +
                    " (" +
                    address +
                    ")";
            throw "too_long";
        }
        __classPrivateFieldSet(this, __ddrss, address);
    }
    get address2() {
        return __classPrivateFieldGet(this, __ddrss2);
    }
    set address2(address) {
        if (!address || address.length == 0) {
            throw "empty";
        }
        if (address.length >= form_identity.maxlengthes.address) {
            logger.warn =
                "Address#set address Too long address : " +
                    address.length +
                    " (" +
                    address +
                    ")";
            throw "too_long";
        }
        __classPrivateFieldSet(this, __ddrss2, address);
    }
    get zip_code() {
        return __classPrivateFieldGet(this, __zp_cd);
    }
    set zip_code(zip) {
        // TODO regex
        __classPrivateFieldSet(this, __zp_cd, zip);
    }
    get city() {
        return __classPrivateFieldGet(this, __ct);
    }
    set city(city) {
        if (!city || city.length == 0) {
            throw "empty";
        }
        if (city.length >= form_identity.maxlengthes.city) {
            logger.warn =
                "Address#set city Too long city : " + city.length + " (" + city + ")";
            throw "too_long";
        }
        __classPrivateFieldSet(this, __ct, city);
    }
    get country() {
        return __classPrivateFieldGet(this, __cntr);
    }
    set country(country) {
        if (!country || country.length == 0) {
            throw "empty";
        }
        if (country.length >= form_identity.maxlengthes.country) {
            logger.warn =
                "Address#set country Too long country : " +
                    country.length +
                    " (" +
                    country +
                    ")";
            throw "too_long";
        }
        __classPrivateFieldSet(this, __cntr, country);
    }
    get location() {
        return __classPrivateFieldGet(this, __lctn);
    }
    set location(location) {
        if (typeof location !== "object") {
            throw "wrong_format";
        }
        if (location instanceof Location) {
            __classPrivateFieldSet(this, __lctn, location);
        }
        else {
            __classPrivateFieldSet(this, __lctn, new Location(location));
        }
    }
    //
    // === GETTERS / SETTERS of SUB-PROPERTIES ===
    get lat() {
        if (!this.location) {
            return undefined;
        }
        return this.location.lat;
    }
    get lng() {
        if (!this.location) {
            return undefined;
        }
        return this.location.lng;
    }
}
__nm = new WeakMap(), __nmbr = new WeakMap(), __ddrss = new WeakMap(), __ddrss2 = new WeakMap(), __zp_cd = new WeakMap(), __ct = new WeakMap(), __cntr = new WeakMap(), __lctn = new WeakMap();
//# sourceMappingURL=Address_props.js.map