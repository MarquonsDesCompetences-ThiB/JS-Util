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
    let idx;
    //
    // Fetch expected_* columns idx
    {
      // expected_defined
      const exp_defined_name = "expected_defined";
      let exp_defined_cols_idx = [];
      idx = -1;
      while ((idx = this.cols_names.indexOf(exp_defined_name, idx++)) >= 0) {
        exp_defined_cols_idx.push(idx);
      }

      // expected_type
      const exp_type_name = "expected_type";
      let exp_type_cols_idx = [];
      idx = -1;
      while ((idx = this.cols_names.indexOf(exp_type_name, idx++)) >= 0) {
        exp_type_cols_idx.push(idx);
      }

      // expected_value
      const exp_value_name = "expected_value";
      const exp_value_cols_idx = [];
      idx = -1;
      while ((idx = this.cols_names.indexOf(exp_value_name, idx++)) >= 0) {
        exp_value_cols_idx.push(idx);
      }
    }

    //
    // Iterate rows skippging 2 firsts ones
    {
      const rows = this.content;
      for (let row_id = 2; i < rows.length; row_id++) {
        const obj_name = rows[row_id[0]];

        if (this.objects[obj_name]) {
          this.objects[obj_name].expecteds = [];
          let expecteds = this.objects[obj_name].expecteds;

          //
          // expected_defined
          for (let i = 0; i < exp_defined_cols_idx.length; i++) {
            expecteds.push({});
            let exp_obj = expecteds[i];

            const exp_val = rows[exp_defined_cols_idx[i]];
            exp_obj[exp_defined_name] = exp_val;
          }

          //
          // expected_type
          for (let i = 0; i < exp_defined_cols_idx.length; i++) {
            if (!expecteds[i]) {
              expecteds.push({});
            }
            let exp_obj = expecteds[i];

            const exp_val = rows[exp_type_cols_idx[i]];
            exp_obj[exp_type_name] = exp_val;
          }

          //
          // expected_value
          for (let i = 0; i < exp_value_cols_idx.length; i++) {
            if (!expecteds[i]) {
              expecteds.push({});
            }
            let exp_obj = expecteds[i];

            const exp_val = rows[exp_value_cols_idx[i]];
            exp_obj[exp_value_name] = exp_val;
          }
        }
      }
    }

    cbk();
  }
}

module.exports = Fixtures_Scripted_File;
