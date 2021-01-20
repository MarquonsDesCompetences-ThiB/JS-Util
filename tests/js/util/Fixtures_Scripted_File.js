"use strict";

const Csv_File = require(process.env.SRC_ROOT + "js/util/files/Csv_File");
const Scripted_File = require(process.env.SRC_ROOT +
  "js/util/files/scripted/Scripted_File");

/**
 * Column containing row names must be
 * called either Name or Id (case sensitive)
 */
class Fixtures_Scripted_File extends Csv_File {
  static owned_members = [
    /**
     * {Environment_Scripted_File}
     */
    "env",

    /**
     * Object associating column's name to column's idx
     */
    "data_cols",

    /**
     * Object associating row's Id to :
     *    - id {integer} row's idx
     *    - template {string[] | optional}
     */
    "data_rows",

    /**
     * Integer[][] whose keys are :
     *  - name of variable to assert
     *      - method name from Fixtures_Scripted_File.asserts
     *          - column index
     */
    "expecteds",

    /**
     * integer[]
     * The last asserted expected field id
     * rows_asserts_progress.length <= content.length
     * rows_asserts_progress[i] < expecteds.length
     */
    "rows_asserts_progress",
  ];

  /**
   * Names that cannot be used as column name
   */
  static reserved_names = ["Expected", "id"];

  //
  // === ROW NAME ===
  /**
   * Row name can be either an alphanumeric name (optionnal including any _)
   * Can be templated by another row suffixing :
   *  = other_row_name
   */
  static row_name_regex = "\\s*(\\w|_)*\\s*(={(\\w|_)+})?";

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

  //
  // === ASSERT COLUMNS NAMES ===
  static asserts_regex = "(" + Fixtures_Scripted_File.asserts.join("|") + ")";
  /**
   * The name an assert column can match
   */
  static expect_regex =
    // | Expect :
    "(\\s*\\|\\s*)?(Expect\\s*\\:)" +
    // variable name
    Scripted_File.variable_name_regex +
    // Assert method name
    "\\s+(" +
    Fixtures_Scripted_File.asserts_regex +
    "){1}\\s*";

  static is_assert_column_name(name) {
    return new RegExp("/^" + Fixtures_Scripted_File.expect_regex + "$/").test(
      name
    );
  }

  /**
   * Extract variable name and assert method
   * from the specified assert column name
   *
   * @param {string} name
   *
   * @return{string[2]} variable_name and assert_method
   */
  static extract_assert_column_name_values(name) {
    let name_clone = "" + name;

    /*
        Extract variable and method
        concatenating them into a string,
        separated by an hyphen '-'
        <variable>-<method>
    */
    {
      const reg = new RegExp("/^" + Fixtures_Scripted_File.expect_regex + "$/");
      name_clone.replace(reg, "$3-$4");
    }

    return name_clone.split("-");
  }

  constructor(obj = undefined, child_owned_members = []) {
    super(Fixtures_Scripted_File.owned_members.concat(child_owned_members));

    this.set(obj);
  }

  /**
   *
   * @param {function} cbk Callback with param :
   *                          errs {string[] | undefined}
   *
   */
  parse(cbk) {
    this.data_cols = {};
    this.data_rows = {};
    this.expecteds = [];
    this.reset_rows_asserts_progress();

    let that = this;
    if (this.content) {
      on_read();
      return true;
    }
    logger.log =
      "Fixtures_Scripted_File#parse Reading file " + this.name + "...";
    this.read(function (err) {
      if (err) {
        const msg = "Error reading file " + this.name + " : " + err;
        logger.error="Fixtures_Scripted_File#parse::read " + msg;
        return cbk(msg);
      }
      on_read();
    });
    return true;

    function on_read() {
      let errs = [];
      if (!(that.content instanceof Array)) {
        that.to_csv_array();
      }

      const row = that.content[0];
      //
      // Check there is an headings row
      {
        if (!row) {
          const msg = "File " + that.name + " has no headings row";
          logger.warn="Fixtures_Scripted_File#parse::read " + msg;
          return cbk([msg]);
        }
      }

      //
      // Fetch columns data fom 1st row
      // => fill data_cols
      {
        for (let col_idx = 0; col_idx < row.length; col_idx++) {
          const col_name = row[col_idx];
          //
          // Column's name is an assert name :
          // is wrthing Expected_* name eventually starting with |
          // If starts with |, it concerns a new expected field
          if (Fixtures_Scripted_File.is_assert_column_name(col_name)) {
            //
            // If new expected field
            {
              const has_vertical_bar = /^\s*\|{1}\s*/.test(col_name);
              if (has_vertical_bar || that.expecteds.length === 0) {
                that.expecteds.push({});
              }
            }

            //
            // Add the expected checks
            {
              let last_expected = that.expecteds[that.expecteds.length - 1];
              const expect_checks = extract_assert_column_name_values();
              //
              // Add variable name to check
              const exp_var = expect_checks[0];
              if (!last_expected[exp_var]) {
                last_expected[exp_var] = {};
              }

              const exp_method = expect_checks[1];
              //
              // Warn if assert method already exists for this variable
              if (last_expected[exp_var][exp_method]) {
                const msg =
                  "Expected column " +
                  col_name +
                  " (" +
                  col_idx +
                  ") already exists and will be removed";
                logger.error="Fixtures_Scripted_File#parse " + msg;
                errs.push(msg);
              }

              last_expected[exp_var][exp_method] = col_idx;
            }
          }
          //
          // Column's name is a data name
          else {
            if (Fixtures_Scripted_File.reserved_names.includes(col_name)) {
              const msg =
                "Data column cannot be called '" +
                col_name +
                "' : this is a reserved word by this class";
              logger.error="Fixtures_Scripted_File#parse " + msg;
              errs.push(msg);
              continue;
            }

            if (that.data_cols[col_name]) {
              const msg =
                "Data column " +
                col_name +
                " already exists and will be removed";
              logger.error="Fixtures_Scripted_File#parse " + msg;
              errs.push(msg);
            }

            that.data_cols[col_name] = col_idx;
          }
        }
      }

      //
      // Fetch rows dependencies from 1st column
      // => fill data_rows
      {
        const name_col_id = that.data_cols["Id"];
        if (!name_col_id) {
          const msg =
            "No column owns rows' Id (case sensitive). Could not parse rows.";
          logger.error="Fixtures_Scripted_File#parse " + msg;
          errs.push(msg);
          return cbk(errs);
        }

        //
        // Iterate rows skipping 1st one (headings)
        const content = that.content;
        for (let row_id = 1; row_id < content.length; row_id++) {
          const row_name = row[name_col_id];
          const name_regex = new RegExp(
            "/^" + Fixtures_Scripted_File.row_name_regex + "$/"
          );
          if (!name_regex.test(row_name)) {
            const msg =
              "Row name " +
              row_name +
              " from row " +
              row_id +
              " does not match expected names {alphanumeric|_} [=<other_var_name] (regex : " +
              Fixtures_Scripted_File.row_name_regex +
              ")";
            errs.push(msg);
            continue;
          }

          //
          // extract name parts
          // => name_parts {string[1-2]}
          let name_parts = "" + row_name;
          {
            name_parts.replace(name_regex, "$1|$3");
            name_parts = name_parts.split("|");
          }

          //
          // Fetch optional row template
          let template;
          {
            if (name_parts[1]) {
              //remove eventual variable's encoling braces
              name_parts[1] = Scripted_File.get_variable_name(name_parts[1]);

              // fetch row
              const templ_row_data = that.data_rows[name_parts[1]];
              if (templ_row_data) {
                // point template to templated row
                template = content[templ_row_data.id];
              } else {
                const msg =
                  "Unknown row " +
                  name_parts[1] +
                  " templated by row " +
                  name_parts[0] +
                  " (" +
                  row_id +
                  ")";
                logger.error="Fixtures_Scripted_File#parse " + msg;
                errs.push(msg);
              }
            }
          }

          that.data_rows[name_parts[0]] = {
            id: row_id,
            template: template,
          };
        }
      }

      cbk(errs.length > 0 ? errs : undefined);
    }
  }

  //
  // === TESTING ===
  /**
   * Iterate rows in files giving values as Object associating
   * column's name -> cell value
   * Templated rows get their template value when row's cell is empty
   *
   * fn is called rows.length-1 times
   *
   * @param {function} fn Function called for every row
   *                        Params :
   *                          errs {string[] | undefined}
   *                          row_datas {object}
   * @param {integer} start_row Index of the row to start from
   *
   * @return {integer} Number of iterated rows, including ones with errors
   */
  async iterate_fixtures(fn, start_row = 1) {
    let nb_rows_processed = 0;
    //
    // Check preconds
    {
      if (!this.env) {
        const msg =
          "this.env is missing ; an Environment_Scripted_File is required to evaluate rows";
        logger.error="Fixtures_Scripted_File#iterate_fixtures " + msg;
        return nb_rows_processed;
      }

      if (!this.data_cols) {
        const msg = "No data names parsed ; did you call this.parse(cbk) ?";
        logger.warn="Fixtures_Scripted_File#iterate_fixtures " + msg;
        return nb_rows_processed;
      }
    }

    for (const row_name in this.data_rows) {
      nb_rows_processed++;
      const row_id = this.data_rows[row_name].id;
      if (!row_id || row_id < start_row) {
        const msg =
          "Skipping row " +
          row_name +
          " (id : " +
          row_id +
          " - start_row : " +
          start_row +
          ")";
        logger.warn="Fixtures_Scripted_File#iterate_fixtures " + msg;
        continue;
      }

      let errs = [];
      const row = this.content[row_id];
      let row_vals = {
        id: row_id,
        expected: [],
      };

      //
      // Fetch datas
      {
        const row_template = this.data_rows[row_id].template;

        for (const data_name in this.data_cols) {
          const col_id = this.data_cols[data_name];
          //
          // column's missing in row
          if (col_id >= row.length) {
            const msg =
              "No column " +
              data_name +
              " (" +
              col_id +
              ") in row " +
              row_id +
              " of file " +
              this.name;
            logger.warn="Fixtures_Scripted_File#iterate_fixtures " + msg;
            errs.push(msg);
            continue;
          }

          //
          // warn if already exists and now removed
          if (row_vals[data_name]) {
            const msg =
              "Data " + col_name + " already exists and will be removed";
            logger.error="Fixtures_Scripted_File#iterate_fixtures " + msg;
            errs.push(msg);
          }

          //
          // Fetch cell value from row or template
          {
            // template's value
            if (row_template && row[col_id].length === 0) {
              row_vals[data_name] = row_template[col_id];
            }
            //row's value
            else {
              row_vals[data_name] = row[col_id];
            }
          }

          //
          // Cell value is a variable => fetch it
          {
            if (Scripted_File.is_variable(row_vals[data_name])) {
              row_vals[data_name] = this.env.get_object(row_vals[data_name]);

              if (!row_vals[data_name]) {
                const msg =
                  "Variable " +
                  row[col_id] +
                  " not found for column " +
                  col_name +
                  "(" +
                  col_id +
                  ") in file " +
                  this.name;
                logger.error="Fixtures_Scripted_File#iterate_fixtures " + msg;
                errs.push(msg);
              }
            }
          }
        }
      }

      //
      // Send row_vals to function
      fn(errs.length > 0 ? errs : undefined, row_vals);
    }

    return nb_rows_processed;
  }

  //
  // === ASSSERTS ===
  assert_row(row_id, values) {
    //
    // Check arguments
    {
      if (row_id >= this.content.length) {
        const msg = "Unexisting row " + row_id + " in " + this.name;
        logger.error="Fixtures_Scripted_File#assert_row " + msg;
        return 0;
      }

      if (!values) {
        const msg = "Missing values arguments to assert row " + row_id;
        logger.error="Fixtures_Scripted_File#assert_row " + msg;
        return 0;
      }
    }

    const row = this.content[row_id];

    //
    // Init progress if row never asserted
    {
      while (!this.rows_asserts_progress[row_id]) {
        this.rows_asserts_progress.push(-1);
      }
    }
    {
      if (this.rows_asserts_progress[row_id] >= this.expecteds.length) {
        const msg =
          "All asserts are already done (" +
          this.rows_asserts_progress[row_id] +
          ") for row " +
          row_id;
        logger.error="Fixtures_Scripted_File#assert_row " + msg;
        return 0;
      }
    }

    const exp_id = this.rows_asserts_progress[row_id]++;
    const exp_obj = this.expecteds[exp_id];

    //
    // Iterate assertions to do
    for (const var_name in exp_obj) {
      for (const assert_meth_name in exp_obj[var_name]) {
        const col_id = exp_obj[var_name][assert_meth_name];
        //
        // column's missing in row
        if (col_id >= row.length) {
          const msg =
            "No column 'Expect : " +
            var_name +
            " " +
            assert_meth_name +
            " (" +
            col_id +
            ") in row " +
            row_id +
            " of file " +
            this.name;
          logger.warn="Fixtures_Scripted_File#iterate_fixtures " + msg;
          continue;
        }

        let expected_val = row[col_id];
        //
        // Expected value is a variable => fetch it
        {
          if (Scripted_File.is_variable(expected_val)) {
            expected_val = this.env.get_object(expected_val);

            if (!expected_val) {
              const msg =
                "Variable " +
                row[col_id] +
                " not found for column expecting " +
                var_name +
                " " +
                assert_meth_name +
                " (" +
                col_id +
                ") in file " +
                this.name;
              logger.error="Fixtures_Scripted_File#iterate_fixtures " + msg;
              continue;
            }
          }
        }

        //
        // Fetch variable to assert in values
        let computed_val = values;
        {
          let err = false;
          const var_name_parts = var_name.split(".");
          for (let part_id = 0; part_id < var_name_parts.length; part_id++) {
            const member_name = var_name_parts[part_id];
            if (!computed_val[member_name]) {
              const msg =
                "Error asserting variable " +
                var_name +
                " (column " +
                col_id +
                ") : Member " +
                member_name +
                " from " +
                var_name +
                " not found in row " +
                row_id +
                " of file " +
                this.name;
              logger.error="Fixtures_Scripted_File#iterate_fixtures " + msg;
              err = true;
              break;
            }
            computed_val = computed_val[member_name];
          }
          if (err) {
            continue;
          }
        }

        //
        // Jest assert
        {
          //
          // If assert method use .not
          if (assert_meth_name.includes("not")) {
            const name_parts = assert_meth_name.split("_");
            expect(computed_val)[name_parts[0]][name_parts[1]](expected_val);
          } else {
            expect(computed_val)[assert_meth_name](expected_val);
          }
        }
      }
    }
  }

  reset_rows_asserts_progress() {
    this.rows_asserts_progress = [];
  }
}

module.exports = Fixtures_Scripted_File;
