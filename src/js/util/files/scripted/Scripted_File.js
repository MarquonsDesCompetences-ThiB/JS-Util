"use strict";

const Asserts_Scripted_statics = require("./fixtures/Asserts_Scripted_statics");
const Scripted_Type = require("./Scripted_Type");

/**
 * Rows :
 *  1 : Headings, every column havin objects type in parenthesis
 *  Next ones : objects declaration
 *
 * Columns :
 *  1 : Objects namesfv
 */
class Scripted_File extends global.util.files.Csv_File {
  constructor(obj = undefined) {
    super(obj);
  }

  //
  // === INDEXING ===
  /**
   *
   * @param {bool} only_headings To only index the first row
   *
   * @return {Prommise} Success : {integer} nb_indexed_rows
   *                    Reject : {string} err
   *                              {integer|undefined} nb_indexed_rows
   */
  index(only_headings = false) {
    return new Promise((success, reject) => {
      this.objects = {};
      this.cols_names = [];
      this.cols_descriptions = [];

      if (this.content) {
        return on_read.apply(this);
      }

      logger.log = "Reading file " + this.name + "...";
      this.read().then(
        () => {
          on_read.apply(this);
        },
        (error) => {
          reject(error);
        }
      );

      function on_read() {
        if (!(this.content instanceof Array)) {
          this.to_csv_array();
        }

        if (!(this.content instanceof Array)) {
          const msg = "Content is not an array in file " + this.name;
          logger.error = msg;
          return reject(msg);
        }

        const content = this.content;
        let nb_indexed_rows = 0;
        //
        // Fetch 1st row : columns' names and types
        {
          const row = content[0];
          if (!(row instanceof Array)) {
            const msg = "First row is not an array in file " + this.name;
            logger.error = msg;
            return reject(msg);
          }

          //
          // Iterate columns
          row.forEach((col_str, col_id) => {
            try {
              const col_descr = this.parse_heading_column(col_str);

              //
              // Check values to warn user
              {
                if (col_descr.ignore) {
                  logger.warn =
                    "Ignoring column " +
                    col_id +
                    " from file " +
                    this.name +
                    " (name starting with a backslash '\\')";
                } else {
                  if (!col_descr.name) {
                    logger.warn =
                      "Column " +
                      col_id +
                      " from file " +
                      this.name +
                      " has no name";
                  }

                  if (!col_descr.type_name) {
                    logger.warn =
                      "Column " +
                      col_id +
                      " from file " +
                      this.name +
                      " has no type name";
                  }
                  //
                  // Check type existency
                  else if (
                    !Asserts_Scripted_statics.asserts.includes(
                      col_descr.type_name
                    ) &&
                    !this.request_type(col_descr.type_name)
                  ) {
                    const msg =
                      "Unexisting type " +
                      col_descr.type_name +
                      " used in column " +
                      col_id +
                      " of file " +
                      this.name;
                    logger.warn = msg;
                  }
                }
              }
            } catch (ex) {
              // could not split -> match returns null
              logger.error =
                "Wrong heading column content " +
                col_id +
                " : " +
                col_str +
                " (" +
                ex +
                ")";
            }
          });

          nb_indexed_rows++;
        }

        //
        // Fetch next rows
        {
          if (only_headings) {
            return success(nb_indexed_rows);
          }

          //
          // Iterate rows skipping first one (headings)
          for (let i = 1; i < content.length; i++) {
            const row_datas = this.parse_row_name(content[i]);
            if (row_datas) {
              nb_indexed_rows++;
            } else {
              logger.error = "Could not parse name of row " + i;
            }
          }

          //
          // Rows indexed
          {
            //
            // Release memory
            delete this.content;

            //
            // Debrief
            // nb_rows
            const nb_rows = content.length;
            const msg =
              nb_indexed_rows +
              " indexed rows/" +
              nb_rows +
              " in file " +
              this.name;
            //
            // Not all rows indexed
            {
              if (nb_rows !== nb_indexed_rows) {
                logger.error = "Only " + msg;
                return reject("Only " + msg, nb_indexed_rows);
              }
            }

            //
            // Success : All rows indexed
            {
              logger.info = msg;
              success(nb_indexed_rows);
            }
          }
        }
      }
    });
  }

  /**
   * An heading column has a property name and type between parenthesis :
   * <name> (<type>)
   *
   * @return {object} {full_name, name, type_name, ignore, new_group}
   */
  parse_heading_column(heading_value) {
    let col_descr = {
      name: undefined,
      type_name: undefined,
    };

    // 0 is name, 1 is type
    const heading_parts = heading_value.match(/\b.+\b/g);
    {
      //
      // Extracted name
      const name = heading_parts ? heading_parts[0] : heading_value;

      if (util.text.String.is(name) && name.length > 0) {
        col_descr.name = name;
      }

      //
      // Push even if not found to keep right columns' indexes in cols_names
      this.cols_names.push(name);
    }

    //
    // Extracted type
    {
      const type = heading_parts ? heading_parts[1] : "";
      if (util.text.String.is(type) && type.length > 0) {
        col_descr.type_name = type;
      }
    }

    //
    // Specific identifiers
    {
      //
      // Must be ignored (starts with a '\' ; eventual preceding '|')
      {
        col_descr.ignore = /^(\s*\|)?\s*\\/.test(heading_value);
      }

      //
      // New group of values (starts with a '|' ; eventual preceding '\')
      {
        col_descr.new_group = /^(\s*\\)?\s*\|/.test(heading_value);
      }
    }

    //
    // Push even if not found to keep right columns' indexes in cols_descriptions
    this.cols_descriptions.push(col_descr);

    return col_descr;
  }

  /**
   * Extract members from 1st column,
   * create row description
   * and store it into this.objects
   *
   * @param {string | *[1+]} row
   *                            string : the row name
   *                            array : 1st cell having the row_name
   *
   * @return {Object {id, name, template_name, {bool} ignore}}
   */
  parse_row_name(row, row_id) {
    const name = row instanceof Array ? row[0] : row;
    //
    // Check preconds
    {
      if (!util.text.String.is(name)) {
        const type = typeof name;
        const msg =
          "Wrong row's name argument. Should be a string but is " +
          type +
          (type === "object" ? " (" + name.constructor.name + ")" : "");
        logger.error = msg;
        throw new TypeError(msg);
      }

      if (name.length === 0) {
        const msg = "Row's name argument is an empty string";
        logger.error = msg;
        throw new ReferenceError(msg);
      }
    }
    let row_descr = {
      id: row_id,
      name: undefined,
      template_name: undefined,
    };

    const equal_parts = name.split("=");
    //
    // Variable name
    {
      row_descr.name = equal_parts[0].match(/[^\s]/g).join("");
    }

    //
    // If row should be ignored
    // (contains a starting backslash '\')
    {
      if (/^\s*\\\s*/.test(row_descr.name)) {
        row_descr.ignore = true;

        // remove the backlash from the name
        row_descr.name = row_descr.name.replace(/^\s*\\\s*/, "");
      }
    }

    //
    // Another object has to be cloned (equal_parts[1] exists)
    {
      if (equal_parts[1]) {
        row_descr.template_name = equal_parts[1].match(/[^\s]/g).join("");
      }
    }

    //
    // Store row_descr ino this.objects according to name's accessors
    {
      const { name } = row_descr;
      const accessors = Scripted_Type.get_accessor_parts(name);

      let object_descr = tests.util.Scripted_Type.get_reference(
        this.objects,
        accessors,
        true, //create when does not exist
        1 //stops at the last accessor
      );

      //
      // Set row description and warn if already exists so replaced
      {
        const last_accessor = accessors[accessors.length - 1];
        if (object_descr[last_accessor]) {
          logger.warn =
            "A row description already exists and will be erased at " + name;
        }

        object_descr[last_accessor] = row_descr;
      }
    }

    return row_descr;
  }

  /**
   *
   * @param {string} name Name can include :
   *                        - multiple variables separated by dot
   *                        - object member's idx (integer)
   *                      This name can ended by ={<variable_to_copy>}
   *
   * @return {Promise}
   *                Success :
   *                    Object containing :
   *                      - obj_ref,
   *                      - member_name,
   *                      - init_obj : Object to use
   *                                  to init obj_ref[member_name] members
   */
  parse_column_name(name) {
    return new Promise((success, reject) => {
      //
      // Check preconds
      {
        if (!util.text.String.is(name)) {
          const type = typeof name;
          const msg =
            "Wrong name argument. Should be a string but is " +
            type +
            (type === "object" ? " (" + name.constructor.name + ")" : "");
          logger.error = msg;
          throw new TypeError(msg);
        }

        if (name.length === 0) {
          const msg = "name argument is an empty string";
          logger.error = msg;
          throw new ReferenceError(msg);
        }
      }
      let res;

      const equal_parts = name.split("=");
      //
      // Variable name
      {
        const var_accessors = Scripted_Type.get_accessor_parts(equal_parts[0]);
        let obj_ref = this.objects;
        //
        // Create/Fetch obj_ref iterating accessors ignoring last one
        {
          for (let i = 0; i < var_accessors.length - 1; i++) {
            const accessor = var_accessors[i];
            if (!obj_ref[accessor]) {
              obj_ref[accessor] = {};
            }
            obj_ref = obj_ref[accessor];
          }
        }

        //
        // Set result
        res = {
          obj_ref,
          member_name: var_accessors[var_accessors.length - 1],
        };
      }

      //
      // Another object has to be cloned (equal_parts[1] exists)
      {
        if (equal_parts[1]) {
          this.get_object(equal_parts[1], true)
            .then(
              (obj) => {
                if (!obj) {
                  const msg =
                    "Could not find object " +
                    equal_parts[1] +
                    " to be cloned to " +
                    equal_parts[0];
                  logger.error = msg;
                }
                // else if obj has a clone function -> clone it
                else if (typeof obj.clone === "function") {
                  obj = obj.clone();
                }
                //else warn the object will be given as is
                else {
                  logger.warn =
                    "The object " +
                    equal_parts[1] +
                    " has no clone method ; original references will be used";
                }

                res.obj = obj;
                success(res);
              },
              (error) => {
                const msg =
                  "Could not fetch template object " +
                  equal_parts[1] +
                  " of " +
                  equal_parts[0] +
                  " : " +
                  error;
                logger.error = msg;
                reject(msg);
              }
            )
            .catch((ex) => {
              const msg =
                "Exception fetching template object " +
                equal_parts[1] +
                " of " +
                equal_parts[0] +
                " : " +
                ex;
              logger.error = msg;
              reject(msg);
            });
        } else {
          success(res);
        }
      }
    });
  }

  //
  // === PARSERS ===
  /**
   * Parse the row and store it to this.instances
   * @param {id,
   *          name,
   *          {string|undefined}template_name} row Row description to parse
   *
   * @return {Promise} Promise enables rows to have cyclic references
   *                    Success :
   *                      {object} object instanciated
   *                      {integer} nb_parsed_cols :
   *                        Number of columns parsed with success
   *
   *                      instance :
   *                        Object constructed from row values
   */
  parse_row_object(row_descr) {
    return new Promise((success, reject) => {
      //
      // Check argument
      {
        if (!row_descr || !row_descr.id || !row_descr.name) {
          const msg = "No row description set or with empty id and/or name";
          logger.error = msg;
          throw TypeError(msg);
        }
      }

      let instance; //constructed instance
      let instance_params = {}; //values to set

      //
      // Construct the object and store it to this.instances
      // even if not all parameters are resolved
      // => Enable cyclic references
      {
        let constructor;
        {
          constructor = this.request_type(this.cols_descriptions[0].type_name);
          if (!constructor) {
            const msg =
              "Constructor not found for type " +
              this.cols_descriptions[0].type_name +
              " in file " +
              this.name;
            logger.error = msg;
            return reject(msg);
          }
        }

        //
        // Construct object
        {
          const that = this;
          try {
            instance = new constructor();
            if (!instance) {
              return constructor_error();
            }

            this.instances.set(row_descr.name, instance);
          } catch (ex) {
            return constructor_error(ex);
          }

          function constructor_error(ex) {
            const msg =
              "Object " +
              obj_name +
              " of type " +
              that.cols_descriptions[0].type_name +
              " could not be constructed in file " +
              that.name +
              (ex ? " : " + ex : "");

            logger.error = msg;
            reject(msg);
          }
        }
      }

      //
      // Parse row's columns
      {
        const row = this.read_row(row_descr.id);
        let nb_parsed_cols = 0;

        //
        // Fetch params from other columns than name
        {
          let nb_async_got = 0;
          const nb_async_tot = row.length - 1; //nb columns without the 1st one

          for (let col_id = 1; col_id < row.length; col_id++) {
            try {
              const member_name = this.cols_names[col_id];
              {
                if (!member_name) {
                  logger.error =
                    "Column " +
                    col_id +
                    " in file " +
                    this.name +
                    " has no name";
                  async_got();
                  continue;
                }
              }

              try {
                const obj_type = this.request_type(
                  this.cols_descriptions[col_id].type_name
                );

                const value = row[col_id];
                if (!value || value.length === 0) {
                  //
                  // if no default value loaded
                  if (!instance_params[member_name]) {
                    if (obj_type) {
                      instance_params[member_name] = new obj_type();
                    } else {
                      instance_params[member_name] = "";
                    }
                  }

                  nb_parsed_cols++;
                  async_got();
                }
                //
                // else : cell has a value
                else {
                  this.parse_column_value(col_id, value)
                    .then((obj) => {
                      instance_params[member_name] = obj;

                      nb_parsed_cols++;
                      async_got();
                    })
                    .catch((ex) => {
                      const msg =
                        "Exception parsing value " +
                        value +
                        " from column " +
                        col_id +
                        " from row " +
                        row_descr.id +
                        " : " +
                        ex;
                      logger.error = msg;

                      async_got();
                    });
                }
              } catch (err) {
                const msg =
                  "Could not parse column " +
                  col_id +
                  " from row " +
                  row_descr.id +
                  " : " +
                  err;
                logger.error = msg;
                async_got();
              }
            } catch (ex) {
              const msg =
                "Exception parsing column " +
                col_id +
                " from row " +
                row_descr.id +
                " : " +
                ex;
              logger.error = msg;

              async_got();
            }
          }

          function async_got() {
            nb_async_got++;
            if (nb_async_got === nb_async_tot) {
              logger.log = nb_parsed_cols + " columns parsed/" + row.length;
              success(instance, nb_parsed_cols);
            }
          }
        }
      }
    });
  }

  /**
   * @param {integer} col_id
   * @param {string|number} value Can be a string containing :
   *                    - array of values
   *                    - listed values (separated by comma)
   *                        to be used as parameters in type's constructor call
   *                    - value : variable | raw value
   *
   *                    If value is a number, it's just returned as is
   *
   * @return {Promise}  Success :
   *                      - object instanciated
   *
   */
  parse_column_value(col_id, value) {
    return new Promise((success) => {
      //
      // Check preconds
      {
        if (util.number.Number.is(value)) {
          return success(value);
        }

        if (!value || value.length === 0) {
          const msg = "Value is missing in column " + col_id;
          logger.warn = "Scripted_File#parse_column_value " + msg;
          throw TypeError(msg);
        }

        if (col_id >= this.cols_descriptions.length) {
          const msg =
            "Argument col_id is wrong (" +
            col_id +
            ") ; should be in [0; " +
            this.cols_descriptions.length +
            "[";
          logger.error = msg;
          throw TypeError(msg);
        }
      }

      let is_array = false;
      let arr_strings;
      let arr_objects = [];

      //
      // Value is an array => has brackets
      {
        if ((arr_strings = value.match(/(?<=\s*\[\s*).*(?=\s*\]\s*)/))) {
          is_array = true;
        } else {
          arr_strings = [value];
        }
      }

      let nb_async_got = 0;
      let nb_async_tot = arr_strings.length;

      function async_got() {
        nb_async_got++;
        if (nb_async_got !== nb_async_tot) {
          return;
        }

        //
        // Else everything's ready
        // => construct object from cols_descriptions[col_id].type_name
        // and arr_objects
        {
          if (is_array) {
            this.construct_object_from_type_name(
              this.cols_descriptions[col_id].type_name,
              arr_objects
            ).then((obj) => {
              success(obj);
            });
          } else {
            this.construct_object_from_type_name(
              this.cols_descriptions[col_id].type_name,
              ...arr_objects
            ).then((obj) => {
              success(obj);
            });
          }
        }
      }

      for (let i = 0; i < arr_strings.length; i++) {
        const value = arr_strings[i];

        //
        // Value is a variable
        {
          if (Scripted_Type.is_variable_name(value)) {
            this.get_object(value, true)
              .then((obj) => {
                if (obj == null) {
                  const msg = "Variable " + var_name + " does not exist";
                  logger.error = msg;

                  const obj_str = "<undefined : " + value + ">";
                  arr_objects.push(obj_str);
                } else {
                  arr_objects.push(obj);
                }
                async_got();
              })
              .catch((ex) => {
                const msg =
                  "Variable " + var_name + " failed to be fetched : " + ex;
                logger.error = msg;

                const obj_str = "<undefined : " + value + ">";
                arr_objects.push(obj_str);
                async_got();
              });

            continue;
          }
        }

        //
        // Value is one or more parameters for a constructor
        {
          let constructor;
          let params;

          let nb_async_construction_got = 0;
          let nb_async_construction_tot = 1; //constructor
          function async_construction_got() {
            nb_async_construction_got++;
            if (nb_async_construction_got !== nb_async_construction_tot) {
              return;
            }

            //
            // Else erverything's ready
            {
              if (constructor) {
                try {
                  arr_objects.push(new constructor(...params));
                } catch (ex) {
                  const msg =
                    "Exception constructing " +
                    constructor.name +
                    " of column " +
                    col_id +
                    " from file " +
                    this.name +
                    " : " +
                    ex;
                  logger.error = msg;

                  const obj_str = "<construction error : " + ex + ">";
                  arr_objects.push(obj_str);
                }
              } else {
                arr_objects.push(undefined);
              }

              async_got();
            }
          }

          //
          // Fetch params
          {
            params = value.split(",");
            nb_async_construction_tot += params.length;

            //
            // Fetch params' variables
            for (let i = 0; i < params.length; i++) {
              const str = params[i];
              if (Scripted_Type.is_variable_name(str)) {
                // get object pointed by variable params[i] (str)
                this.get_object(str, true)
                  .then((param) => {
                    if (!param) {
                      logger.error =
                        "Undefined variable " +
                        str +
                        " from " +
                        value +
                        " in column " +
                        col_id +
                        " of file " +
                        this.name;

                      const param_str = "<undefined : " + str + ">";
                      params[i] = param_str;
                    } else {
                      params[i] = param;
                    }
                    async_construction_got();
                  })
                  .catch((ex) => {
                    const msg =
                      "Exception fetching variable " +
                      str +
                      " from " +
                      value +
                      " in column " +
                      col_id +
                      " of file " +
                      this.name +
                      " : " +
                      ex;
                    logger.error = msg;

                    const param_str = "<undefined : " + str + ">";
                    params[i] = param_str;
                    async_construction_got();
                  });
              }
            }
          }

          //
          // Fetch constructor
          {
            const { type_name } = this.cols_descriptions[col_id];
            if (!type_name) {
              logger.error =
                "Column " + col_id + " has no type set in file " + this.name;
              return async_construction_got();
            }

            this.request_type(type_name)
              .then((constructor_fetched) => {
                if (constructor_fetched == null) {
                  logger.error =
                    "Type " +
                    type_name +
                    " does not exist for column " +
                    col_id +
                    " in file " +
                    this.name;
                } else {
                  constructor = constructor_fetched;
                }

                async_construction_got();
              })
              .catch((ex) => {
                logger.error =
                  "Exception requesting type " +
                  type_name +
                  " from column " +
                  col_id +
                  " in file " +
                  this.name +
                  " : " +
                  ex;

                async_construction_got();
              });
          }
        }
      }
    });
  }

  //
  // === GETTERS / SETTER ===
  /**
   *
   * @return {Promise} Success : {Object}
   *                   Reject : errs
   */
  get_all_objects() {
    return new Promise((success, reject) => {
      let objs = {};
      let loaded_obj_names = new Set();

      //
      // Iterate already loaded instances
      {
        this.instances.forEach((instance, name) => {
          const ref = Scripted_Type.get_reference(
            objs,
            name,
            true, //create in objs properties that do not exist
            1
          );
          ref.obj[ref.last_accessor_names[0]] = instance;
          loaded_obj_names.add(name);
        });
      }

      //
      // Recursively load missing objects
      {
        this.load_objects_in(
          this.instances,
          loaded_obj_names //objects to ignore because already loaded
        ).then(
          (parsed_objs) => {
            parsed_objs.forEach((obj) => {
              util.obj.Json.merge(
                objs,
                obj,
                false //if any obj's property already in objs, obj overides
              );
            });
            success(objs);
          },
          (errors) => {
            reject(errors);
          }
        );
      }
    });
  }

  /**
   * Recursively load objects in <objects>
   * whose complete name (all accessors parts) is not in <not_names>
   *
   * @param {Object} objects
   * @param {Set} not_in
   * @param {string} objects_name Full name enabling to access to objects
   *                              from this.objects
   *
   *
   * @return {Promise} Success : {Object}
   *                    Reject : errs
   */
  load_objects_in(objects, not_names = new Set(), objects_name = "") {
    return new Promise((success, reject) => {
      let objs = {};
      let nb_rows_loaded = 0;
      //starts higher than nb_rows_loaded to ensure we go through all
      let nb_rows_to_load = 1;
      let errs = [];

      //
      // Iterate objects
      {
        objects.forEach((obj, key) => {
          const full_name = objects_name + "." + key;
          //
          // Not a property we want
          {
            if (not_names.has(full_name)) {
              return;
            }
          }

          nb_rows_to_load++; //both cases below raises a promise
          //
          // Obj is a row description => parse row
          // a row description has id, name and optionnal template_name
          {
            const obj_keys = Object.keys(obj);
            const obj_length = obj_keys.length;
            if (
              obj_keys.includes("id") &&
              obj_keys.includes(name) &&
              (obj_length === 2 || obj_keys.includes("template_name"))
            ) {
              this.parse_row_object(obj).then((instance) => {
                on_instanciated(full_name, instance);
              }, on_error);
            }
          }

          //
          // Not a row description -> recursive call
          {
            this.load_objects_in(objects, not_names, full_name).then((objs) => {
              on_instanciated(full_name, objs);
            }, on_error);
          }
        });
      }

      //because nb_rows_to_load started at nb_rows_loaded+1
      on_parsed();

      //
      // === Async callbacks ===
      function on_instanciated(full_name, instance) {
        try {
          let refs = Scripted_Type.get_reference(objs, full_name, true, 1);

          refs.obj[refs.last_accessor_names[0]] = instance;
          on_parsed();
        } catch (ex) {
          on_error(ex);
        }
      }

      function on_error(err) {
        errs.push(err);
        on_parsed();
      }

      function on_parsed() {
        nb_rows_loaded++;
        //
        // All promises are not over
        {
          if (nb_rows_loaded !== nb_rows_to_load) {
            return;
          }
        }

        if (errs.length === 0) {
          success(objs);
        } else {
          reject(errs);
        }
      }
    });
  }

  /**
   *
   * @param {string|string[]} name Name can include multiple variables separated by dot
   *                  Can also include object member's idx (integer)
   *                  If an array, means accessors are already splitted
   * @param {bool | optional} request_environment If must request parent when object
   *                                              is missing from this
   *
   * @return {Promise}
   */
  get_object(name, request_environment = false) {
    return new Promise((success, reject) => {
      const name_parts =
        name instanceof Array ? name : Scripted_Type.get_accessor_parts(name);
      let row_descr = this.objects;
      let accessor_id = 0;
      //
      // Looking for in this.objects
      {
        for (; accessor_id < name_parts.length; accessor_id++) {
          const sub_name = name_parts[accessor_id];

          //
          // Fetch row_descr[sub_name] into row_descr
          // with sub_name as an integer idx or string key
          {
            const member_idx = Number.parseInt(sub_name);
            if (!isNaN(member_idx)) {
              // iterate members to fetch the number member_idx
              let j = 0;
              for (const key in row_descr) {
                if (j === member_idx) {
                  row_descr = row_descr[key];
                  break;
                }

                j++;
              }

              //
              // Member number sub_name not found
              if (j !== member_idx) {
                not_found_msg();
                break;
              }
            } else {
              row_descr = row_descr[sub_name];
            }
          }

          //
          // Found or nothing found in iteration ?
          {
            if (!row_descr) {
              break;
            }

            //
            // Row description found
            // (eventual next accessor parts are object's properties)
            if (row_descr.id && row_descr.name) {
              break;
            }
          }
        }
      }

      //
      // Not found and no desired request to environement
      if (!row_descr && !request_environment) {
        not_found_msg();
        return reject();
      }

      //
      // Found
      {
        if (row_descr) {
          let instance;
          //
          // Construct name with useful parts
          // (=>not eventual object's properties in name)
          const obj_name = name_parts.slice(0, accessor_id).join(".");
          logger.log = "Fetching instance of " + obj_name + "...";

          //
          //Fetching from already loaded instances
          {
            instance = this.instances.get(obj_name);
            if (instance) {
              return send_instance(instance);
            }
          }

          //
          // Parse row to instanciate object
          {
            this.parse_row_object(row_descr).then(success, (error) => {
              reject(error);
            });
          }

          //
          // No need to request environment
          return;
        }
      }

      //
      // Request environment
      {
        not_found_msg();
        return this.request_object(name).then(send_instance, reject);
      }

      //
      // If instance was found before iterating all accessors, finish it
      function send_instance(instance) {
        for (let i = accessor_id + 1; i < name_parts.length; i++) {
          const access_name = name_parts[i];

          if (!instance[access_name]) {
            const msg =
              "Instance " +
              name_parts.slice(0, accessor_id + 1).join(".") +
              " has no property " +
              access_name +
              " (pointed by " +
              name_parts.slice(accessor_id + 1).join(".") +
              ")";
            logger.error = msg;

            return reject(msg);
          }

          instance = instance[access_name];
        }

        success(instance);
      }

      function not_found_msg() {
        const msg =
          "Value " +
          sub_name +
          " is not a member of " +
          name_parts[i - 1] +
          " (" +
          name +
          ") in this (file " +
          name +
          ")";

        if (request_environment) {
          logger.warn = msg + ". Requesting environment";
        } else {
          logger.error = msg;
        }
      }
    });
  }

  //
  // === OBJECTS CONSTRUCTION ===
  /**
   *
   * @return {Promise}
   */
  construct_object_from_type_name(type_name, params) {
    return new Promise((success, reject) => {
      //
      // Check argument
      {
        if (!type_name || type_name.length === 0) {
          const msg = "No type_name set or empty";
          logger.error = msg;

          return reject(msg);
        }
      }

      this.request_type(type_name)
        .then(
          (type_obj) => {
            success(new type_name(...arguments.slice(1)));
          },
          (error) => {
            reject(error);
          }
        )
        .catch((ex) => {
          throw ex;
        });
    });
  }

  /**
   * Replace variables into string and return the new string
   * @param {string} str
   *
   * @return{Promise}
   */
  parse_string(str) {
    return new Promise((success, reject) => {
      //
      // Extract everyting which is between braces
      // => variable names
      let vars = str.match(/(?<=\{)\s*[^\}]*\s*(?=\})/g);
      if (!vars) {
        return success(str);
      }

      let nb_async_got = 0;
      let nb_async_tot = vars.length;
      function on_async_got() {
        nb_async_got++;
        if (nb_async_got !== nb_async_tot) {
          return;
        }

        //
        // Else everything's ready
        // Format final string replacing every variable by its value
        {
          let parsed_str = str;
          {
            for (let i = 0; i < vars.length; i++) {
              // replace the next found variable
              parsed_str = parsed_str.replace(/\{\s*[^\}]*\s*\}/, vars[i]);
            }
          }

          logger.log = "Parsed string : " + parsed_str + " (from " + str + ")";
          success(parsed_str);
        }
      }

      //
      // Fetch every variable value
      {
        for (let i = 0; i < vars.length; i++) {
          const var_name = vars[i];

          vars[i] = this.get_object(vars[i], true)
            .then((var_str) => {
              if (!var_str) {
                logger.error = "Variable not found : " + var_name;
                vars[i] = "<undefined : " + var_name + ">";
                on_async_got();
              } else if (!util.text.String.is(vars[i])) {
                //
                // String conversion attempt
                try {
                  vars[i] = new String(vars[i]) + "";
                  reparse();
                } catch (ex) {
                  const var_type = typeof vars[i];
                  const var_class =
                    var_type === "object" ? "(" + vars[i].class.name + ")" : "";

                  logger.error =
                    "Could not convert variable " +
                    var_name +
                    " of type " +
                    var_type +
                    var_class +
                    " to string : " +
                    ex;
                  vars[i] = "<wrong_type : " + var_name + " (";
                  var_type + var_class + " )>";

                  on_async_got();
                }
              } else {
                reparse();
              }

              //
              // Parse the fetched variable which may contains variable
              function reparse() {
                vars[i] = this.parse_string(vars[i])
                  .then((var_str) => {
                    vars[i] = var_str;
                    on_async_got();
                  })
                  .catch((ex) => {
                    const msg =
                      "Exception reparsing string " + vars[i] + " : " + ex;
                    logger.error = msg;

                    on_async_got();
                  });
              }
            })
            .catch((ex) => {
              const msg = "Exception fetching string " + vars[i] + " : " + ex;
              logger.error = msg;

              on_async_got();
            });
        }
      }
    });
  }
}

Scripted_File.init(require("./Scripted_File_properties"), module);
