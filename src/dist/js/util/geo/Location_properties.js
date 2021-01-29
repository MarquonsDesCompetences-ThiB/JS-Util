"use strict";

class Location_properties {
  static get instances() {
    return {
      lat: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      lng: {
        enumerable: true,
        writable: true,
        configurable: false,
      },
    };
  }

  static get lengthes() {
    return {};
  }

  static get regex() {
    return {};
  }
}

util.obj.Obj.export(module, Location_properties);
