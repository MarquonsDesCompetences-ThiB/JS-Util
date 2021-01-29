"use strict";

class Csv_File_properties {
  static get instances() {
    return {
      nb_cols: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      col_names: {
        enumerable: true,
        writable: true,
        configurable: false,
      },

      /*
    Object
    For each column id, for each destination value, 
    associate the column's values that should be converted 
    to the destination value
  */
      values_associations: {
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

util.obj.Obj.export(module, Csv_File_properties);
