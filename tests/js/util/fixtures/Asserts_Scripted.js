"use strict";

class Asserts_Scripted extends util.obj.Obj {
  constructor(obj = undefined) {
    super(obj);
  }

  //
  // === INITIALIZATION ===
  /**
   *
   * @param {string} assert_to_do - A value in Asserts_Scripted.asserts
   *                                      - optional "not"
   *                                      - optional "all"
   *
   * @return {Object} {string} method_name
   *                  {bool} all
   *                  {bool} not
   * @throws {ReferenceError} If no method name found in <assert>
   */
  parse_assert(assert) {
    let assert_minimized = assert + "";
    let assert_descr = {};

    //
    // 'All' specifier
    {
      if (/\ball\b/i.test(assert_minimized)) {
        assert_descr.all = true;

        //remove 'not' from assert string
        assert_minimized = assert_minimized.replace(/\ball\b/i, "");
      }
    }

    //
    // 'Not' specifier
    {
      if (/\bnot\b/i.test(assert_minimized)) {
        assert_descr.not = true;

        //remove 'not' from assert string
        assert_minimized = assert_minimized.replace(/\bnot\b/i, "");
      }
    }

    //
    // Method name
    {
      const name_matches = assert_minimized.match(/\b\w+\b/);
      if (!name_matches) {
        const msg = "No method name in assert string " + assert;
        logger.error = msg;
        throw ReferenceError(msg);
      }

      let name = name_matches[0];
      let i = 1;
      for (
        ;
        !Asserts_Scripted_statics.asserts.includes(name) &&
        i < name_matches.length;
        i++
      ) {
        name = name_matches[i];
      }

      if (i >= name_matches.length) {
        const msg =
          "No existing method name in assert string " +
          assert +
          ". Existing methods : " +
          Asserts_Scripted_statics.asserts.join(", ");
        logger.error = msg;
        throw ReferenceError(msg);
      }

      assert_descr.method_name = name;
    }

    return assert_descr;
  }

  /**
   * Add the specified assert to the last group of asserts
   *
   * @param {string|string[]} variable_to_test If an array, joined with "."
   * @param {string} assert_to_do - A value in Asserts_Scripted.asserts
   *                                      - optional "not"
   *                                      - optional "all"
   * @param {integer} col_id The column concerned by the assert
   *
   */
  add_assert(variable_to_test, assert_to_do, col_id) {
    {
      if (this.asserts.length === 0) {
        this.asserts = [{}];
      }
    }

    const last_group = this.asserts[this.asserts.length - 1];
    const variable =
      variable_to_test instanceof Array
        ? variable_to_test.join(".")
        : variable_to_test;

    //
    //Add the variable
    {
      if (!last_group[variable]) {
        last_group[variable] = {};
      }
    }

    //
    //Add the method
    {
      let assert_descr = this.parse_assert(assert_to_do);
      assert_descr.col_id = col_id;

      if (last_group[variable][assert_to_do.method_name]) {
        logger.warn =
          "The assert for variable " +
          variable +
          " with method " +
          assert_to_do.method_name +
          " already exists and is now replaced. Did you forget to push a new assert group (push_assert) ?";
      }

      last_group[variable][assert_to_do.method_name] = assert_descr;
    }
  }

  /**
   * Push a new asserts group and add the specified assert to it
   *
   * @param {string|string[]} variable_to_test If an array, joined with "."
   * @param {string} assert_method_to_use assert_method_to_use A value in Asserts_Scripted.asserts
   * @param {integer} col_id The column concerned by the assert
   */
  push_assert(variable_to_test, assert_method_to_use, col_id) {
    this.asserts.push({});
    this.add_assert(...arguments);
  }

  //
  // === USAGE ===
  /**
   * Create a new _iterator and consumes its first call
   *
   * @param {*[]} Row with expected values
   */
  iterator(row_id, row) {
    const it = new this.iterator(row_id, row);
    return it.next();
  }

  /**
   * Iterate all groups of asserts to run their asserts
   * with next()'s Object parameter
   */
  async *_iterator(row_id, row) {
    let inputs = {
      /**
       * Values concerning the last asserted group
       *
       * (missing + failed) <= done <= tot
       */
      group: {},
    };
    Asserts_Scripted.reset_iteration_stats(inputs.group);

    //
    // <col_id> -> {jest assert result (message, pass), array or not}
    let asserts_res = [];

    /**
     * Sum of all groups
     * (missing + failed) <= done <= tot
     */
    let groups_tot = {
      missing: 0, //variable to assert is missing in inputs
      failed: 0, //exception raised
      // done <= nb
      done: 0,
      nb: this.asserts.length,
    };

    for (let i = 0; i < groups_tot.nb; i++) {
      yield inputs; //{Object}
      await assert_group(i);
    }

    return {
      value: {
        groups_tot,
      },
      done: true,
    };

    /**
     *
     * @param {*} i
     *
     * @return {Promise} Enabling loop to await for function
     */
    function assert_group(i) {
      return new Promise((finished) => {
        //
        // Iteration init
        {
          Asserts_Scripted.reset_iteration_stats(inputs.group);
        }

        let nb_to_assert = 0;
        let nb_assert_done = 0;

        //
        //  Iterate group's variables to assert
        const asserts_group = this.asserts[i];
        Object.entries(asserts_group).forEach((var_asserts) => {
          const [var_to_check, associated_asserts] = [var_asserts];

          //
          // Iterate variable's asserts
          {
            const entries = Object.entries(associated_asserts);
            nb_to_assert += entries.length;

            const that = this;
            entries.forEach((assert) => {
              const [assert_meth_name, assert_descr] = assert;

              try {
                const expected_val = row[assert_descr.col_id];

                //
                // Expected value is a variable => fetch it
                {
                  if (tests.util.Scripted_File.is_variable(expected_val)) {
                    expected_val = this.env.get_object(expected_val).then(
                      (expected_val) => {
                        if (!expected_val) {
                          const msg =
                            "Variable " +
                            row[assert_descr.col_id] +
                            " not found for column expecting " +
                            var_to_check +
                            " " +
                            assert_meth_name +
                            " (column " +
                            assert_descr.col_id +
                            ")";
                          logger.error = msg;
                          throw ReferenceError(msg);
                        }

                        assert(var_to_check, assert_descr, expected_val);
                      },
                      (error) => {
                        const msg =
                          "Error fecthing variable " +
                          row[assert_descr.col_id] +
                          " for column expecting " +
                          var_to_check +
                          " " +
                          assert_meth_name +
                          " (column " +
                          assert_descr.col_id +
                          ") : " +
                          error;
                        logger.error = msg;
                        throw ReferenceError(msg);
                      }
                    );

                    return;
                  }
                }

                //
                // Not a variable to fetch
                {
                  assert(var_to_check, assert_descr, expected_val);
                }

                /**
                 * Assert and yield/loop if nb_to_assert is reached
                 *
                 */
                function assert(var_to_check, assert_descr, expected_val) {
                  //
                  // Jest assert
                  {
                    asserts_res[assert_descr.col_id] = that.assert(
                      row_id,
                      tests.util.Scripted_Type.get_reference(
                        inputs,
                        var_to_check
                      ),
                      assert_descr,
                      expected_val
                    );
                  }

                  //
                  // yield/loop if ready
                  on_done();
                }
              } catch (ex) {
                if (ex instanceof ReferenceError) {
                  inputs.group.missing++;
                } else {
                  inputs.group.failed++;
                }

                inputs.group.errs.push(ex);
                on_done();
              }
            });
          }
        });

        function on_done() {
          nb_assert_done++;

          //
          // yield/loop if ready
          if (nb_assert_done === nb_to_assert) {
            inputs.group.done++;
            finished();
          }
        }
      });
    }
  }

  /**
   * Run a Jest assert
   * If assert_descr.all, run assertion on every input_value's properties
   * Run it on input_value otherwise
   *
   * @param {int} row_id
   * @param {*} input_value
   * @param {*} assert_descr
   * @param {*} expected_val
   *
   * @return {Object|Object[]} Return an array if assert_descr.all
   *                            Object contains :
   *                            {string} message
   *                            {bool} pass
   *
   */
  assert(row_id, input_value, assert_descr, expected_val) {
    //
    // Assert input_value itself
    {
      if (!assert_descr.all) {
        return jest_assert(row_id, input_value, assert_descr, expected_val);
      }
    }

    //
    // Assert every input_value's properties
    {
      let res = [];

      Object.values(input_value).forEach((value) => {
        res.push(jest_assert(row_id, value, assert_descr, expected_val));
      });

      return res;
    }

    function jest_assert(row_id, input_value, assert_descr, expected_val) {
      let expect_obj = expect(input_value);

      if (assert_descr.not) {
        expect_obj = expect_obj.not();
      }

      return add_result(
        row_id,
        assert_descr.col_id,
        expect(input_val)[assert_descr.method_name](expected_val)
      );
    }
  }

  //
  // === RESULTS ===
  /**
   *
   * @param {int} row_id
   * @param {int} col_id
   * @param {*} jest_result
   *
   * @return {jest_result} Send back the jest result
   */
  add_result(row_id, col_id, jest_result) {
    let row_results = this.results[col_id];

    //
    // Fill successes
    if (jest_result.pass) {
      if (!row_results.successes) {
        row_results.successes = [];
      }

      row_results.successes[row_id] = jest_result.message;
    }
    //
    // Fill fails
    else {
      if (!row_results.fails) {
        row_results.fails = [];
      }

      row_results.fails[row_id] = jest_result.message;
    }

    return jest_result;
  }
}

Object.assign(Asserts_Scripted, require("./Asserts_Scripted_statics"));
Asserts_Scripted.init(require("./Asserts_Scripted_properties"), module);
