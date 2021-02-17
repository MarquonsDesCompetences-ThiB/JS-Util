"use strict";
import { obj, text } from "@src/both/_both.js";
import { address } from "../Address_statics.js";
import { Location } from "../Location.js";
import { form_identity } from "@front/form/form_identity.js";

export abstract class Address_props extends obj.Obj {
  #_nm: string;

  #_nmbr: string;

  #_ddrss: string;

  #_ddrss2?: string;

  #_zp_cd: string;

  #_ct: string;

  #_cntr: string;

  //
  // {Location}
  #_lctn: Location;

  get name() {
    if (!this.name) {
      throw "undefined";
    }

    return this.#_nm;
  }

  set name(name) {
    if (!name || name.length == 0) {
      throw "empty";
    }
    if (name.length > form_identity.maxlengthes.name) {
      logger.warn =
        "Address#set name Too long name : " + name.length + " (" + name + ")";
      throw "too_long";
    }

    this.#_nm = name;
  }

  get number() {
    return this.#_nmbr;
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
      if (!new RegExp(address.regex.number).test(decodeURI(number))) {
        const nb_chars =
          number.length - text.string.count_utf8_characters(number) * 2;
        if (nb_chars > address.lengthes.number.max) {
          throw "too_long";
        }
        // else
        throw "wrong_format";
      }
    }

    this.#_nmbr = number;
  }

  get address() {
    return this.#_ddrss;
  }

  set address(address) {
    if (!address || address.length == 0) {
      throw "empty";
    }
    if (address.length >= form_identity.maxlengthes.address) {
      logger.warn =
        "Address#set address Too long address : " +
        address.length +
        " (" +
        address +
        ")";
      throw "too_long";
    }

    this.#_ddrss = address;
  }

  get address2() {
    return this.#_ddrss2;
  }

  set address2(address) {
    if (!address || address.length == 0) {
      throw "empty";
    }
    if (address.length >= form_identity.maxlengthes.address) {
      logger.warn =
        "Address#set address Too long address : " +
        address.length +
        " (" +
        address +
        ")";
      throw "too_long";
    }

    this.#_ddrss2 = address;
  }

  get zip_code() {
    return this.#_zp_cd;
  }

  set zip_code(zip) {
    // TODO regex
    this.#_zp_cd = zip;
  }

  get city() {
    return this.#_ct;
  }

  set city(city) {
    if (!city || city.length == 0) {
      throw "empty";
    }
    if (city.length >= form_identity.maxlengthes.city) {
      logger.warn =
        "Address#set city Too long city : " + city.length + " (" + city + ")";
      throw "too_long";
    }

    this.#_ct = city;
  }

  get country() {
    return this.#_cntr;
  }

  set country(country) {
    if (!country || country.length == 0) {
      throw "empty";
    }
    if (country.length >= form_identity.maxlengthes.country) {
      logger.warn =
        "Address#set country Too long country : " +
        country.length +
        " (" +
        country +
        ")";
      throw "too_long";
    }

    this.#_cntr = country;
  }

  get location() {
    return this.#_lctn;
  }

  set location(location) {
    if (typeof location !== "object") {
      throw "wrong_format";
    }

    if (location instanceof Location) {
      this.#_lctn = location;
    } else {
      this.#_lctn = new Location(location);
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
}
