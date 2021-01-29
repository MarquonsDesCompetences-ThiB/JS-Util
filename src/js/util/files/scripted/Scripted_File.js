"use strict";

const Scripted_Type = require("./Scripted_Type");

/**
 * Rows :
 *  1 : Headings, every column havin objects type in parenthesis
 *  Next ones : objects declaration
 *
 * Columns :
 *  1 : Objects names
 */
const Scripted_File = (function () {
  class properties extends util.obj.Properties {
    static get enumerable() {
      util.obj.Properties.init = properties;
      return {
        //
        // string[]
        // Members names of values in the specified column
        cols_names: {
          enumerable: true,
          writable: true,
          configurable: false,
        },

        //
        // string[]
        // Types of values in the specified column
        // Determined by the 2nd row
        cols_types: {
          enumerable: true,
          writable: true,
          configurable: false,
        },

        //
        // {Object -> Object}
        // Rows as objects
        // Object associating object name (specified in row) to object
        // All objects are of type this.cols_types[0]
        objects: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        //
        // {function}
        // Function to call to request a type from environment
        request_type: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        //
        // {function}
        // Function to call to request an object from environment
        request_object: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },
      };
    }

    static get not_enumerable() {
      util.obj.Properties.init = properties;
      return [];
    }

    static get lengthes() {
      util.obj.Properties.init = properties;

      return {};
    }

    static get regex() {
      util.obj.Properties.init = properties;
      return {};
    }
  }

  class Scripted_File_ extends util.files.Csv_File {
    constructor(obj = undefined, update_members = false) {
      super(obj, update_members);
      this.properties = properties.props;
    }

    //
    // === PARSERS ===
    parse(cbk) {
      this.objects = {};
      this.cols_names = [];
      this.cols_types = [];

      let that = this;
      if (this.content) {
        on_read();
        return true;
      }

      logger.log = "Reading file " + this.name + "...";
      this.read(function (err) {
        if (err) {
          const msg = "Error reading file " + this.name + " : " + err;
          logger.error = msg;
          return cbk(msg);
        }
        on_read();
      });
      return true;

      function on_read() {
        if (!(that.content instanceof Array)) {
          that.to_csv_array();
        }

        const content = that.content;
        let nb_parsed_rows = 0;
        //
        // Fetch 1st row : columns' names and types
        {
          const row = content[0];
          //
          // Iterate columns
          for (let col_id = 0; col_id < row.length; col_id++) {
            try {
              const col_str = row[col_id];
              // 0 is name, 1 is type
              const heading_parts = col_str
                .match(/^([^\(]*)?(\(([^\)]*)\))?$/, "$1|||$3")
                .split("|||");

              //
              // Extracted name
              const member_name = col_str[0];
              if (
                !util.text.String.is(member_name) ||
                member_name.length === 0
              ) {
                logger.warn =
                  "Column " +
                  col_id +
                  " from file " +
                  that.name +
                  " has no member name";
              }

              //
              // Extracted type
              {
                const type = col_str[1];
                if (!util.text.String.is(type) || type.length === 0) {
                  const msg =
                    "Column " +
                    col_id +
                    " from file " +
                    that.name +
                    " has no type";
                  logger.error = "Scripted_File#parse::read " + msg;
                } else if (!this.request_type(type)) {
                  const msg =
                    "Unexisting type " +
                    type +
                    " used in column " +
                    col_id +
                    " of file " +
                    that.name;
                  logger.error = "Scripted_File#parse::read " + msg;
                }
                that.cols_types.push(type);
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
            } finally {
              // push even if not found to keep column ids order
              that.cols_names.push(member_name);
            }
          }
          nb_parsed_rows++;
        }

        //
        // Fetch next rows
        {
          //
          // Iterate rows skipping first one (headings)
          for (let i = 1; i < content.length; i++) {
            if (that.parse_object_row(content[i])) {
              nb_parsed_rows++;
            } else {
              logger.error = "Could not parse row " + i;
            }
          }

          // nb_rows
          const nb_rows = content.length;
          const msg =
            nb_parsed_rows +
            " parsed rows/" +
            nb_rows +
            " in file " +
            that.name;
          //
          // Not all rows parsed
          {
            if (nb_rows !== nb_parsed_rows) {
              logger.error = "Only " + msg;
              return cbk("Only " + msg, nb_parsed_rows);
            }
          }

          //
          // Success : All rows parsed
          {
            logger.info = msg;
            cbk(undefined, nb_parsed_rows);
          }
        }
      }
    }

    parse_object_row(row) {
      //
      // Check argument
      {
        if (!row || !(row instanceof Array)) {
          const msg = "No row set or not an array";
          logger.error = msg;
          throw TypeError(msg);
        }
      }
      let nb_parsed_cols = 0;

      //
      // Fetch/create object reference from 1st column
      let obj_name = row[0];
      let obj_ref = this.objects;
      let obj_params = {};
      {
        // object with {obj_ref, member_name and eventual init_obj}
        const name_parts = this.parse_column_name(obj_name);
        obj_ref = name_parts.obj_ref;
        obj_name = name_parts.member_name;

        if (name_parts.init_obj) {
          obj_params = name_parts.init_obj;
        }

        nb_parsed_cols++;
      }

      //
      // Warn if already exists and will be removed
      {
        if (obj_ref[obj_name]) {
          logger.warn =
            "Object " +
            obj_name +
            " requested through " +
            row[0] +
            " in file " +
            this.name +
            " already exists and will be removed";
        }
      }

      //
      // Fetch params from next columns
      {
        for (let col_id = 1; col_id < row.length; col_id++) {
          try {
            const member_name = this.cols_names[col_id];
            {
              if (!member_name) {
                logger.error =
                  "Column " + col_id + " in file " + this.name + " has no name";
                continue;
              }
            }

            const obj_type = this.request_type(this.cols_types[col_id]);

            if (row[col_id].length === 0) {
              // if no default value loaded
              if (!obj_params[member_name]) {
                if (obj_type) {
                  obj_params[member_name] = new obj_type();
                } else {
                  obj_params[member_name] = "";
                }
              }
            }
            // else : cell has a value
            else {
              obj_params[member_name] = this.parse_column_value(
                col_id,
                row[col_id]
              );
            }

            nb_parsed_cols++;
          } catch (ex) {
            logger.error = ex;
          }
        }
      }

      //
      // Get row's object constructor
      let constructor;
      {
        constructor = this.request_type(this.cols_type[0]);
        if (!constructor) {
          logger.error =
            "Constructor not found for type " +
            this.cols_type[0] +
            " in file " +
            this.name;
          return false;
        }
      }

      //
      // Construct object
      {
        obj_ref[obj_name] = new constructor(obj_params);
        if (!obj_ref) {
          logger.error =
            "Object " +
            obj_name +
            " of type " +
            this.cols_type[0] +
            " could not be constructed in file " +
            this.name;
          return false;
        }
      }

      logger.log = nb_parsed_cols + " columns parsed/" + row.length;
      return true;
    }

    /**
     *
     * @param {string} name Name can include :
     *                        - multiple variables separated by dot
     *                        - object member's idx (integer)
     *                      This name can ended by ={<variable_to_copy>}
     *
     * @return {Object} Object containing :
     *                    - obj_ref,
     *                    - member_name,
     *                    - init_obj : Object to use
     *                                  to init obj_ref[member_name] members
     */
    parse_column_name(name) {
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
      let res = {};

      const equal_parts = name.split("=");
      //
      // Variable name
      {
        const var_accessors = equal_parts[0].match(/\b\w+\b/);
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
        res.member_name = var_accessors[var_accessors.length - 1];
        res.obj_ref = obj_ref;
      }

      //
      // Another object has to be cloned (equal_parts[1] exists)
      let obj;
      {
        if (equal_parts[1]) {
          obj = this.get_object(equal_parts[1], true);
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
        }
      }

      return {
        obj_ref: obj_ref,
        member_name: name_parts[name_parts.length - 1],
        init_obj: obj,
      };
    }

    /**
     * @param {integer} col_id
     * @param {string} value Can be a string containing :
     *                    - array of values
     *                    - listed values (separated by comma)
     *                        to be used as parameters in type's constructor call
     *                    - value : variable | raw value
     */
    parse_column_value(col_id, value) {
      //
      // Check arguments
      {
        if (!value || value.length === 0) {
          const msg = "Value is missing in column " + col_id;
          logger.warn = "Scripted_File#parse_column_value " + msg;
          throw TypeError(msg);
        }

        if (col_id >= this.cols_types.length) {
          const msg =
            "Argument col_id is wrong (" +
            col_id +
            ") ; should be in [0; " +
            this.cols_types.length +
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

      for (let i = 0; i < arr_strings.length; i++) {
        const value = arr_strings[i];

        //
        // Value is a variable
        {
          if (Scripted_Type.is_variable_name(value)) {
            let obj = this.get_object(value, true);
            if (obj == null) {
              logger.error = "Variable " + var_name + " does not exist";
              obj = "<undefined : " + value + ">";
            }
            arr_objects.push(obj);
            continue;
          }
        }

        //
        // Value is one or more parameters for a constructor
        let params;
        {
          params = value.split(",");
          //
          // Fetch params' variables
          for (let i = 0; i < params.length; i++) {
            const str = params[i];
            if (Typed_Script.is_variable_name(str)) {
              // get object pointed by variable params[i] (str)
              params[i] = this.get_object(str, true);
              if (!params[i]) {
                logger.error =
                  "Undefined variable " +
                  str +
                  " from " +
                  value +
                  " in column " +
                  col_id +
                  " of file " +
                  this.name;
                params[i] = "<undefined : " + str + ">";
              }
            }
          }
        }

        //
        // Fetch constructor
        let constructor;
        {
          let type_name = this.cols_types[col_id];
          if (!type_name) {
            logger.error =
              "Column " + col_id + " has no type set in file " + this.name;
            arr_objects.push(undefined);
            continue;
          }

          constructor = this.request_type(type_name);
          if (constructor == null) {
            logger.error =
              "Type " +
              type_name +
              " does not exist for column " +
              col_id +
              " in file " +
              this.name;
            arr_objects.push(undefined);
            continue;
          }
        }
        arr_objects.push(new constructor(...params));
      }

      if (is_array) {
        return arr_objects;
      }
      return arr_objects[0];
    }

    //
    // === GETTERS / SETTER ===
    /**
     *
     * @param {string} name Name can include multiple variables separated by dot
     *                  Can also include object member's idx (integer)
     * @param {bool | optional} request_environment If must request parent when object
     *                                              is missing from this
     */
    get_object(name, request_environment = false) {
      const name_parts = Scripted_Type.get_accessor_parts(name);
      //
      // Looking for in this.objects
      {
        let json = this.objects;
        for (let i = 0; i < name_parts.length - 1; i++) {
          const sub_name = name_parts[i];

          //
          // Fetch json[sub_name] into json
          // with sub_name as an integer idx or string key
          {
            const member_idx = Number.parseInt(sub_name);
            if (!isNaN(member_idx)) {
              // iterate members to fetch the number member_idx
              let j = 0;
              for (const key in json) {
                if (j === member_idx) {
                  json = json[key];
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
              json = json[sub_name];
            }
          }

          if (!json) {
            not_found_msg();
            break;
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
        }

        if (json || !request_environment) {
          return json;
        }
      }

      //
      // Request environment
      return this.request_object(name);
    }

    //
    // === DELETE ===
    /**
     *
     * @param {string} name
     */
    delete_object(name) {
      let name_parts = name.split(".");
      let json = this.objects;
      const parts_length = name_parts.length;
      for (let i = 0; i < parts_length; i++) {
        const sub_name = name_parts[i];

        //
        // Fetch json[sub_name] into json
        // with sub_name as an integer idx or string key
        {
          const member_idx = Number.parseInt(sub_name);
          if (!isNaN(member_idx)) {
            // iterate members to fetch the number member_idx
            // for delete instruction later
            let j = 0;
            for (const key in json) {
              if (j === member_idx) {
                //convert name_parts[j]'s integer to member name
                name_parts[j] = key;

                //
                //if not the last name part
                if (i < parts_length - 1) {
                  json = json[key];
                }
                break;
              }

              j++;
            }

            //
            // Member number sub_name not found
            if (j !== member_idx) {
              not_found_msg();
              return false;
            }
          } else {
            json = json[sub_name];
          }
        }

        if (!json) {
          not_found_msg();
          return false;
        }

        function not_found_msg() {
          let msg = "Value " + sub_name + " is not ";
          if (i === 0) {
            msg += "in environment";
          } else {
            msg += "a member of " + name_parts[i - 1];
          }
          msg += " (from " + name + ")";
          logger.warn = "Scripted_File#delete_object " + msg;
        }
      }

      delete json[name_parts[parts_length - 1]];

      const msg = "Variable " + name + " deleted from parsed file " + this.name;
      logger.log = "Scripted_File#delete_object " + msg;
      return true;
    }
  }

  return Scripted_File_.prototype.constructor;
})();

module.exports = Scripted_File;
