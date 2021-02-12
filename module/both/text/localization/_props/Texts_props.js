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
var __nt_ccssr;
import { json, obj } from "../../../_both";
import { Languages } from "../../Languages.js";
import { default_lang, texts_dir } from "../localization.js";
import fs_extra from "fs-extra";
const { pathExistsSync } = fs_extra;
import { file } from "../../../../back/_back";
import { ELanguage_Code } from "../../language_codes.js";
export class Texts_props extends obj.Obj {
    constructor(accessor) {
        super();
        /**
         * Accessor to useful resources
         * Used when adding language to keep only interesting texts
         */
        __nt_ccssr.set(this, []);
        /**
         * {Object}
         * Localized texts by language_code
         */
        this.texts = {};
        if (accessor) {
            this.init_accessor = accessor;
        }
        this.add_lang(); //add default language
    }
    get init_accessor() {
        return __classPrivateFieldGet(this, __nt_ccssr);
    }
    set init_accessor(accessor) {
        if (!(accessor instanceof Array)) {
            __classPrivateFieldSet(this, __nt_ccssr, json.accessor_to_property_names(accessor));
        }
        else {
            __classPrivateFieldSet(this, __nt_ccssr, accessor);
        }
    }
    add_lang(lang_id = default_lang) {
        if (!Languages.is_language_code(lang_id)) {
            logger.error = "Wrong language code " + lang_id + ";";
            return;
        }
        const path = this.get_path(lang_id);
        this.texts[lang_id] = file.read_dir_files_json(path);
        //
        // Keep only useful texts in memory
        this.texts[lang_id] = json.get_reference(this.texts[lang_id], __classPrivateFieldGet(this, __nt_ccssr));
    }
    get_path(lang_id = default_lang) {
        const lang_code = ELanguage_Code[lang_id];
        const path = texts_dir + lang_code + "/";
        //
        // No resources for the requested language
        // => use default
        {
            if (!pathExistsSync(path)) {
                logger.error =
                    "No directory for language " +
                        lang_id +
                        " (" +
                        lang_code +
                        "); returning default";
                return this.get_path();
            }
        }
        return path;
    }
}
__nt_ccssr = new WeakMap();
//# sourceMappingURL=Texts_props.js.map