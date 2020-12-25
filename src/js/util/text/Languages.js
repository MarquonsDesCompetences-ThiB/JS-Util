"use strict";

class Languages {
  static singleton = null;

  static codes = require("./language_codes");

  // init by constructor
  static codes_list = [];

  static create_dom_select(select_id, select_name) {
    let select = $(
      "<select id='" + select_id + "' name='" + select_name + "'></select>"
    );

    for (const lg_code in Languages.codes) {
      const opt = $(
        "<option value='" +
          lg_code +
          "'>" +
          Languages.codes[lg_code] +
          "</option>"
      );
      select.append(opt);
    }

    return select;
  }

  static get() {
    if (Languages.singleton) {
      return Languages.singleton;
    }

    Languages.singleton = new Languages();
    return Languages.singleton;
  }

  constructor() {
    for (let code in Languages.codes) {
      codes_list.push(code);
    }
  }
}

module.exports = Languages;
