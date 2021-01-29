"use strict";

class Address_properties {
  static get instances() {
    return {
      name: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      number: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      address: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      address2: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      zip_code: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      city: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      country: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      //
      // {Location}
      location: {
        enumerable: true,
        writable: true,
        configurable: false,
      },
    };
  }

  static get lengthes() {
    return {
      number: {
        max: 8,

        digit: {
          min: 1,
          max: 4,
        },
        alpha: {
          min: 1,
          max: 4,
        },
      },
    };
  }

  static get regex() {
    return {
      number:
        "/^(\\s*)(\\d){" +
        properties.lenghtes.number.digit.min +
        "," +
        properties.lenghtes.number.digit.max +
        "}\\s*([a-zA-Z]){" +
        properties.lenghtes.number.alpha.min +
        "," +
        properties.lenghtes.number.alpha.max +
        "}$/",
    };
  }
}

util.obj.Obj.export(module, Address_properties);
