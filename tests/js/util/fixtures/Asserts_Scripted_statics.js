"use strict";

class Asserts_Scripted_statics {
  //
  // === ASSERTS ===
  /**
   * Function names from https://jestjs.io/docs/en/expect
   */
  static asserts = [
    "value",
    "extend",

    "addSnapshotSerializer",
    "anything",
    "any",
    "arrayContaining",

    "assertions",
    "hasAssertions",

    "objectContaining",

    "resolves",
    "rejects",

    //
    // String
    "stringContaining",
    "stringMatching",

    //
    // To Be
    "toBe",
    "toBeDefined",
    "toBeFalsy",
    "toBeInstanceOf",
    "toBeNull",
    "toBeTruthy",
    "toBeUndefined",
    "toBeNaN",

    //
    // To Be : Number comparison
    "toBeGreaterThan",
    "toBeGreaterThanOrEqual",
    "toBeLessThan",
    "toBeLessThanOrEqual",
    "toEqual",
    "toStrictEqual",

    //
    // To Contain
    "toContain",
    "toContainEqual",

    //
    // To have : Been called
    "toHaveBeenCalled",
    "toHaveBeenCalledWith",

    "toHaveLength",
    "toHaveProperty",

    //
    // To have : Returned
    "toHaveReturned",
    "toHaveReturnedTimes",
    "toHaveReturnedWith",
    "toHaveLastReturnedWith",
    "toHaveNthReturnedWith",

    //
    // To Match
    "toMatch",
    "toMatchObject",
    "toMatchSnapshot",
    "toMatchInlineSnapshot",

    //
    // To Throw
    "toThrow",
    "toThrowErrorMatchingSnapshot",
    "toThrowErrorMatchingInlineSnapshot",
  ];

  //
  // === ASSERT COLUMNS NAMES ===
  static asserts_regex = "(" + Asserts_Scripted_statics.asserts.join("|") + ")";

  /**
   * To reset _iterator's object having iteration' stats
   */
  static reset_iteration_stats(stats) {
    stats.done = 0;
    stats.missing = 0; //variable to assert is missing in inputs
    stats.failed = 0; //exception raised
    stats.tot = 0;
    stats.errs = [];
  }
}

util.obj.Obj.export(module, Asserts_Scripted_statics);
