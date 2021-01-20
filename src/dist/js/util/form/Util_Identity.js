/**
 * To validate inputs relative to identities (users, companies)
 */
"use strict";

if (typeof process !== "undefined") {
  global.routes = require(process.env.SRC_ROOT + "js/router/routes_pathes");
  global.Util_Identity = require(process.env.SRC_ROOT +
    "/dist/js/util/form/Util_Identity");
  global.Regex = require(process.env.SRC_ROOT +
    "dist/" +
    global.routes.scripts.util.Regex);
}

class Util_Identity {
  static minlengthes = {
    pwd: 8,
  };

  static maxlengthes = {
    login: 25,
    pwd: 25,
    mail: 30,
    tel: 11,

    name: 30,
    surname: 30,
    address: 50,
    address_number: 8,
    zip_code: 8,
    city: 25,
    country: 20,
  };

  /**
   * Check the member address
   * @return {json} If no errors are in address, return undefined
   *                  Otherwise the associated key is set to true :
   *                  {empty, too_long}
   */
  static get_address_error = function (address) {
    if (!address || address.length == 0) {
      return {
        empty: true,
      };
    } else if (address.length >= Util_Identity.maxlengthes.address) {
      logger.warn(
        "Util_Identity#get_address_error Too long address : " +
          address.length +
          " (" +
          address +
          ")"
      );
      return {
        too_long: true,
      };
    }

    return undefined;
  };

  /**
   * Check the member address number
   * @param{string} number
   * @return {json} If no errors are in address, return undefined
   *                  Otherwise the associated key is set to true :
   *                  {empty, too_long}
   */
  static get_address_number_error = function (number) {
    if (!number || number.length == 0) {
      return {
        empty: true,
      };
    }

    //to ignore special chars => count them
    let special_chars = -1;
    let start_idx = -1;
    do {
      logger.log(
        "Util_Identity#get_address_number_error special_chars : " +
          special_chars
      );
      special_chars++;
      start_idx++;
      start_idx = number.indexOf("%", start_idx);
    } while (start_idx >= 0);
    special_chars *= 3;

    if (
      number.length - special_chars >=
      Util_Identity.maxlengthes.address_number
    ) {
      logger.log(
        "Util_Identity#get_address_number_error " +
          number +
          " too long : " +
          number.length +
          " >= " +
          Util_Identity.maxlengthes.address_number
      );
      return {
        too_long: true,
      };
    }

    return undefined;
  };

  /**
   * Check the member city
   * @return {json} If no errors are in city, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long}
   */
  static get_city_error = function (city) {
    if (!city || city.length == 0) {
      return {
        empty: true,
      };
    } else if (city.length >= Util_Identity.maxlengthes.city) {
      return {
        too_long: true,
      };
    }

    return undefined;
  };

  /**
   * Check the member country
   * @return {json} If no errors are in country, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long}
   */
  static get_country_error = function (country) {
    if (!country || country.length == 0) {
      return {
        empty: true,
      };
    } else if (country.length >= Util_Identity.maxlengthes.country) {
      return {
        too_long: true,
      };
    }

    return undefined;
  };
  /**
   * Check the member login
   * @return {json} If no errors are in login, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long}
   */
  static get_login_error = function (login) {
    if (!login || login.length == 0) {
      return {
        empty: true,
      };
    } else if (login.length >= Util_Identity.maxlengthes.login) {
      return {
        too_long: true,
      };
    }

    //TODO check if it does not already exist

    return undefined;
  };

  /**
   * Check the member mail
   * @return {json} If no errors are in mail, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long, wrong_format}
   */
  static get_mail_error = function (mail) {
    if (!mail || mail.length == 0) {
      return {
        empty: true,
      };
    } else if (mail.length >= Util_Identity.maxlengthes.mail) {
      return {
        too_long: true,
      };
    } else if (!global.Regex.is_email_address(mail)) {
      return {
        wrong_format: true,
      };
    }

    //TODO check if mail does not already exist

    return undefined;
  };

  /**
   * Check the member name
   * @return {json} If no errors are in name, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long}
   */
  static get_name_error = function (name) {
    if (!name || name.length == 0) {
      return {
        empty: true,
      };
    } else if (name.length >= Util_Identity.maxlengthes.name) {
      return {
        too_long: true,
      };
    }

    return undefined;
  };

  /**
   * Check the member password
   * @return {json} If no errors are in pwds, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_short, too_long, empty_confirm, different}
   */
  static get_pwd_error = function (pwd, pwd_confirm) {
    if (!pwd || pwd.length === 0) {
      return {
        empty: true,
      };
    } else if (pwd.length < Util_Identity.minlengthes.pwd) {
      return {
        too_short: true,
      };
    } else if (pwd.length >= Util_Identity.maxlengthes.pwd) {
      return {
        too_long: true,
      };
    } else if (pwd_confirm === undefined || pwd_confirm.length === 0) {
      return {
        empty_confirm: true,
      };
    } else if (pwd.localeCompare(pwd_confirm)) {
      //pwds are different
      return {
        different: true,
      };
    }

    return undefined;
  };

  /**
   * Check the member surname
   * @return {json} If no errors are in surname, return undefined
   *                  Otherwise the associated key is set
   *                  to true : {empty, too_long}
   */
  static get_surname_error = function (surname) {
    if (!surname || surname.length == 0) {
      return {
        empty: true,
      };
    } else if (surname.length >= Util_Identity.maxlengthes.surname) {
      return {
        too_long: true,
      };
    }

    return undefined;
  };

  /**
   *
   * @param {string*} tel
   */
  static get_tel_error = function (tel) {
    if (typeof tel === "undefined" || tel.length === 0) {
      return {
        empty: true,
      };
    } else if (tel.length >= Util_Identity.maxlengthes.tel) {
      return {
        too_long: true,
      };
    }
    if (!global.Regex.is_phone_number(tel)) {
      return {
        wrong_format: true,
      };
    }

    return undefined;
  };

  static get_zip_code_error = function (zip_code) {
    const zip_str = new String(zip_code);
    if (!zip_code || zip_str.length == 0) {
      return {
        empty: true,
      };
    } else if (zip_str.length >= Util_Identity.maxlengthes.zip_code) {
      return {
        too_long: true,
      };
    } else if (!global.Regex.is_zip_code(zip_code)) {
      return {
        wrong_format: true,
      };
    }

    return undefined;
  };
}

if (typeof process !== "undefined") {
  module.exports = Util_Identity;
}
