"use strict";

/**
 * Preconds
 *  global.util.text.Languages
 */

class Localized_Texts extends util.obj.Obj {
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
  static get_text(texts, property_accessor) {
    logger.log = "Localized_Text#get_text ";
    this.log = "get_text ";

    //
    // Check preconds
    {
      if (!texts || !texts.default) {
        const msg = "No texts or texts.default argument";
        this.error = "get_text " + msg;
        throw msg;
      }
    }

    {
      const accessor_parts = util.obj.Json.property_name_to_accessors(
        property_accessor
      );
      this.log = "get_text  accessor_parts " + accessor_parts.join(".");

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
          this.error = "get_text " + msg;
          throw msg;
        }
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
   * @param {object | optional} default_texts Used if text not found in texts
   * @param {object | optional} sub_default_texts Hierarchy where we are
   *                                              in texts in recursive calls
   *                                              => sub_default_texts is
   *                                              a child of default_texts
   *
   */
  static translate(
    obj,
    dest_obj,
    texts,
    sub_texts,
    default_texts = undefined,
    sub_default_texts = undefined
  ) {
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
        if (
          sub_texts[key] == null &&
          (sub_default_texts == null || sub_default_texts[key] == null)
        ) {
          ret.nb_nset++;
          continue;
        }
      }

      //
      // Recursive translate
      {
        if (typeof obj[key] === "object") {
          dest_obj[key] = {};
          const res = Localized_Texts_.translate(
            obj[key],
            dest_obj[key],
            texts,
            sub_texts[key],
            default_texts,
            sub_default_texts != null ? sub_default_texts[key] : undefined
          );

          ret.nb_set += res.nb_set;
          ret.nb_nset += res.nb_nset;
          continue;
        }
      }

      //
      // Translate
      {
        if (util.text.String.is(obj[key])) {
          dest_obj[key] = sub_texts[key]
            ? sub_texts[key]
            : sub_default_texts[key];
          //
          // If not set, key is probably in global values
          {
            if (dest_obj[key] == null) {
              dest_obj[key] = texts[key] ? texts[key] : default_texts[key];
            }
          }

          //
          // Maybe it was not in global values neither
          if (dest_obj[key]) {
            ret.nb_set++;
          } else {
            ret.nb_nset++;

            const msg = "Localized text not found : " + key;
            this.error = "Localized_Text#translate " + msg;
          }

          continue;
        }

        //
        // undefined or null
        {
          let undef_null = false;
          if (typeof obj[key] === "undefined") {
            undef_null = true;
            dest_obj[key] = texts["undefined"]
              ? texts["undefined"]
              : default_texts["undefined"];
          } else if (obj[key] === null) {
            undef_null = true;
            dest_obj[key] = texts["null"]
              ? texts["null"]
              : default_texts["null"];
          }

          if (undef_null) {
            if (dest_obj[key]) {
              ret.nb_nset++;
            } else {
              ret.nb_nset++;

              const msg =
                "Localized text 'undefined' or 'null' not found for : " + key;
              this.error = "Localized_Text#translate " + msg;
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
        this.warn = "Localized_Text#translate " + msg;
      }
    }

    return ret;
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
   *
   * @param {bool} include_not_enumerable_props
   * @param {bool} as_string
   */
  get_JSON(include_not_enumerable_props = true, as_string = false) {
    return super.toJson(include_not_enumerable_props, as_string);
  }

  /**
   *
   * @param {string | optional} language_code If not set, use default language
   * @param {bool} include_default
   *
   * @return {Object} Requested texts
   *                  Return :
   *                    localized {Object} if include_default is true
   *                                        and language_code === default
   *                    default {Object} If include_default = false,
   *                                      requested texts
   *                                      Otherwise, default language texts
   */
  get_texts(language_code = undefined, include_default = false) {
    this.log = "";

    //
    // Check argument
    {
      if (!language_code || language_code === this.default) {
        return {
          default: this.default_texts,
        };
      }

      this.log = "is_language_code ?";
      if (!util.text.Languages.is_language_code(language_code)) {
        default_used = true;
        const msg = "Wrong language code " + language_code;
        this.error = "get_texts " + msg;
        throw msg;
      }
    }

    if (include_default) {
      this.log = "include_default";
      let that = this;
      return {
        localized: that.get_texts(language_code, false),
        default: that.default_texts,
      };
    }
    //
    // else return only texts in language code
    this.log = "not include_default";
    //
    // Load if not yet
    {
      if (this.texts[language_code] == null) {
        this.texts[language_code] = require(process.env.SRC_SROOT +
          "lang/global")(language_code);
      }
    }

    return {
      default: this.texts[language_code],
    };
  }

  //
  // === DEFAULT TEXTS ===
  get default_texts() {
    //
    // Load if not yet
    {
      this.log = "Load default_texts ?";
      if (this._default_texts == null) {
        this.log = "Load default_texts : Yes";
        const that = this;
        Object.defineProperty(this, "_default_texts", {
          value: require(process.env.SRC_ROOT + "lang/global")(that.default),
          enumerable: true,
          writable: false,
          configurable: false,
        });
      }
    }

    return this._default_texts;
  }

  /**
   * Example :
   *  new Localized_Texts().
   * @param {[3]} arr Array with 3 elements :
   *                      - {string} language code to fetch,
   *                      - {Object} values to fetch (property names)
   *                                  and replace (final string value)
   *                      - {function} Callback to call with results
   *                          2 params :
   *                              - localized texts
   *                              - localized results {Object} :
   *                                  - nb_set [integer]
   *                                  - nb_nset [integer]
   *
   * @throws -  If one of array's elements is missing
   *          - If one of array's elements is a wrong type
   */
  set get(arr) {
    //
    // Check preconds
    {
      if (!(arr instanceof Array)) {
        const msg =
          "Wrong set argument ; should be an array (type : " + typeof arr + ")";
        this.error = "set get " + msg;
        throw msg;
      }

      if (arr.length < 3) {
        const msg =
          "Wrong number of element in argument ; 3 are expected but received only " +
          arr.length;
        this.error = "set get " + msg;
        throw msg;
      }

      if (!(arr[1] instanceof Object)) {
        const msg =
          "Wrong element 1 in argument ; should be an object. Type : " +
          typeof arr[1];
        this.error = "set get " + msg;
        throw msg;
      }

      if (typeof arr[2] !== "function") {
        const msg =
          "Wrong element 2 in argument ; should be a callback method. Type : " +
          typeof arr[2];
        this.error = "set get " + msg;
        throw msg;
      }
    }

    {
      //
      // Fetch requested language
      let texts;
      try {
        texts = this.get_texts(arr[0]);
      } catch (ex) {
        //
        // Wrong language code => default will be used and inform
        const msg = "Wrong language code " + lang + " ; default will be used";
        this.error = "set get " + msg;
      }

      //
      // Iterate obj to replace values
      {
        let localized = {};

        const res = Localized_Texts_.translate(
          arr[1],
          localized,
          //if no texts, use default
          texts ? texts : this.default_texts,
          texts ? texts : this.default_texts, //subtexts
          //if no texts, default already used
          texts ? this.default_texts : undefined,
          texts ? this.default_texts : undefined //sub_default_texts
        );

        arr[2](localized, res);
      }
    }
  }
}
Localized_Texts.init(require("./Localized_Texts_properties"), module);
