"use strict";

/**
 *
 */
class Language {
  static codes = ["en", "fr"];
  static names = ["English", "Français"];
  static default_lang_id = Language.indexOf("fr");

  /**
   *
   * @param {string} code
   *
   * @return number The index of code in Language.codes
   *            If wrong code, the default language id
   */
  static get_id(code) {
    const idx = Language.indexOf(code);
    if (idx >= 0) {
      return idx;
    }

    logger.warn(
      "Language#get_id Unknown language code : " +
        code +
        " ; return default language id instead"
    );
    return Language.default_lang_id;
  }

  /**
   *
   * @param {number} id
   *
   * @return string The code at index id in Language.codes
   *                If wrong id, the default language id
   */
  static get_code(id) {
    if (id < 0 || id >= Language.length) {
      logger.warn(
        "Language#get_id Unknown language id : " +
          id +
          " ; return default language code instead"
      );
      return Language.codes[Language.default_lang_id];
    }

    return Language.codes[id];
  }

  static construct_DOM_select(
    select_id_prefix = "",
    option_values_prefix = ""
  ) {
    const select_str = "<select id='" + select_id_prefix + "lang'></select>";
    let select = $(select_str);

    for (let i = 0; i < Language.codes.length; i++) {
      let option = Language.construct_DOM_option(i);
      if (option) {
        select.append(option);
      }
    }

    return select;
  }

  static construct_DOM_option(lang_id, option_value_prefix = "") {
    const lang_code = Language.codes[lang_id];
    const lang_name = Language.names[lang_id];

    //
    // Check arguments
    {
      //
      // Language code
      if (lang_code === undefined) {
        logger.error(
          "Language#construct_DOM_option Language id " +
            lang_id +
            " has no associated code"
        );
        return undefined;
      }

      //
      // Language name
      if (lang_name === undefined) {
        logger.error(
          "Language#construct_DOM_option Language id " +
            lang_id +
            " has no associated name"
        );
        return undefined;
      }
    }

    const opt_str =
      "<option name='" +
      option_value_prefix +
      lang_code +
      "'>" +
      lang_name +
      "</option>";

    return $(opt_str);
  }
}
