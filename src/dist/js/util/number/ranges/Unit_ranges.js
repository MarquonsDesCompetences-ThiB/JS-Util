"use strict";

if (typeof process !== "undefined") {
  global.Range = require(process.env.SRC_ROOT + "js/util/ranges/Range");
}

class Unit_ranges {
  static units = ["no", "d", "g", "m", "p", "q"];
  static units_meaning = [
    "Quellequesoit l'unité",
    "dimension",
    "gramme",
    "mètre",
    "pièce",
    "quantité",
  ];

  constructor(obj = {}) {
    this.unit = obj.unit;

    if (typeof this.ranges === "Array") {
      //Range[] already initialized
      this.ranges = obj.ranges;
    } else {
      //init each Range
      this.ranges = [];
      for (let i = 0; i < obj.ranges; i++) {
        this.ranges.push(new Range(obj.ranges[i]));
      }
    }
  }

  get_JSON() {
    let ret = {
      unit: this.unit,
      ranges: [],
    };

    for (let i = 0; i < this.ranges.length; i++) {
      ret.ranges.push(this.ranges[i].get_JSON());
    }

    return ret;
  }

  static get_unit(unit_str) {
    const unit = this.units.indexOf(unit_str);
    if (unit < 0) {
      logger.warn(
        "Unit_ranges#get_unit Unknown unit " +
          unit_str +
          '; returning "no units" value'
      );
      return this.units.indexOf("no");
    }
    return unit;
  }

  static get_unit_str(unit_number) {
    if (unit_number < 0 || unit_number >= Unit_ranges.units.length) {
      logger.error(
        "Unit_ranges#get_unit_str Unexisting units value : " +
          unit_number +
          ". Should be in [0;" +
          Unit_ranges.units.length +
          "["
      );
      return "Unknown unit";
    }
    return Unit_ranges.units[unit_number];
  }

  /**
   * Return the specified unit in a meaningful expression
   * @param {*} unit_number
   */
  static get_unit_meaning(unit_number) {
    if (unit_number < 0 || unit_number >= Unit_ranges.units_meaning.length) {
      logger.warn(
        "Unit_ranges#get_unit_meaning Unexisting unit " + unit_number
      );
      return "Droit inexistant";
    }

    return Unit_ranges.units_meaning[unit_number];
  }
}

module.exports = Unit_ranges;
