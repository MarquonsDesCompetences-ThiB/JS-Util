"use strict";
import { Address_props } from "./_props/Address_props.js";

export class Address extends Address_props {
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
   *                          this.toJSON_as_string
   *                          => numbers are converted to string
   */
  toJSON(include_not_enumerable_props = false, as_string = false) {
    return super.toJSON(include_not_enumerable_props, as_string);
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
          errs.nb_errs++;
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
          errs.nb_errs++;
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
          errs.nb_errs++;
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

          errs.nb_errs++;
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

          errs.nb_errs++;
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

          errs.nb_errs++;
        }
      }

      if (errs.nb_errs === 0) {
        return undefined;
      }

      return errs;
    };*/
}
