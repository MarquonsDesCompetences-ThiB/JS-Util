"use strict";
import { json } from "@type/_types.js";
import { file } from "@src/back/_back.js";
import { default_lang } from "./localization.js";
import * as string from "../../types/string.js";
import { Texts_props } from "./_props/Texts_props.js";
import fs_extra from "fs-extra";
const { pathExistsSync, readJsonSync } = fs_extra;
import { ELanguage_Code } from "../language_codes.js";

export class Texts extends Texts_props {
  /**
   * Add the requested texts to dest_obj
   *
   * @param dest_obj Object which receives texts
   *
   * @return dest_obj
   */
  add_texts(
    dest_obj: any,
    accessors?: string | (string | number)[],
    lang_id?: ELanguage_Code
  ): any {
    Object.assign(dest_obj, this.get(accessors, lang_id));
    return dest_obj;
  }

  /**
   * Add the texts requested from multiple resources
   * to dest_obj
   *
   * @param dest_obj Object which receives texts
   *
   * @return dest_obj
   */
  add_texts_multi(
    dest_obj: any,
    accessors?: string[][],
    lang_id?: ELanguage_Code
  ): any {
    Object.assign(dest_obj, this.get_multi(accessors, lang_id));
    return dest_obj;
  }

  /**
   * Return multiple texts resources from this.texts
   *
   * @param accessors Every values to fetch
   *                  Every element of array must be an array with :
   *                    0: Property name to store fetched texts
   *                       in the returned object
   *                    1...: Optional Accessors; if not set, value
   *                          a index 0 is used
   */
  get_multi(accessors: string[][], lang_id?: ELanguage_Code): any {
    const texts = {};

    accessors.forEach((access_request) => {
      const prop_name = access_request[0];
      let access;
      if (access_request.length > 1) {
        access = access_request.slice(1, access_request.length);
      }
      texts[prop_name] = this.get(access, lang_id);
    });

    return texts;
  }

  /**
   * Return the requested texts from this.texts
   *
   * @param accessors
   */
  get(
    accessors?: string | (string | number)[],
    lang_id: ELanguage_Code = default_lang
  ): any {
    //
    //
    {
      if (!this.texts[lang_id]) {
        logger.warn =
          "No texts loaded for requested language " +
          lang_id +
          " ; returning texts from default language : " +
          default_lang;
        return this.get(accessors);
      }
    }

    //
    // Must return all texts resources
    {
      if (!accessors) {
        return this.texts[lang_id];
      }
    }

    let access_arr: (string | number)[];
    {
      if (!(accessors instanceof Array)) {
        access_arr = json.get_accessor_parts(accessors);
      } else {
        access_arr = accessors;
      }

      //
      // Reach the last requested acessor
      let texts = this.texts[lang_id];
      const nb_accessors = access_arr.length;
      for (let access_idx = 0; access_idx < nb_accessors; access_idx++) {
        const prop_name = access_arr[access_idx];
        if (!texts[prop_name]) {
          const msg =
            "Property " +
            prop_name +
            " does not exist " +
            " (requested with language " +
            lang_id +
            " and accessor " +
            access_arr.join(".") +
            ")";
          logger.error = msg;
          throw ReferenceError(msg);
        }

        texts = texts[prop_name];
      }

      return texts;
    }
  }

  /**
   * Return the requested texts reading files
   *
   * @param accessors
   */
  get_reading_fs(
    accessors?: string | (string | number)[],
    lang_id: ELanguage_Code = default_lang
  ) {
    //
    // Must return all texts resources
    {
      if (!accessors) {
        return this.texts[lang_id];
      }
    }

    let access_arr: (string | number)[];
    {
      if (!(accessors instanceof Array)) {
        access_arr = json.get_accessor_parts(accessors);
      } else {
        access_arr = accessors;
      }
    }

    //
    // Fetch final directory from accessors
    let access_idx = 0;
    const nb_accessors = access_arr.length;
    {
      let exists = true;
      let path = this.get_path(lang_id);
      while (access_idx < nb_accessors && exists) {
        {
          if (path[path.length - 1] !== "/") {
            path += "/";
          }
          path += access_arr[access_idx];
        }

        exists = pathExistsSync(path);

        access_idx++;
      }

      {
        //
        // Full accessors are a path
        if (exists) {
          //
          // Full accessors is a directory => return all files content
          if (file.is_directory(path)) {
            return file.read_dir_files_json(path);
          }
          //
          // else path is a file => return its content
          return readJsonSync(path);
        }
        //
        // Else not exist : accessors_idx-1 is a file's property name
        //
        // If accessors_idx-1 is a directory -> error, should be a file
        if (file.is_directory(path)) {
          const unexisting_access_idx = access_idx - 1;
          const msg =
            "File " +
            access_arr[unexisting_access_idx] +
            " does not exit in directory " +
            access_arr.slice(0, unexisting_access_idx).join("/");
          logger.error = msg;
          throw ReferenceError(msg);
        }
        //
        // Else accessors_idx-1 is a file
        let content = readJsonSync(path);
        //
        // Reach the last requested acessor
        while (access_idx < nb_accessors) {
          const prop_name = access_arr[access_idx];
          if (!content[prop_name]) {
            const msg =
              "Property " +
              prop_name +
              " does not exist in file " +
              path +
              " (requested with accessor " +
              access_arr.join(".") +
              ")";
            logger.error = msg;
            throw ReferenceError(msg);
          }

          content = content[prop_name];
          access_idx++;
        }

        return content;
      }
    }
  }

  /**
   *
   * @param {object} texts With properties :
   *                        - default {object} Used to fetch text if localized is not set
   *                        - localized {object}
   *
   * @param {string} property_accessor Property accessor
   *                                    Ex. :
   *                                      property.subprop.subprop2
   *                                      property[4].subprop
   *
   * @return {*} Value pointed by property_accessor
   *                  from texts.default if any,
   *                  otherwise from texts.localized
   */
  static get_text(texts, property_accessor: string | (string | number)[]) {
    logger.log = "Localized_Text#get_text ";
    logger.log = "get_text ";

    //
    // Check preconds
    {
      if (!texts || !texts.default) {
        const msg = "No texts or texts.default argument";
        logger.error = "get_text " + msg;
        throw msg;
      }
    }

    {
      const accessor_parts = json.get_accessor_parts(property_accessor);
      logger.log = "get_text  accessor_parts " + accessor_parts.join(".");

      //
      // Fetch from texts.localized if any
      {
        if (texts.localized) {
          let text = texts.localized;
          for (let i = 0; i < accessor_parts.length && text; i++) {
            text = text[accessor_parts[i]];
          }

          //
          // text found in localized texts
          if (text) {
            return text;
          }
        }
      }

      //
      // Fetch from texts.default
      {
        let text = texts.default;
        let i = 0;
        for (; i < accessor_parts.length && text; i++) {
          text = text[accessor_parts[i]];
        }

        //
        // text found in default texts
        if (text) {
          return text;
        }
        //
        // else an accessor part is undefined => error
        {
          const msg =
            accessor_parts[i - 1] +
            " from " +
            property_accessor +
            " is undefined in texts.default";
          logger.error = "get_text " + msg;
          throw msg;
        }
      }
    }
  }

  /**
   *
   * Parameters are for this.set
   * @param {*} obj
   */
  constructor(obj = undefined) {
    super(obj);
  }

  /**
   * Replace texts
   *
   * @param to_replace values to fetch (property names)
   *                   and replace (final string value)
   * @param accessors optional Accessors to texts files
   *                            If not set, look for translations
   *                            in all language's resources files
   *
   * @return Object with 2 properties :
   *                              - texts : localized texts
   *                              - res : results {Object} :
   *                                  - nb_set [integer]
   *                                  - nb_nset [integer]
   * Example :
   *  new Localized_Texts().
   * @param {[3]} arr Array with 3 elements :
   *                      - {string} language code to fetch,
   *                      - {Object}
   *                      - {function} Callback to call with results
   *
   *
   * @throws -  If one of array's elements is missing
   *          - If one of array's elements is a wrong type
   */
  replace(to_replace: any, accessors?: string | (number | string)[]): any {
    const texts_resources = this.get(accessors);

    //
    // Iterate obj to replace values
    {
      let texts = {}; //translated texts

      const res = translate(
        to_replace,
        texts,
        texts_resources,
        texts_resources
      );

      return {
        texts,
        res,
      };
    }
  }
}

/**
 *
 * @param {object} obj
 * @param {object} dest_obj
 * @param {object} texts First hierarchy of texts in desired language
 * @param {object} sub_texts Hierarchy where we are in texts
 *                              in recursive calls
 *                              => sub_texts is a child of texts
 *
 *
 */
function translate(obj, dest_obj, texts, sub_texts) {
  let ret = {
    nb_set: 0,
    nb_nset: 0,
  };

  //
  // Iterate keys to translate them
  for (const key in obj) {
    //
    // No localized text
    {
      if (sub_texts[key] == null) {
        ret.nb_nset++;
        continue;
      }
    }

    //
    // Recursive translate
    {
      if (typeof obj[key] === "object") {
        dest_obj[key] = {};
        const res = translate(obj[key], dest_obj[key], texts, sub_texts[key]);

        ret.nb_set += res.nb_set;
        ret.nb_nset += res.nb_nset;
        continue;
      }
    }

    //
    // Translate
    {
      if (string.is(obj[key])) {
        dest_obj[key] = sub_texts[key];
        //
        // If not set, key is probably in global values
        {
          if (dest_obj[key] == null) {
            dest_obj[key] = texts[key];
          }
        }

        //
        // Maybe it was not in global values neither
        if (dest_obj[key]) {
          ret.nb_set++;
        } else {
          ret.nb_nset++;

          const msg = "Localized text not found : " + key;
          logger.error = msg;
        }

        continue;
      }

      //
      // undefined or null
      {
        let undef_null = false;
        if (typeof obj[key] === "undefined") {
          undef_null = true;
          dest_obj[key] = texts["undefined"];
        } else if (obj[key] === null) {
          undef_null = true;
          dest_obj[key] = texts["null"];
        }

        if (undef_null) {
          if (dest_obj[key]) {
            ret.nb_nset++;
          } else {
            ret.nb_nset++;

            const msg =
              "Localized text 'undefined' or 'null' not found for : " + key;
            logger.error = msg;
          }
          continue;
        }
      }
    }

    //
    // Not translated
    {
      ret.nb_nset++;

      const msg = "Value not a text : " + key + " (" + typeof obj[key] + ")";
      logger.warn = msg;
    }
  }

  return ret;
}
