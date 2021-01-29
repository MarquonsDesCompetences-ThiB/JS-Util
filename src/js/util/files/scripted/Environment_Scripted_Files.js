"use strict";
/**
 * Preconds :
 *  global.util.files.Csv_File = class Csv_File
 *  global.util.obj.Obj = class Obj
 */
const Csv_File = global.util.files.Csv_File;
const Scripted_File = require("./Scripted_File");
const Scripted_Type = require("./Scripted_Type");

class Environment_Scripted_Files extends util.obj.Obj {
  constructor(obj = undefined) {
    super(obj);
  }

  //
  // === GETTERS / SETTERS
  //
  // === TYPES ===
  set_type(type_name, type_path, file_name = undefined) {
    //
    // Process preconds
    {
      //
      // type_name
      {
        if (!type_name) {
          const msg = "Argument type_name is undefined";
          logger.error = msg;
          throw TypeError(msg);
        }
        if (!util.text.String.is(type_name)) {
          const type = typeof type_name;
          const msg =
            "Argument type_name must be a string but is a " +
            type +
            (type === "object" ? " (" + type_name.constructor.name + ")" : "");
          logger.error = msg;
          throw TypeError(msg);
        }
      }

      //
      // type_path
      {
        if (!type_path) {
          const msg = "Argument type_path is undefined";
          logger.error = msg;
          throw TypeError(msg);
        }
        if (!util.text.String.is(type_path)) {
          const type = typeof type_path;
          const msg =
            "Argument type_path must be a string but is a " +
            type +
            (type === "object" ? " (" + type_path.constructor.name + ")" : "");
          logger.error = msg;
          throw TypeError(msg);
        }
      }
    }

    let type_ref;
    const type_accessors = Scripted_Type.get_accessor(type_name);
    //
    // Fetch types object to process (from file or global)
    {
      if (file_name) {
        type_ref = this.types.files[file_name];
      }

      if (!type_ref) {
        type_ref = this.types.objects;
      }
    }

    //
    // Go to before last accessor and create subobjects that need to be
    {
      for (let i = 0; i < type_accessors.length - 1; i++) {
        const type_name = type_accessors[i];
        if (!type_ref[type_name]) {
          type_ref[type_name] = {};
        }

        type_ref = type_ref[type_name];
      }
    }

    //
    // Warn if type will be removed
    const last_accessor = type_accessors[type_accessors.length - 1];
    {
      if (type_ref[last_accessor]) {
        logger.warn =
          "Type " +
          last_accessor +
          " from " +
          type_name +
          " already exists in file " +
          file_name +
          " and will be erased";
      }
    }

    //
    // Load type
    {
      types[last_accessor] = require(type_path);
      // if no error raised
      logger.info =
        "Loaded Type : " +
        last_accessor +
        " from " +
        type_name +
        " in file " +
        file_name;
    }
  }

  /**
   *
   * @param {string} type
   * @param {string | optional} file_name
   */
  get_type(type, file_name = undefined) {
    const formatted_type = Scripted_Type.get_type_name(type);

    //
    // Look for in files and return if found
    {
      if (file_name) {
        let types = this.types.files[file_name];
        if (types) {
          if (types[formatted_type]) {
            return types[formatted_type];
          }
        }
      }
    }

    //
    // Return global
    {
      return this.types.objects[formatted_type];
    }
  }

  //
  // === OBJECTS VARIABLES ===
  instanciate(var_name, type_name, file_name) {
    {
      if (!this.types.objects[type_name]) {
        const msg =
          "Unknown type " +
          type_name +
          " to instanciate " +
          var_name +
          " from file " +
          file_name;
        logger.error = msg;
        throw TypeError(msg);
      }
    }

    let file_values = this.values.files[file_name];
    {
      if (!file_values) {
        const msg =
          "Unknown file " +
          file_name +
          " to instanciate " +
          var_name +
          " (" +
          type_name +
          ")";
        logger.error = msg;
        throw ReferenceError(msg);
      }

      if (file_values[var_name]) {
        logger.warn =
          var_name +
          " already exists for file " +
          file_name +
          " and will be replaced by a " +
          type_name;
      }
    }
  }

  /**
   *
   * @param {string|string[]} name Name can include multiple variables separated by dot
   *                  Can also include object member's idx (integer)
   *                  If an array, means accessors are already splitted
   *                  First accesor can be the file name
   *                  => makes file_name argument useless
   *
   * @param {string | optional} file_name Set undefined if var_name's
   *                                      first accessor is the file name
   *
   *
   * @return {Promise} Success : {Object}
   *                   Reject : errs
   */
  get_object(var_name, file_name = undefined) {
    return new Promise((success, reject) => {
      const accessors =
        var_name instanceof Array
          ? var_name
          : Scripted_Type.get_accessor_parts(var_name);
      const first_access = accessors[0];

      //
      // Look for in files and return if found
      {
        if (file_name || this.values.files[first_access]) {
          let file = file_name
            ? this.values.files[file_name]
            : this.values.files[first_access];

          //if file_name argument is wrong
          if (!file) {
            const msg = "No file " + file_name + " (to fetch " + var_name + ")";
            logger.error = msg;
            throw TypeError(msg);
          }

          //
          // No variable requested => fetch all file's objects
          {
            const accessors_length = accessors.length;
            if (
              (file_name && accessors_length === 0) ||
              (!file_name && accessors_length === 1)
            ) {
              return file.get_all_objects().then(success, reject);
            }
          }

          //
          // Request file
          return file
            .get_object(
              file_name
                ? accessors
                : //removing the 1st accessor -> file's name
                  accessors.slice(1)
            )
            .then(success, (error) => {
              logger.error =
                var_name +
                " not instanciated from " +
                file_name +
                " : " +
                error +
                " \nLooking for in globals...";
              search_globals.apply(this);
            });
        }
      }

      search_globals.apply(this);

      //
      // Look for in global and return if found
      function search_globals() {
        let vars = this.global;
        for (let i = 0; i < accessors.length; i++) {
          if (!vars[accessors[i]]) {
            const msg =
              "Variable " +
              accessors[i] +
              " referenced in " +
              var_name +
              " not found in global values";
            logger.error = msg;

            return reject(msg);
          }

          vars = vars[accessors[i]];
        }

        success(vars);
      }
    });
  }

  /**
   *
   * @param {string} var_name First accessor can be a file name
   * @param {string | optional} file_name Set undefined if var_name's
   *                                      first accessor is the file name
   *
   * @return{bool}
   */
  delete_object(var_name, file_name = undefined) {
    const accessors = Scripted_Type.get_accessor_parts(var_name);
    const first_access = accessors[0];
    const last_access = accessors[accessors.length - 1];

    //
    // Look for in files and delete if found
    {
      if (file_name || this.values.files[first_access]) {
        let vars = file_name
          ? this.values.files[file_name]
          : this.values.files[first_access];
        if (!vars) {
          const msg =
            "No variables instanciated for file " + file_name
              ? file_name
              : first_access + " (to delete " + var_name + ")";
          logger.warn = msg;
          return false;
        }

        for (let i = file_name ? 0 : 1; i < accessors.length - 1; i++) {
          if (!vars[accessors[i]]) {
            logger.warn =
              "Variable " +
              accessors[i] +
              " referenced in " +
              var_name +
              " not found in file " +
              file_name;
            return false;
          }

          vars = accessors[i];
        }

        if (!vars[last_access]) {
          logger.warn =
            "Variable " +
            last_access +
            " referenced in " +
            var_name +
            " not found in file " +
            file_name;
          return false;
        }

        delete vars[last_access];
        return true;
      }
    }

    //
    // Look for in global and delete if found
    {
      let vars = this.global;
      for (let i = 0; i < accessors.length - 1; i++) {
        if (!vars[accessors[i]]) {
          logger.warn =
            "Variable " +
            accessors[i] +
            " referenced in " +
            var_name +
            " not found in global values";
          return false;
        }

        vars = accessors[i];
      }

      if (!vars[last_access]) {
        logger.warn =
          "Variable " +
          last_access +
          " referenced in " +
          var_name +
          " not found in global values";
        return false;
      }
      delete vars[last_access];
      return true;
    }
  }

  //
  // === TYPES FILES ===
  /**
   *
   * @param {Csv_File | _File | Object} file If not Csv_File type, will be created
   *
   *
   * @return Promise    Success:  {integer} nb_rows_parsed_success
   *                    Reject : {string[]} errs
   */
  add_types_file(file) {
    return new Promise((success, reject) => {
      //
      // Check arguments
      {
        if (!file) {
          const msg = "file argument is not specified";
          logger.error = msg;
          return reject(msg);
        }
        if (!file.name) {
          const msg = "file has no name member";
          logger.error = msg;
          return reject(msg);
        }

        let files = this.types.files;
        //
        // file.name already exists
        if (files[file.name]) {
          const msg =
            "Types file " +
            file.name +
            " already exists ; ignoring this new add";
          logger.error = msg;
          return reject(msg);
        }
      }

      let file_obj = file;
      file_obj.path = this.files_path + file_obj.path;
      if (!(file_obj instanceof util.files.File)) {
        file_obj = new util.files.File(file_obj);
      }

      //
      // Add file
      const fName = file.name;
      this.types.files[fName] = file_obj;

      /*const obj_type = Scripted_Type.get_type_name(file.object_type);
      if (!this.types.files_order_loading[obj_type]) {
        this.types.files_order_loading[obj_type] = [];
      }
      this.types.files_order_loading[obj_type].push(fName);
*/

      try {
        this.parse_type_file(fName).then(success, reject);
      } catch (ex) {
        const msg = "Error parsing type file " + this.name + " : " + ex;
        logger.error = msg;
        reject([msg]);
      }
    });
  }

  /**
   *
   * @return Promise    Success:  {integer} nb_files_parsed_success
   *                    Reject : {string[]} errs
   */
  parse_types_files() {
    return new Promise(function (success, reject) {
      const files_order = this.types.files_order_loading;
      const nb_tot_files = files_order.length;
      let nb_files_parsed = 0;
      let errs = [];

      for (let i = 0; i < nb_tot_files; i++) {
        this.parse_type_file(files_order[i]).then(on_parsed, (err) => {
          errs.push(err);
          on_parsed();
        });
      }

      function on_parsed() {
        nb_files_parsed++;
        if (nb_files_parsed !== nb_tot_files) {
          return;
        }

        //
        // All parsings done
        {
          const msg =
            "Parsing of " +
            nb_tot_files +
            " files done with " +
            errs.length +
            " errors";

          const nb_well_parsed = nb_files_parsed - errs.length;
          if (errs.length > 0) {
            logger.error = msg;
            return reject(errs, nb_well_parsed);
          }

          logger.log = msg;
          success(nb_well_parsed);
        }
      }
    });
  }

  /**
   *
   * @param {string} file_name File to parse ; must be a key of this.types.files
   *
   * @return Promise    Success:  {integer} nb_rows_parsed_success
   *                    Reject : {string} err
   */
  parse_type_file(file_name) {
    return new Promise((success, reject) => {
      let file = this.types.files[file_name];
      {
        if (!file) {
          const msg =
            "The specified file does not exist in environment : " + file_name;
          logger.error = msg;
          return reject(msg);
        }
      }

      if (file.content) {
        return parse.apply(this);
      }
      logger.log = "Reading file...";
      file.read().then(
        () => {
          parse.apply(this);
        },
        (error) => {
          reject(error);
        }
      );

      function parse() {
        if (!(file.content instanceof Array)) {
          file.to_csv_array();
        }

        const content = file.content;
        let nb_parsed_rows = 0;

        //
        // Iterate rows skipping first one (headings)
        let nb_async_got = 0;
        const nb_async_tot = content.length - 1;
        content.forEach((row, i) => {
          //
          // Skips headings row
          if (i === 0) {
            return;
          }

          this.parse_type_file_row(file_name, row).then(
            (file_name, row_name) => {
              nb_parsed_rows++;
              on_parsed();
            },
            (file_name, row_name, error) => {
              const msg =
                "Could not parse row " +
                row_name +
                " (" +
                i +
                ") from file " +
                file_name +
                " : " +
                error;
              logger.error = msg;

              on_parsed();
            }
          );
        });

        function on_parsed() {
          nb_async_got++;
          if (nb_async_got !== nb_async_tot) {
            return;
          }

          //
          // All rows parsed
          {
            // nb_rows skipping the first one : headings
            const nb_rows = content.length >= 1 ? content.length - 1 : 0;
            const msg =
              nb_parsed_rows +
              " parsed rows/" +
              nb_rows +
              " from file " +
              file_name;
            //
            // Not all rows parsed
            {
              if (nb_rows !== nb_parsed_rows) {
                logger.error = "Only " + msg;
                return reject("Only " + msg, nb_parsed_rows);
              }
            }

            //
            // Success : All rows parsed
            {
              logger.log = msg;
              success(nb_parsed_rows);
            }
          }
        }
      }
    });
  }

  /**
   * First value is type name,
   * second is value type
   * 3rd is value :
   *    - class path to load with Node#require()
   *    - raw value : string, int or float
   * @param {string} file_name
   * @param {array[3]} row
   *
   * @return {Promise}
   *              Success :
   *                file_name, row_name
   *              Reject :
   *                file_name, row_name, msg
   */
  parse_type_file_row(file_name, row) {
    return new Promise((success, reject) => {
      //
      // Check argument
      {
        if (!row || !(row instanceof Array)) {
          const msg = file_name + " : No row set or not an array";
          logger.error = msg;

          return reject(file_name, undefined, msg);
        }

        if (row.length < 3) {
          const msg =
            file_name +
            " : Row should have 3 columns but has only " +
            row.length;
          logger.error = msg;

          return reject(file_name, row[0], msg);
        }

        //
        // Warn unused columns
        if (row.length > 3) {
          logger.warn =
            file_name +
            " : Only the 3 first columns will be used for parsing (nb columns : " +
            row.length +
            ")";
        }
      }

      const [name, type, value] = row;
      switch (type) {
        //
        // Load source
        case "source":
          this.parse_string(value).then(
            (parsed_str) => {
              try {
                let obj = this.create_type(name);
                obj.object[obj.member] = require(parsed_str);
                const msg =
                  file_name + " - Class loaded : " + name + " (" + value + ")";
                logger.log = msg;
                return success(file_name, name);
              } catch (ex) {
                const msg =
                  "Couldn't load class " +
                  name +
                  " (" +
                  value +
                  " -> " +
                  parsed_str +
                  ") from file " +
                  file_name +
                  " : " +
                  ex;
                logger.error = msg;
                return reject(file_name, name, msg);
              }
            },
            (error) => {
              const msg =
                "Couldn't parse string of " +
                name +
                " : " +
                " from file " +
                file_name +
                " : " +
                error;
              logger.error = msg;

              reject(file_name, name, msg);
            }
          );
          break;

        // int or float
        case "number":
          //
          // int
          {
            const int = Number.parseInt(value);
            if (!Number.isNaN(int)) {
              let obj = this.create_object(name);
              obj.object[obj.member] = int;

              const msg =
                file_name + " - Integer loaded : " + name + " (" + value + ")";
              logger.log = msg;
              return success(file_name, name);
            }
          }

          //
          // float
          {
            const float = Number.parseFloat(value);
            if (!Number.isNaN(float)) {
              let obj = this.create_object(name);
              obj.object[obj.member] = float;

              const msg =
                file_name + " - Float loaded : " + name + " (" + value + ")";
              logger.log = msg;
              return success(file_name, name);
            }
          }

          {
            const msg =
              "Number " +
              name +
              " (" +
              value +
              ") from file " +
              file_name +
              " is neither an integer or a float";
            logger.error = msg;

            return reject(file_name, name, msg);
          }
          break;

        case "string":
          let obj = this.create_object(name);
          obj.object[obj.member] = value;
          const msg =
            file_name + " - String loaded : " + name + " (" + value + ")";
          logger.log = msg;
          return success(file_name, name);

          break;

        default: {
          const msg =
            "Unknown value type " +
            type +
            " for object " +
            name +
            " from file " +
            file_name;
          logger.warn = msg;

          return reject(file_name, name, msg);
        }
      }
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

      //
      // Fetch every variable value
      {
        let nb_vars_got = 0;
        const nb_vars_tot = vars.length;
        function on_variable() {
          nb_vars_got++;

          //
          // If variables are ready
          if (nb_vars_got === nb_vars_tot) {
            format_string();
          }
        }
        vars.forEach((var_name, i) => {
          this.get_object(var_name).then(
            (instance) => {
              if (!instance) {
                logger.error = "Variable not found : " + var_name;
                vars[i] = "<undefined : " + var_name + ">";

                on_variable();
              } else if (!util.text.String.is(instance)) {
                //
                // String conversion attempt
                try {
                  vars[i] = new String(instance) + "";
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
                }

                on_variable();
              } else {
                vars[i] = instance;

                //
                // Parse the fetched variable which may contains variable
                this.parse_string(vars[i]).then(
                  (var_str) => {
                    vars[i] = var_str;

                    on_variable();
                  },
                  (error) => {
                    logger.error =
                      "Error fetching variable " + var_name + " : " + error;
                    vars[i] = "<error : " + var_name + " (" + error + ")>";

                    on_variable();
                  }
                );
              }
            },
            (error) => {
              logger.error =
                "Error fetching variable " + var_name + " : " + error;
              vars[i] = "<error : " + var_name + " (" + error + ")>";

              on_variable();
            }
          );
        });
      }

      //
      // Format final string replacing every variable by its value
      function format_string() {
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
    });
  }

  //
  // === TYPES / OBJECTS ===
  /**
   *
   * @param {*} accessor
   *
   * @return {object|undefined} object : object pointed by accessor (without its last part)
   *                            member : last accessor's part
   *                            Undefined if failed
   */
  create_type(accessor) {
    //
    // Check name
    {
      if (!accessor || accessor.length === 0) {
        const msg = "No variable accessor set";
        logger.error = msg;
        return undefined;
      }
    }

    const name_parts = Scripted_Type.get_accessor_parts(accessor);
    let type_object = this.types.objects;
    //
    // Iterate name parts
    // ignoring the last one
    const last_idx = name_parts.length - 1;
    name_parts.forEach((part, idx) => {
      if (idx >= last_idx) {
        return;
      }

      if (!type_object[part]) {
        type_object[part] = {};
      }
      type_object = type_object[part];
    });

    const last_name = name_parts[last_idx];
    //
    // Warning if already exists => will be removed
    if (type_object[last_name]) {
      logger.warn = "Type " + accessor + " already exists";
    }

    return {
      object: type_object,
      member: last_name,
    };
  }

  /**
   *
   * @param {*} accessor
   *
   * @return {object|undefined} object : object pointed by accessor (without its last part)
   *                            member : last accessor's part
   *                            Undefined if failed
   */
  create_object(accessor) {
    //
    // Check name
    {
      if (!accessor || accessor.length === 0) {
        const msg = "No variable accessor set";
        logger.error = msg;
        return undefined;
      }
    }

    const name_parts = Scripted_Type.get_accessor_parts(accessor);
    let global_vals = this.global;
    //
    // Iterate name parts
    // ignoring the last one
    for (let i = 0; i < name_parts.length - 1; i++) {
      if (!global_vals[name_parts[i]]) {
        global_vals[name_parts[i]] = {};
      }
      global_vals = global_vals[name_parts[i]];
    }

    const last_name = name_parts[name_parts.length - 1];
    //
    // Warning if already exists => will be removed
    if (global_vals[last_name]) {
      logger.warn = "Global value " + accessor + " already exists";
    }

    return {
      object: global_vals,
      member: last_name,
    };
  }

  //
  // === VALUES FILES ===
  /**
   *
   * @param {Scripted_File|Object} scripted_file As many as you want
   *                                              If not a Scripted_File,
   *                                              instanciated
   *
   *
   * @return {Promise} Success : {(integer|undefined)[]} nb_indexed_rows
   *                                  undefined if file previously indexed
   *                               {Scripted_File[]} scripted_file
   *
   *                    Reject : {string} err
   *                              {integer|undefined} nb_indexed_rows
   */
  add_values_files(scripted_file) {
    return new Promise((success, reject) => {
      let proms = [];
      Array.from(arguments).forEach((file) => {
        proms.push(this.add_values_file(file));
      });

      Promise.all(proms).then(success, reject);
    });
  }

  /**
   *
   * @param {Scripted_File|Object} scripted_file If not a Scripted_File,
   *                                              instanciated
   *
   * @return {Promise} Success : {integer|undefined} nb_indexed_rows
   *                                  undefined if file previously indexed
   *                               {Scripted_File} file
   *
   *                    Reject : {string} err
   *                              {integer|undefined} nb_indexed_rows
   */
  add_values_file(scripted_file) {
    return new Promise((success, reject) => {
      //
      // Check arguments
      {
        if (!scripted_file) {
          const msg = "scripted_file argument is not specified";
          logger.error = msg;
          throw TypeError(msg);
        }

        if (!scripted_file.name) {
          const msg = "scripted_file argument has no name";
          logger.error = msg;
          throw TypeError(msg);
        }

        if (!(scripted_file instanceof Scripted_File)) {
          scripted_file = new Scripted_File(scripted_file);
        }
      }

      scripted_file.path =
        this.files_path + (scripted_file.path ? scripted_file.path : "");

      let that = this;
      scripted_file.request_type = function () {
        return that.get_type(...arguments);
      };
      scripted_file.request_object = function () {
        return that.get_object(...arguments);
      };

      //
      // Add file
      let files = that.values.files;
      //
      // file.name already exists => warn ignoring
      {
        if (files[scripted_file.name]) {
          logger.error =
            "Values file " +
            scripted_file.name +
            " already exists ; ignoring this new add";
          return success({
            file: files[scripted_file.name],
          });
        }
      }
      const fName = scripted_file.name;
      files[fName] = scripted_file;
      //this.values.files_order_loading.push(fName);
      files[fName].index().then((nb_indexed_rows) => {
        success({
          nb_indexed_rows,
          file: files[fName],
        });
      }, reject);
    });
  }

  /**
   *
   * @return {Prommise} Success : {integer} nb_indexed_rows
   *                    Reject : {string} err
   *                              {integer|undefined} nb_indexed_rows
   */
  index_values_files() {
    return new Promise((success, reject) => {
      const files_order = this.values.files_order_loading;
      let files = this.values.files;

      for (let i = 0; i < files_order.length; i++) {
        const file_name = files_order[i];
        if (!files[file_name]) {
          const msg = "No file with name " + file_name;
          logger.error = msg;
          continue;
        }

        files[file_name].index().then(success, reject);
      }
    });
  }

  //
  // === TESTING ===
  /**
   * Index files for tests
   *
   * @param {Fixtures_Scripted_File|Object} tests_file If not a
   *                                                   Fixtures_Scripted_File,
   *                                                    instanciated from
   *                                                    tests_file
   *                                                    Original tests_file
   *                                                    argument is updated
   *
   * @param {Scripted_File|Object} fixtures_files As many as you want
   *                                              If not a Scripted_File,
   *                                              instanciated
   *
   * @return {Fixtures_Scripted_File} tests_file if a Fixtures_Scripted_File
   *                                  Otherwise the Fixtures_Scripted_File
   *                                  instanciated from it
   *
   * @throws {Error}
   */
  async test(tests_file, fixtures_files) {
    let files = [];

    //
    // Prepare tests_file
    {
      tests_file.env = this;
      if (!(tests_file instanceof tests.util.fixtures.Fixtures_Scripted_File)) {
        tests_file = new tests.util.fixtures.Fixtures_Scripted_File(tests_file);
      }
      files.push(tests_file);
    }

    //
    // Add fixtures files
    {
      await this.add_values_files(
        // remove the 1st argument and send the next ones
        ...[].slice.call(arguments, 1)
      ).then((indexed_files) => {
        // indexed = {nb_indexed_rows{int}, file{Scripted_File}}
        indexed_files.forEach((indexed) => {
          files.push(indexed.file);
        });
      });
    }

    //
    // Index tests_file
    {
      await tests_file.index().then(
        () => {
          logger.log = "Tests fixtures " + tests_file.name + " indexed";
        },
        (errs) => {
          let msg = " indexing tests fixtures file : ";
          if (errs instanceof Array) {
            msg = msg + " errors" + msg + errs.join("\n");
          } else {
            msg = " Error" + msg + errs;
          }

          logger.error = msg;
          throw new Error(msg);
        }
      );
    }

    //
    // Keep track into this.test_files
    {
      this.tests_files.set(tests_file.full_path, files);
    }

    return tests_file;
  }

  /**
   *
   * @param {Fixtures_Scripted_File} tests_file
   *
   * @throws {TypeError}
   */
  release(tests_file) {
    const full_path = tests_file.full_path;
    //
    // Preconds
    {
      if (!full_path) {
        throw TypeError("full_path is missing from tests_file argument");
      }
    }

    let files = this.tests_files.get(full_path);
    {
      if (!files) {
        logger.info = "No tests files for " + full_path;
        return;
      }
    }

    //
    // {Fixtures_Scripted_File}
    // write tests results in file and release it
    files[0].release();

    //
    // Release suite's specific fixtures
    {
      for (let i = 1; i < files.length; i++) {
        this.delete_object(files[i].name);
      }
    }
  }
}

Environment_Scripted_Files.init(
  require("./Environment_Scripted_Files_properties"),
  module
);
