"use strict";

class Asserts_Scripted_properties {
  get instances() {
    return {
      /**
       * Asserts to do at every row
       * Specified by headings row
       * {Object[<var_to_test>][<expect_method_to_use>]}
       */
      asserts: {
        value: [{}],
        enumerable: true,
        writable: false,
      },

      /**
       * Results after iterating asserts with rows' values
       * {Object[<row_id>]} With every object :
       *                        fails  string[col_id]
       *                        successes string[col_id]
       */
      results: {
        value: [],
        enumerable: true,
        writable: false,
      },
    };
  }
}

util.obj.Obj.export(module, Asserts_Scripted_properties);
