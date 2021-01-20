"use strict";

if (typeof process !== "undefined") {
  if (!global.util) {
    global.util = {};
  }

  global.util.Number = require(process.env.SRC_ROOT +
    "dist/js/util/number/Number");
  global.Obj = require(process.env.SRC_ROOT + "dist/js/util/Obj");
  global.util.String = require(process.env.SRC_ROOT +
    "dist/js/util/texts/String");
}

class Price extends Obj {
  static units = ["DOL", "EUR"];

  constructor(obj = undefined) {
    super();

    this.unit = null; //number : index from Price.units
    this.value = null; //float
    this.vat_incl = true; //if VAT is included or not

    return this.set(obj);
  }

  clone() {
    return new Price(this.get_cloned_JSON());
  }

  equals(price) {
    if (!(price instanceof Price)) {
      return false;
    }

    return super.equals(price);
  }

  get_JSON() {
    return super.get_JSON();
  }

  get_cloned_JSON() {
    return super.get_cloned_JSON();
  }

  set(obj) {
    if (!obj) {
      return {
        nb_set: 0,
        nb_not_set: 0,
        that: 0,
      };
    }

    let nb_not_set = 0;

    //
    // Sanitize unit
    if (obj.unit) {
      //
      // Convert to Price.unit's index number
      if (util.text.String.is_string(obj.unit)) {
        const unit_idx = Price.units.indexOf(obj.unit);
        //string should be a number
        if (unit_idx < 0) {
          obj.unit = Number.parseInt(obj.unit);
        }
        //string is the unit name
        else {
          obj.unit = unit_idx;
        }
      }

      if (util.Number.is_number(obj.unit)) {
        if (isNaN(obj.unit)) {
          logger.warn(
            "Price#set Unknown specified unit : " + obj.unit + " ; removing it"
          );
          delete obj.unit;
          nb_not_set++;
        } else if (obj.unit < 0 || obj.unit >= Price.units.length) {
          logger.warn(
            "Price#set Wrong unit index : " + obj.unit + " ; removing it"
          );
          delete obj.unit;
          nb_not_set++;
        }
      } else {
        logger.warn(
          "Price#set Unexpected unit type : " +
            typeof obj.unit +
            " ; removing it"
        );
        delete obj.unit;
        nb_not_set++;
      }
    }

    //
    // Convert VAT incl/excl from radios input to vat_incl boolean
    if (obj.vat_excl) {
      obj.vat_incl = false;
    }

    let ret = super.set(obj);
    ret.nb_not_set += nb_not_set;
    return ret;
  }

  /**
   * Return price with VAT (default) or without
   * @param {number} vat_value VAT value to apply or not to this price
   *
   * @param {bool} vat_excl If price must be returned without VAT
   *                        default : false
   */
  get_price(vat_value, vat_excl = undefined) {
    //
    // Exclude VAT
    if (vat_excl) {
      if (this.vat_incl) {
        //remove VAT from value
        return this.value * (1.0 - vat_value);
      }
      //already vat_excl
      return this.value;
    }

    //
    //Include VAT
    if (this.vat_incl) {
      //already vat_incl
      return this.value;
    }

    //add VAT to value
    return this.value * (1.0 + vat_value);
  }
}

if (process !== undefined) {
  module.exports = Price;
}
