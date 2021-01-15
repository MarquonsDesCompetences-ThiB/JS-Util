"use strict";

const Scripted_File = require(process.env.SRC_ROOT +
  "js/util/files/scripted/Scripted_File");

class Fixtures_Scripted_File extends Scripted_File {
  static owned_members = [
    /**
     * Object[]
     *  Members :
     *      - defined
     *      - type
     *      - value
     */
    "expected",
  ];

  /**
   * Function names from https://jestjs.io/docs/en/expect
   */
  static expecteds = [
    "value",
    "extend",

    "addSnapshotSerializer",
    "anything",
    "any",
    "arrayContaining",

    "assertions",
    "hasAssertions",

    "objectContaining",

    //
    // Not
    "not",
    "not_arrayContaining",
    "not_objectContaining",
    "not_stringContaining",
    "not_stringMatching",

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

  constructor(obj = undefined, child_owned_members = []) {
    super(Fixtures_Scripted_File.owned_members.concat(child_owned_members));

    this.set(obj);
  }

  parse(cbk) {
    let that = this;
    super.parse(on_parsed);

    function on_parsed(err) {
      if (err) {
        const msg = "Error(s) parsing file : " + err;
        logger.error("Fixtures_Scripted_File#parse " + msg);
        return cbk(msg);
      }

      that.parse_expected_columns(cbk);
    }
  }

  /**
   * Parse expected_* columns
   * Each one can appear multiple times
   */
  parse_expected_columns(cbk) {
    let expecteds_fields = []; //Object[] -> {name, cols_idxs[]}
    //
    // Fetch expected_* columns idx
    {
      let idx;
      for (let i = 0; i < Fixtures_Scripted_File.expecteds_fields.length; i++) {
        const exp_name = Fixtures_Scripted_File.expecteds_fields[i];
        if (this.cols_names.includes(exp_name)) {
          let expected = {
            name: exp_name,
            cols_idxs: [],
          };

          //
          // Fetch expected's columns indexes from this.cols_names
          idx = -1;
          while ((idx = this.cols_names.indexOf(exp_name, idx++)) >= 0) {
            expected.cols_idxs.push(idx);
          }

          expecteds_fields.push(expected);
        }
      }
    }

    {
      //
      // Iterate rows skippging 2 firsts ones
      const rows = this.content;
      for (let row_id = 2; i < rows.length; row_id++) {
        const obj_name = rows[row_id[0]];

        if (this.objects[obj_name]) {
          this.objects[obj_name].expecteds = [];
          let obj_expecteds = this.objects[obj_name].expecteds;

          {
            //
            // Iterate expecteds_fields
            for (
              let field_idx = 0;
              field_idx < expecteds_fields.length;
              field_idx++
            ) {
              const exp_field = expecteds_fields[field_idx];

              //
              // Iterate expected_field's columns
              for (
                let field_col_idx = 0;
                field_col_idx < exp_field.cols_idxs.length;
                field_col_idx++
              ) {
                // object's expected value
                while (!obj_expecteds[field_col_idx]) {
                  obj_expecteds.push({});
                }
                let exp_obj = obj_expecteds[field_col_idx];

                const exp_val = rows[exp_field.cols_idx[field_col_idx]];
                exp_obj[exp_field.name] = exp_val;
              }
            }
          }
        }
      }
    }

    cbk();
  }
}

module.exports = Fixtures_Scripted_File;
