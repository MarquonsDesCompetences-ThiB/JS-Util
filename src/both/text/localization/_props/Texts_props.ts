"use strict";
import fs_extra from "fs-extra";
const { pathExistsSync } = fs_extra;
import { file } from "@back/_back.js";
import { json, obj } from "@both_types/_types.js";

import { Languages } from "../../Languages.js";
import { default_lang, texts_dir } from "../config.js";
import { ELanguage_Code } from "../../language_codes.js";

export abstract class Texts_props extends obj.Obj {
  constructor(accessor?: string | (string | number)[]) {
    super();
    if (accessor) {
      this.init_accessor = accessor;
    }

    this.add_lang(); //add default language
  }

  /**
   * Accessor to useful resources
   * Used when adding language to keep only interesting texts
   */
  #_nt_ccssr: (string | number)[] = [];

  get init_accessor() {
    return this.#_nt_ccssr;
  }

  set init_accessor(accessor: string | (string | number)[]) {
    if (!(accessor instanceof Array)) {
      this.#_nt_ccssr = json.accessor_to_property_names(accessor);
    } else {
      this.#_nt_ccssr = accessor;
    }
  }

  /**
   * {Object}
   * Localized texts by language_code
   */
  protected texts = {};

  add_lang(lang_id: ELanguage_Code = default_lang) {
    if (!Languages.is_language_code(lang_id)) {
      logger.error = "Wrong language code " + lang_id + ";";
      return;
    }

    const path = this.get_path(lang_id);
    this.texts[lang_id] = file.read_dir_files_json(path);

    //
    // Keep only useful texts in memory
    this.texts[lang_id] = json.get_reference(
      this.texts[lang_id],
      this.#_nt_ccssr //init accessor
    );
  }

  get_path(lang_id: ELanguage_Code = default_lang) {
    const lang_code: string = ELanguage_Code[lang_id];
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
