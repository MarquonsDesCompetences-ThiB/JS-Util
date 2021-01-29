"use strict";

class Languages {
  static codes_languages = require("./language_codes");
  static codes_countries = require("./country_codes");

  //
  // Init by constructor
  // reverse of codes_languages
  static languages_codes = {};
  // reverse of codes_countries
  static countries_codes = {};

  static get singleton() {
    if (Languages.singleton) {
      return Languages.singleton;
    }

    Languages.singleton = new Languages_();
    return Languages.singleton;
  }

  static get_dom_select(select_id, select_name) {
    let select = $(
      "<select id='" + select_id + "' name='" + select_name + "'></select>"
    );

    for (const lg_code in Languages.codes_languages) {
      const opt = $(
        "<option value='" +
          lg_code +
          "'>" +
          Languages.codes_languages[lg_code] +
          "</option>"
      );
      select.append(opt);
    }

    return select;
  }

  //
  // === GETTERS ===
  static get_country(country_code) {
    return Languages.codes_countries[country_code];
  }

  static get_country_code(country) {
    return Languages.countries_codes[country];
  }

  static get_language(lang_code) {
    return Languages.codes_languages[lang_code];
  }

  static get_language_code(language) {
    return Languages.languages_codes[language];
  }

  //
  // === IS ... ===
  static is_country(country) {
    return Languages.countries_codes[country] != null;
  }

  static is_country_code(country_code) {
    return Languages.codes_countries[country_code] != null;
  }

  static is_language(language) {
    return Languages.languages_codes[language] != null;
  }

  static is_language_code(lang_code) {
    Obj_Errors.log = "Languages#is_language_code";
    return Languages.codes_languages[lang_code] != null;
  }

  constructor() {
    for (const code in Languages.codes_languages) {
      Languages.languages_codes[Languages.codes_languages[code]] = code;
    }

    for (const code in Languages.codes_countries) {
      Languages.countries_codes[Languages.codes_countries[code]] = code;
    }
  }
}

util.obj.Obj.export(module, Languages);
