"use strict";
const _File = require("../File");

/**
 * Rows :
 *  1 : Headings
 *  2 : Objects types
 *  Next ones : objects declaration
 *
 * Columns :
 *  1 : Objects names
 */
class Scripted_File extends _File {
  static owned_members = [
    //
    // string
    // Type of objects listed in this file
    "objects_type",

    //
    // string[]
    // Members names of values in the specified column
    "cols_names",

    //
    // string[]
    // Types of values in the specified column
    // Determined by the 2nd row
    "cols_types",

    //
    // {Object -> Object}
    // Rows as objects
    // Object associating object name (specified in row) to object
    // All objects are of type this.objects_type
    "objects",

    //
    // {function}
    // Function to call to request an object from environment
    "request_object",
  ];

  constructor(obj = undefined, child_owned_members = []) {
    super(Scripted_File.owned_members.concat(child_owned_members));

    this.set(obj);
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

    logger.log("Scripted_File#parse Reading file " + this.name + "...");
    this.read(function (err) {
      if (err) {
        const msg = "Error reading file " + this.name + " : " + err;
        logger.error("Scripted_File#parse::read " + msg);
        return cbk(msg);
      }
      on_read();
    });

    function on_read() {
      if (!(that.content instanceof Array)) {
        that.to_csv_array();
      }

      const content = that.content;
      //
      // Check enough rows
      {
        if (content.length < 2) {
          const msg =
            "File " +
            that.name +
            " should have at least 2 rows (meaning empty datas)";
          logger.warn("Scripted_File#parse::read " + msg);
          return cbk(msg);
        }
      }

      let nb_parsed_rows = 0;
      //
      // Fetch 1st row : columns names
      {
        const row = content[0];
        //
        // Iterate ignoring 1st column
        for (let i = 1; i < row.length; i++) {
          const member_name = row[i];
          if (
            !util.text.String.is_string(member_name) ||
            member_name.length === 0
          ) {
            const msg =
              "Column " + i + " from file " + that.name + " has no member name";
            logger.warn("Scripted_File#parse::read " + msg);
          }
          that.cols_names.push(member_name);
        }
        nb_parsed_rows++;
      }

      //
      // Fetch 2nd row : columns types
      {
        const row = content[1];
        //
        // Iterate ignoring 1st column
        for (let i = 1; i < row.length; i++) {
          const type = row[i];
          if (!util.text.String.is_string(type) || type.length === 0) {
            const msg =
              "Column " + i + " from file " + that.name + " has no type";
            logger.error("Scripted_File#parse::read " + msg);
          } else if (!this.request_object(type)) {
            const msg =
              "Unexisting type " +
              type +
              " used in column " +
              i +
              " of file " +
              that.name;
            logger.error("Scripted_File#parse::read " + msg);
          }
          that.cols_types.push(type);
        }
        nb_parsed_rows++;
      }

      //
      // Fetch next rows
      {
        //
        // Iterate rows skipping 2 firsts ones (headings and types)
        for (let i = 2; i < content.length; i++) {
          if (that.parse_object_row(content[i])) {
            nb_parsed_rows++;
          } else {
            const msg = "Could not parse row " + i;
            logger.error("Scripted_File#parse::read " + msg);
          }
        }

        // nb_rows
        const nb_rows = content.length;
        const msg = nb_parsed_rows + " parsed rows/" + nb_rows;
        //
        // Not all rows parsed
        {
          if (nb_rows !== nb_parsed_rows) {
            logger.error("Scripted_File#parse::read Only " + msg);
            return cbk("Only " + msg, nb_parsed_rows);
          }
        }

        //
        // Success : All rows parsed
        {
          logger.log("Scripted_File#parse::read " + msg);
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
        logger.error("Scripted_File#parse_object_row " + msg);
        return false;
      }
    }
    let nb_parsed_cols = 0;

    //
    // Fetch/create object reference from 1st column
    let obj_name = row[0];
    let obj_ref = this.objects;
    let obj_params = {};
    {
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
        const msg =
          "Object " +
          obj_name +
          " requested through " +
          row[0] +
          " amready exists and will be removed";
        logger.warn("Scripted_File#parse_object_row " + msg);
      }
    }

    //
    // Fetch params from next columns
    {
      for (let col_id = 1; col_id < row.length; col_id++) {
        const member_name = this.cols_names[col_id];
        if (!member_name) {
          const msg = "Column " + col_id + " has no name";
          logger.error("Scripted_File#parse_object_row " + msg);
          continue;
        }

        obj_params[member_name] = this.parse_column_value(col_id, row[col_id]);
        if (!obj_params[member_name]) {
          const msg =
            "Value from column " +
            member_name +
            "(" +
            col_id +
            ") could not be parsed";
          logger.error("Scripted_File#parse_object_row " + msg);
          continue;
        }
        nb_parsed_cols++;
      }
    }

    //
    // Get object constructor
    let constructor;
    {
      constructor = this.request_object(this.objects_type);
      if (!constructor) {
        const msg = "Constructor for type " + this.objects_type + " not found";
        logger.error("Scripted_File#parse_object_row " + msg);
        return false;
      }
    }

    //
    // Construct object
    {
      obj_ref = new constructor(obj_params);
      if (!obj_ref) {
        const msg =
          "Object " +
          row[0] +
          " of type " +
          this.objects_type +
          " could not be constructed";
        logger.error("Scripted_File#parse_object_row " + msg);
        return false;
      }
    }

    const msg = nb_parsed_cols + " columns parsed/" + row.length;
    logger.log("Scripted_File#parse_object_row " + msg);
    return true;
  }

  /**
   *
   * @param {string} name Name can include :
   *                        - multiple variables separated by dot
   *                        - object member's idx (integer)
   *                      This name can ended by =<object_name_to_copy>
   *
   * @return {Object} Object containing :
   *                    - obj_ref,
   *                    - member_name,
   *                    - init_obj : Object to use
   *                                  to init obj_ref[member_name] members
   */
  parse_column_name(name) {
    const equal_parts = name.split("=");

    const name_parts = equal_parts[0].split(".");
    let obj_ref = this.objects;
    //
    // Fetch obj_ref iterating name_parts ignoring last one
    {
      for (let i = 0; i < name_parts.length - 1; i++) {
        const subname = name_parts[i];
        if (!obj_ref[subname]) {
          obj_ref[subname] = {};
        }
        obj_ref = obj_ref[subname];
      }
    }

    //
    // Another object has to be cloned
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
          logger.error("Scripted_File#parse_column_name " + msg);
        }
        // else if obj has a clone function -> clone it
        else if (typeof obj.clone === "function") {
          obj = obj.clone();
        }
        //else warn the object will be given as is
        else {
          const msg =
            "The object " +
            equal_parts[1] +
            " has no clone method ; original references will be used";
          logger.warn("Scripted_File#parse_column_name " + msg);
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
        logger.warn("Scripted_File#parse_column_value " + msg);
        return "";
      }

      if (col_id >= this.cols_types.length) {
        const msg =
          "Argument col_id is wrong (" +
          col_id +
          ") ; should be in [0; " +
          this.cols_types.length +
          "[";
        logger.error("Scripted_File#parse_column_value " + msg);
        return undefined;
      }
    }

    let is_array = false;
    let arr_strings;
    let arr_objects = [];

    //
    // Value is an array
    {
      if (value[0] === "[") {
        const last_char = value.length - 1;
        if (value[last_char] !== "]") {
          const msg =
            "Variable in column " + col_id + " has no closing bracket";
          logger.error("Scripted_File#parse_column_value " + msg);
          return undefined;
        }

        is_array = true;
        arr_strings = value.split(",");
      } else {
        arr_strings = [value];
      }
    }

    for (let i = 0; i < arr_strings.length; i++) {
      const value = arr_strings[i];

      //
      // Value is a variable
      {
        if (value[0] === "{") {
          const last_char = value.length - 1;
          if (value[last_char] !== "}") {
            const msg =
              "Variable in column " + col_id + " has no closing brace";
            logger.error("Scripted_File#parse_column_value " + msg);
            return undefined;
          }

          const var_name = value.substring(1, last_char);
          let obj = this.get_object(var_name);
          if (obj == null) {
            const msg = "Variable " + var_name + " does not exist";
            logger.error("Scripted_File#parse_column_value " + msg);
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
          if (str[0] === "{") {
            if (str[str.length - 1] !== "}") {
              const msg =
                "The parameter " +
                str +
                " from column " +
                col_id +
                " has no ending brace";
              logger.warn("Scripted_File#parse_column_value " + msg);
              continue;
            }

            // get object pointed by variable params[i] (str)
            params[i] = this.get_object(str.substring(1, str.length - 1));
          }
        }
      }

      //
      // Fetch constructor
      let constructor;
      {
        let type_name = this.cols_types[col_id];
        if (!type_name) {
          const msg = "Column " + col_id + " has no type set";
          logger.error("Scripted_File#parse_column_value " + msg);
          arr_objects.push(undefined);
          continue;
        }

        constructor = this.get_object(type_name, true);
        if (constructor == null) {
          const msg = "Type " + type_name + " does not exist";
          logger.error("Scripted_File#parse_column_value " + msg);
          arr_objects.push(undefined);
          continue;
        }
      }
      arr_objects.push(constructor(...params));
    }

    if (is_array) {
      return arr_objects;
    }
    return arr_objects[0];
  }

  //
  // === GETTERS ===
  /**
   *
   * @param {string} name Name can include multiple variables separated by dot
   *                  Can also include object member's idx (integer)
   * @param {bool | optional} request_environment If must request parent when object
   *                                              is missing from this
   */
  get_object(name, request_environment = false) {
    const name_parts = name.split(".");
    //
    // Looking for in this.objects
    {
      let json = this.objects;
      for (let i = 0; i < name_parts.length; i++) {
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
              return undefined;
            }
          } else {
            json = json[sub_name];
          }
        }

        if (!json) {
          not_found_msg();
          return undefined;
        }

        function not_found_msg() {
          let msg = "Value " + sub_name + " is not ";
          if (i === 0) {
            msg += "in environment";
          } else {
            msg += "a member of " + name_parts[i - 1];
          }
          msg += " (from " + name + ")";
          logger.warn("Scripted_File#get_object " + msg);
        }
      }

      const msg =
        "Value " +
        name +
        " of type " +
        this.objects_type +
        " found in file " +
        this.name;
      logger.log("Scripted_File#get_object " + msg);

      if (json || !request_environment) {
        return json;
      }
    }

    //
    // Request environment
    const msg = "Requesting environment";
    logger.log("Scripted_File#get_object " + msg);
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
            return undefined;
          }
        } else {
          json = json[sub_name];
        }
      }

      if (!json) {
        not_found_msg();
        return undefined;
      }

      function not_found_msg() {
        let msg = "Value " + sub_name + " is not ";
        if (i === 0) {
          msg += "in environment";
        } else {
          msg += "a member of " + name_parts[i - 1];
        }
        msg += " (from " + name + ")";
        logger.warn("Scripted_File#delete_object " + msg);
      }
    }

    delete json[name_parts[parts_length - 1]];

    const msg = "Variable " + name + " deleted from parsed file " + this.name;
    logger.log("Scripted_File#delete_object " + msg);
  }
}

module.exports = Scripted_File;
