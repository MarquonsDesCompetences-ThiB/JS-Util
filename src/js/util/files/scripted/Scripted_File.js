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
    {
      const name_parts = obj_name.split(".");
      //
      // Iterate name_parts ignoring last one
      for (let i = 0; i < name_parts.length - 1; i++) {
        const subname = name_parts[i];
        if (!obj_ref[subname]) {
          obj_ref[subname] = {};
        }
        obj_ref = obj_ref[subname];
      }
      obj_name = name_parts[name_parts.length - 1];

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
    let obj_params = {};
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
   * @param {*} col_id
   * @param {*} value
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
    }

    //
    // Value is a variable
    {
      if (value[0] === "{") {
        const last_char = value.length - 1;
        if (value[last_char] !== "}") {
          const msg =
            "Variable in column " + col_id + " has no closing bracket";
          logger.error("Scripted_File#parse_column_value " + msg);
          return undefined;
        }

        const var_name = value.substring(1, last_char);
        let obj = this.get_object(var_name);
        if (obj == null) {
          const msg =
            "Variable " +
            var_name +
            " does not exist in file " +
            this.name +
            " ; checking environment...";
          logger.log("Scripted_File#parse_column_value " + msg);

          //
          // Request from environment
          obj = this.request_object(var_name);
          if (obj == null) {
            const msg =
              "Variable " + var_name + " does not exist in environment neither";
            logger.error("Scripted_File#parse_column_value " + msg);
          }
        }
        return obj;
      }
    }

    //
    // Value is a parameter
    let constructor;
    //
    // Fetch constructor
    {
      let type_name = this.cols_types[col_id];
      if (!type_name) {
        const msg = "Column " + col_id + " has no type set";
        logger.error("Scripted_File#parse_column_value " + msg);
        return undefined;
      }

      constructor = this.get_object(type_name);
      if (constructor == null) {
        const msg =
          "Type " +
          type_name +
          " does not exist in file " +
          this.name +
          " ; checking environment...";
        logger.log("Scripted_File#parse_column_value " + msg);

        //
        // Request from environment
        constructor = this.request_object(type_name);
        if (constructor == null) {
          const msg =
            "Type " + type_name + " does not exist in environment neither";
          logger.error("Scripted_File#parse_column_value " + msg);
          return undefined;
        }
      }
    }

    return constructor(value);
  }

  //
  // === GETTERS ===
  get_object(name) {
    const name_parts = name.split(".");
    //
    // Looking for in this.objects
    {
      let json = this.objects;
      for (let i = 0; i < name_parts.length; i++) {
        const sub_name = name_parts[i];
        if (!json[sub_name]) {
          let msg = "Value " + sub_name + " is not ";
          if (i === 0) {
            msg += "in environment";
          } else {
            msg += "a member of " + name_parts[i - 1];
          }
          msg += " (from " + name + ")";
          logger.warn("Scripted_File#get_object " + msg);
          return undefined;
        }

        json = json[sub_name];
      }

      const msg =
        "Value " +
        name +
        " of type " +
        this.objects_type +
        " found in file " +
        this.name;
      logger.log("Scripted_File#get_object " + msg);
      return json;
    }
  }
}

module.exports = Scripted_File;
