"use strict";

class properties {
  static get enumerable() {
    util.obj.Obj_Properties.init = properties;
    return {
      lat: {
        enumerable: true,
        writable: true,
        configurable: true,
      },

      lng: {
        enumerable: true,
        writable: true,
        configurable: true,
      },
    };
  }

  static get not_enumerable() {
    util.obj.Obj_Properties.init = properties;
    return [];
  }

  static get lengthes() {
    util.obj.Obj_Properties.init = properties;

    return {};
  }

  static get regex() {
    util.obj.Obj_Properties.init = properties;
    return {};
  }
}
