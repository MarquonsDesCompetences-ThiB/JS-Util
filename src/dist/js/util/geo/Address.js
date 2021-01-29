"use strict";

class Address extends util.obj.Obj {
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
   * @param {bool} as_string  If true, everything is processed by
   *                          this.get_JSON_as_string
   *                          => numbers are converted to string
   */
  get_JSON(include_not_enumerable_props = false, as_string = false) {
    return super.toJson(include_not_enumerable_props, as_string);
  }

  to_string() {
    let str = "";

    if (this.number != null) {
      str += this.number + " ";
      logger.debug =
        "Address#to_string number " + str + " " + typeof this.number;
    }

    if (this.address != null) {
      str += this.address + " ";
    }

    if (this.address2 != null) {
      str += this.address2 + " ";
    }

    if (this.zip_code != null) {
      str += this.zip_code + " ";
    }

    if (this.city != null) {
      str += this.city + " ";
    }

    if (this.country != null) {
      str += this.country + " ";
    }

    logger.debug = "Address#to_string " + str;

    return str;
  }

  equals(addr) {
    if (!addr || !(addr instanceof Address)) {
      logger.debug = "Address#equals addr ! Address";
      return false;
    }

    return super.equals(addr);
  }

  //
  // === GETTERS / SETTERS ===
  get name() {
    if (!this.name) {
      throw "undefined";
    }

    return this.name;
  }

  set name(name) {
    if (!name || name.length == 0) {
      throw "empty";
    }
    if (name.length > Util_Identity.maxlengthes.name) {
      logger.warn =
        "Address#set name Too long name : " + name.length + " (" + name + ")";
      throw "too_long";
    }

    this.name = name;
  }

  set number(number) {
    //
    // Empty
    {
      if (!number || number.length == 0) {
        throw "empty";
      }
    }

    {
      if (!properties.regex.test(decodeURI(number))) {
        const nb_chars =
          number.length - util.text.String.count_utf8_characters(number) * 2;
        if (nb_chars > properties.lenghtes.number.max) {
          throw "too_long";
        }
        // else
        throw "wrong_format";
      }
    }

    this.number = number;
  }

  set address(address) {
    if (!address || address.length == 0) {
      throw "empty";
    }
    if (address.length >= Util_Identity.maxlengthes.address) {
      logger.warn =
        "Address#set address Too long address : " +
        address.length +
        " (" +
        address +
        ")";
      throw "too_long";
    }

    this.address = address;
  }

  set city(city) {
    if (!city || city.length == 0) {
      throw "empty";
    }
    if (city.length >= Util_Identity.maxlengthes.city) {
      logger.warn =
        "Address#set city Too long city : " + city.length + " (" + city + ")";
      throw "too_long";
    }

    this.city = city;
  }

  set country(country) {
    if (!country || country.length == 0) {
      throw "empty";
    }
    if (country.length >= Util_Identity.maxlengthes.country) {
      logger.warn =
        "Address#set country Too long country : " +
        country.length +
        " (" +
        country +
        ")";
      throw "too_long";
    }

    this.country = country;
  }

  set location(location) {
    if (typeof location !== "object") {
      throw "wrong_format";
    }

    if (location instanceof util.geo.Location) {
      this.location = location;
    } else {
      this.location = new util.geo.Location(location);
    }
  }

  //
  // === GETTERS / SETTERS of SUB-PROPERTIES ===
  get lat() {
    if (!this.location) {
      return undefined;
    }

    return this.location.lat;
  }

  get lng() {
    if (!this.location) {
      return undefined;
    }

    return this.location.lng;
  }

  /**
     * @return {json} Json containing keys nb_err
     *                  and one for each member having an error
     *                 Return undefined if no errors
     *
    get_members_errors = function () {
      let errs = {
        nb_err: 0,
      };

      logger.debug=
        "Address#get_members_errors addr: " +
          this.address +
          " addr2:" +
          this.address2
      );

      //
      // House number
      {
        if (
          (errs.number = util.Util_Identity.get_address_number_error(
            this.number
          )) !== undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in number : " +
              JSON.stringify(errs.number)
          );
          errs.nb_err++;
        }
      }

      //
      // Address line 1
      {
        if (
          (errs.address = util.Util_Identity.get_address_error(
            this.address
          )) !== undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in addr : " +
              JSON.stringify(errs.address)
          );
          errs.nb_err++;
        }
      }

      //
      // Address line 2
      {
        if (
          this.address2 &&
          (errs.address2 = util.Util_Identity.get_address_error(
            this.address2
          )) !== undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in addr2 : " +
              JSON.stringify(errs.address2)
          );
          errs.nb_err++;
        }
      }

      //
      // Zip code
      {
        logger.debug="Address#get_members_errors zip_code: " + this.zip_code);
        if (
          (errs.zip_code = util.Util_Identity.get_zip_code_error(
            this.zip_code
          )) !== undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in zip_code : " +
              JSON.stringify(errs.zip_code)
          );

          errs.nb_err++;
        }
      }

      //
      // City
      {
        logger.debug="Address#get_members_errors city: " + this.city);
        if (
          (errs.city = util.Util_Identity.get_city_error(this.city)) !==
          undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in city : " +
              JSON.stringify(errs.city)
          );

          errs.nb_err++;
        }
      }

      //
      // Country
      {
        logger.debug="Address#get_members_errors country: " + this.country);
        if (
          (errs.country = util.Util_Identity.get_country_error(
            this.country
          )) !== undefined
        ) {
          logger.debug=
            "Address#get_members_errors error in country : " +
              JSON.stringify(errs.country)
          );

          errs.nb_err++;
        }
      }

      if (errs.nb_err === 0) {
        return undefined;
      }

      return errs;
    };*/
}

Address.init(require("./Address_properties"), module);
