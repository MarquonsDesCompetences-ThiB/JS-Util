"use strict";

class Fixtures_Scripted_File extends tests.util.Scripted_File {
  constructor(obj = undefined) {
    super(obj);

    /**
     * Contrary to parent, instances is a Map (not a WeakMap)
     * Associates row's id to its columns' content
     * Rows' content
     */
    this.instances = new Map();
  }

  /**
   *
   * @return{Promise}
   *                  Success
   *                  Reject :
   *                          errs {string[] | undefined}
   */
  index(sheet_id = 1) {
    return new Promise((success, reject) => {
      this.objects = [];
      this.instances = new Map();
      this.expecteds[sheet_id] = new tests.util.fixtures.Asserts_Scripted();
      let errs = [];

      super
        .index(
          true //only first row (headings)
        )
        .then(
          (nb_indexed_rows) => {
            //
            // Fill expecteds from parsed headings row
            {
              this.cols_descriptions.forEach((col_descr, col_idx) => {
                if (col_descr.ignore) {
                  return;
                }

                const { name, type_name, assert = undefined } = col_descr;

                //
                // Column's name is an assert -> add it to this.expecteds
                if (assert) {
                  //
                  // If new expected field
                  if (col_descr.new_group) {
                    this.expecteds[sheet_id].push_assert(name, assert, col_idx);
                  } else {
                    this.expecteds[sheet_id].add_assert(name, assert, col_idx);
                  }
                }
                //
                // Column's name is a data name
                else {
                  //
                  //check name is not a reserved_names
                  if (
                    name && //if not, warning already done by super.index
                    Fixtures_Scripted_File.reserved_names.includes(name)
                  ) {
                    const msg =
                      "Data column cannot be called '" +
                      name +
                      "' : this is a reserved word by this class (reserved words : " +
                      Fixtures_Scripted_File.reserved_names.join(", ") +
                      ")";
                    logger.error = msg;
                    errs.push(msg);

                    that.cols_names[col_idx] = null;
                  }
                }
              });
            }

            //
            // Fetch next rows name/template_name
            // => fill objects
            {
              const name_col_id = this.cols_names.indexOf("Id");
              if (name_col_id < 0) {
                const msg =
                  "No column owns rows' Id (case sensitive). Could not parse rows.";
                logger.error = msg;
                errs.push(msg);
                return reject(errs);
              }

              {
                const content = this.content;

                //
                // Iterate rows skipping 1st one (headings)
                content.forEach((row, row_id) => {
                  //
                  // Skip headings row
                  {
                    if (row_id === 0) {
                      return;
                    }
                  }

                  const row_name = row[name_col_id];
                  const row_descr = this.parse_row_name(row_name);
                  this.add_row_description(row_descr);

                  logger.log =
                    "Element " +
                    row_name +
                    " loaded from row " +
                    row_id +
                    " in file " +
                    this.name;
                });
              }
            }

            if (errs.length > 0) {
              reject(errs);
            } else {
              success();
            }
          },

          (err) => {
            const msg = "Could not parse headings row : " + err;
            logger.error = msg;
            reject(msg);
          }
        );
    });
  }

  parse_heading_column(heading_value) {
    //
    // Extract assert part
    const assert_part = heading_value.match(/(?<=\=\>\s*)\.+/);
    let first_part = heading_value;
    if (assert_part) {
      first_part = first_part.match(/.+(?=\s*\=\>)/);
    }

    //
    // Parse name/type
    let col_descr = super.parse_heading_column(first_part);
    col_descr.assert = assert_part;
    return col_descr;
  }

  /**
   * Set the specified row description
   * to this.rows_descriptions[<row_descr.id>]
   * and row's id to this.objects{row_name}
   * @param {*} row_descr
   */
  add_row_description(row_descr) {
    const { name, id } = row_descr;
    const accessors = tests.util.Scripted_Type.get_accessor_parts(name);

    //
    // Set row's name into this.objects
    {
      let row_names = tests.util.Scripted_Type.get_reference(
        this.objects,
        accessors,
        true, //create when does not exist
        1 //stops at the last accessor
      );

      const last_accessor = accessors[accessors.length - 1];
      if (row_names[last_accessor]) {
        logger.warn =
          "A row description already exists and will be erased at " + name;
      }

      row_names[last_accessor] = id;
    }

    //
    // Set row's description
    {
      this.rows_descriptions[id] = row_descr;
    }
  }

  /**
   * Return the specified row
   * @param {integer|string} id If string, get_row_by_name is called
   *
   * @return {Promise} Success : {
   *                              {Row_Description} row_descr
   *                              {Object} row Keys being columns' names
   *                            }
   *
   * @throws {ReferenceError} If :
   *                              - no row_description for id
   *                              - no name in row_description
   *                              - row has a template and it
   *                                couldn't be fetched
   */
  get_row(id) {
    {
      if (util.text.String.is(id)) {
        return this.get_row_by_name(...arguments);
      }
    }

    return new Promise((success, reject) => {
      const row_descr = this.rows_descriptions[id];
      const { name = undefined } = row_descr;
      {
        if (!row_descr) {
          const msg = "Row's description missing for row " + id;
          logger.error = msg;
          throw ReferenceError(msg);
        }

        if (!name) {
          const msg = "Row's name missing for row " + id;
          logger.error = msg;
          throw ReferenceError(msg);
        }
      }

      //
      // Already loaded => return it
      {
        const row = this.instances.get(id);
        if (row) {
          return success({
            row_descr,
            row,
          });
        }
      }

      //
      // Load
      {
        let row = this.read_row(id);

        //
        // Add template if any
        {
          const { template_name = undefined } = row_descr;
          if (template_name) {
            try {
              const template = this.get_row_by_name(template_name);

              //
              // Add template's column values to empty row's columns
              {
                row.forEach((value, idx) => {
                  if (
                    value == null ||
                    // value could be a number (=> without length property)
                    (value.length && value.length === 0)
                  ) {
                    row[idx] = template[idx];
                  }
                });
              }

              this.parse_row(row)
                .then((parsed_row) => {
                  this.instances.set(id, parsed_row);
                  return success({
                    row_descr,
                    row: parsed_row,
                  });
                })
                .catch((ex) => {
                  const msg =
                    "Could not parse some value(s) in row " +
                    name +
                    " (" +
                    id +
                    ") : " +
                    ex;
                  logger.error = msg;

                  throw new Error(msg);
                });
            } catch (ex) {
              const msg =
                "Could not load template of row " +
                name +
                " (" +
                id +
                ") : " +
                ex;
              logger.error = msg;

              throw new ReferenceError(msg);
            }
          }
        }
      }
    });
  }

  /**
   * Return the specified row
   * @param {string} id If string, get_row_by_name is called
   *
   *
   * @return {Promise} Success : {
   *                              Row_Description row_descr
   *                              {Object} row Keys being columns' names
   *                            }
   */
  get_row_by_name(name) {
    const row_id = tests.util.Scripted_Type.get_reference(this.objects, name);

    if (!row_id) {
      const msg = "No row with name " + name;
      logger.error = msg;
      throw ReferenceError(msg);
    }

    return this.get_row(row_id);
  }

  /**
   * Parse the specified row by replacing variables by their value
   * @param {(string|number)[]} row
   *
   * @return {Promise} Success : {Object} row Row with keys being
   *                                          columns' names
   */
  parse_row(row) {
    return new Promise((success) => {
      let nb_cols_got = 0;
      const nb_cols_tot = row.length;
      let row_parsed = {};

      row.forEach((value, col_idx) => {
        const col_descr = this.cols_descriptions[col_idx];
        if (col_descr.ignore) {
          return;
        }

        this.parse_column_value(col_idx, value)
          .then((obj) => {
            row_parsed[col_descr.name] = obj;
            on_column_parsed();
          })
          .catch((ex) => {
            const msg = "Error parsing column " + col_idx + " : " + ex;
            logger.error = msg;

            on_column_parsed();
          });
      });

      function on_column_parsed() {
        nb_cols_got++;
        if (nb_cols_got !== nb_cols_tot) {
          return;
        }

        success(row_parsed);
      }
    });
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
   *                          {Error|undefined} err
   *                          {int} id Row id
   *
   *                          If no err :
   *                            {Row_Description} descr
   *                            {object} values  Value for each column,
   *                                             keys being the columns' names
   *                            {Asserts_Scripted_iterator} assert
   *                                To iterate asserts on computed values
   *
   *
   * @param {integer} sheet_id Index of the sheet to iterate
   * @param {integer} start_row Index of the row to start from
   *                            Remember 1 is headings row
   *
   * @return {Promise}
   *                    Success
   *                      Number of iterated rows
   *                    Reject
   *                      {*[]} errors,
   *                      {integer}  number of well parsed rows
   */
  async for_each(fn, sheet_id = 1, start_row = 2, last_row = undefined) {
    return new Promise((success, reject) => {
      //
      // Check preconds
      {
        if (!this.env) {
          const msg =
            "this.env is missing ; an Environment_Scripted_File is required to evaluate rows";
          logger.error = msg;
          throw new ReferenceError(msg);
        }

        if (!this.cols_names) {
          const msg = "No data names parsed ; did you call this.parse(cbk) ?";
          logger.warn = msg;
          throw new ReferenceError(msg);
        }
      }

      const nb_rows_tot = this.nb;
      const start = start_row > nb_rows_tot ? nb_rows_tot : start_row;
      const last = !last_row || last_row > nb_rows_tot ? nb_rows_tot : last_row;
      let nb_rows_parsed = 0;
      let nb_ignored_rows = 0;
      let errs = [];

      //
      // Async handling
      const nb_rows_to_process = last - start + 1;
      let nb_row_got = 0;
      /**
       *
       * @param {*[]} row_vals
       */
      function on_row(row_vals) {
        fn(...row_vals);

        nb_row_got++;
        if (nb_row_got !== nb_rows_to_process) {
          return;
        }

        if (errs.length > 0) {
          reject(errs, nb_rows_parsed);
        } else {
          success(nb_rows_parsed);
        }
      }

      //
      // Iterate and parse requested rows
      {
        for (let row_id = start; row_id <= last; row_id++) {
          //
          // Row must be ignored
          if (this.objects[row_id].ignore) {
            nb_ignored_rows++;
            continue;
          }

          //
          // Process row
          this.get_row(row_id)
            .then((row) => {
              nb_rows_parsed++;

              {
                let row_vals = [
                  undefined, //no error
                  row_id,
                  row.row_descr,
                  row.row,
                  this.expecteds[sheet_id].iterator(row_id, row),
                ];

                on_row.apply(this, row_vals);
              }
            })
            .catch((ex) => {
              logger.error = ex;
              errs.push(ex);

              {
                let row_vals = [ex, row_id];

                on_row.apply(this, row_vals);
              }
            });
        }
      }
    });
  }

  /**
   * Apply updates from asserts' results
   * and write to file
   * Called by this.release()
   */
  async apply_updates(sheet_id = 1) {
    {
      if (!this.output_updates[sheet_id]) {
        this.output_updates[sheet_id] = [];
      }
    }

    //
    // Add results to this.output_updates
    {
      let updates = this.output_updates[sheet_id];

      //
      // Iterate this.expecteds[sheet_id].results[sheet_id][<col_id>]
      this.expecteds[sheet_id].results.forEach((result, col_id) => {
        //
        // Iterate fails
        {
          result.fails.forEach((msg, row_id) => {
            ensure_output_array(row_id);

            updates[row_id][col_id] = {
              comment: msg,
              bg_color: "red",
            };
          });
        }

        //
        // Iterate successes
        {
          result.successes.forEach((msg, row_id) => {
            ensure_output_array(row_id);

            updates[row_id][col_id] = {
              comment: msg,
              bg_color: "green",
            };
          });
        }
      });

      function ensure_output_array(row_id) {
        if (!updates[row_id]) {
          updates[row_id] = [];
        }
      }
    }

    //
    // Write to file
    {
      super.apply_updates();
    }
  }
}

Object.assign(
  Fixtures_Scripted_File,
  require("./Fixtures_Scripted_File_statics")
);

Fixtures_Scripted_File.init(
  require("./Fixtures_Scripted_File_properties"),
  module
);
