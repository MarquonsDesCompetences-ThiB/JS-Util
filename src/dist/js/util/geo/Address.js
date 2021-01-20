"use strict";

if (typeof process !== "undefined") {
  global.Util_Identity = require(process.env.SRC_ROOT +
    "/dist/js/util/form/Util_Identity");
  global.Location = require(process.env.SRC_ROOT + "dist/js/util/geo/Location");
  global.Obj = require(process.env.SRC_ROOT + "dist/js/util/Obj");
}

class Address extends Obj {
  constructor(obj = undefined) {
    super();

    this.number = null; //String (ex. = 2bis)
    this.address = null;
    this.address2 = null;

    this.zip_code = null; //number
    this.city = null;
    this.country = null;

    this.location = null;

    return this.set(obj).that;
  }

  get_JSON() {
    return super.get_JSON();
  }

  to_string() {
    let str = "";

    if (typeof this.number !== "undefined") {
      str += this.number + " ";
      logger.debug(
        "Address#to_string number " + str + " " + typeof this.number
      );
    }

    if (typeof this.address !== "undefined") {
      str += this.address + " ";
    }

    if (typeof this.address2 !== "undefined") {
      str += this.address2 + " ";
    }

    if (typeof this.zip_code !== "undefined") {
      str += this.zip_code + " ";
    }

    if (typeof this.city !== "undefined") {
      str += this.city + " ";
    }

    if (typeof this.country !== "undefined") {
      str += this.country + " ";
    }

    logger.debug("Address#to_string " + str);

    return str;
  }

  set(obj) {
    return super.set(obj);
  }

  clone() {
    return new Address(this.get_cloned_JSON());
  }

  get_cloned_JSON() {
    return super.get_cloned_JSON();
  }

  equals(addr) {
    if (!addr || !(addr instanceof Address)) {
      logger.debug("Address#equals addr ! Address");
      return false;
    }

    return super.equals(addr);
  }

  escape_members() {
    this.number = encodeURI(this.number);
    this.address = encodeURI(this.address);
    this.address2 = encodeURI(this.address2);
    this.city = encodeURI(this.city);
    this.country = encodeURI(this.country);
  }

  /**
   * @return {json} Json containing keys nb_err
   *                  and one for each member having an error
   *                 Return undefined if no errors
   */
  get_members_errors = function () {
    let errs = {
      nb_err: 0,
    };

    logger.debug(
      "Address#get_members_errors addr: " +
        this.address +
        " addr2:" +
        this.address2
    );
    if (
      (errs.number = Util_Identity.get_address_number_error(this.number)) !==
      undefined
    ) {
      logger.debug(
        "Address#get_members_errors error in number : " +
          JSON.stringify(errs.number)
      );
      errs.nb_err++;
    }

    if (
      (errs.address = Util_Identity.get_address_error(
        this.address,
        this.address2
      )) !== undefined
    ) {
      logger.debug(
        "Address#get_members_errors error in addr : " +
          JSON.stringify(errs.address)
      );
      errs.nb_err++;
    }

    logger.debug("Address#get_members_errors zip_code: " + this.zip_code);
    if (
      (errs.zip_code = Util_Identity.get_zip_code_error(this.zip_code)) !==
      undefined
    ) {
      logger.debug(
        "Address#get_members_errors error in zip_code : " +
          JSON.stringify(errs.zip_code)
      );

      errs.nb_err++;
    }

    logger.debug("Address#get_members_errors city: " + this.city);
    if ((errs.city = Util_Identity.get_city_error(this.city)) !== undefined) {
      logger.debug(
        "Address#get_members_errors error in city : " +
          JSON.stringify(errs.city)
      );

      errs.nb_err++;
    }

    logger.debug("Address#get_members_errors country: " + this.country);
    if (
      (errs.country = Util_Identity.get_country_error(this.country)) !==
      undefined
    ) {
      logger.debug(
        "Address#get_members_errors error in country : " +
          JSON.stringify(errs.country)
      );

      errs.nb_err++;
    }

    if (errs.nb_err === 0) {
      return undefined;
    }

    return errs;
  };
}

if (typeof process !== "undefined") {
  module.exports = Address;
}
