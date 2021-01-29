"use strict";
/**
 * Preconds :
 *  global.util.files.Csv_File = class Csv_File
 *  global.util.obj.Obj = class Obj
 */
const Csv_File = global.util.files.Csv_File;
const Scripted_File = require("./Scripted_File");
const Scripted_Type = require("./Scripted_Type");

/**
 * Object types usable by values
 *
 * Files with 3 columns :
 *     - type name
 *     - value type (type of value specified in the 3rd column)
 *         - class
 *         - number
 *         - string
 *     - class path (loaded with Node#require())
 *         or raw value (integer, float or string)
 */
const Environment_Scripted_Files = (function () {
  class properties extends util.obj.Properties {
    static get enumerable() {
      util.obj.Properties.init = properties;
      return {
        files_path: {
          value: undefined,
          enumerable: true,
          writable: true,
          configurable: false,
        },

        types: {
          value: {
            objects: {
              //
              // Basic JS objects
              Array: Array,
              Date: Date,
              Number: Number,
              Object: Object,
              String: String,
              null: null,
              undefined: undefined,
            },
            files: {},
            //
            // string[types.files keys]
            //files_order_loading: [],
          },
          enumerable: true,
          writable: true,
          configurable: false,
        },

        /**
         * Global values
         */
        global: {
          value: {},
          enumerable: true,
          writable: true,
          configurable: false,
        },

        values: {
          value: {
            files: {},
            //
            // object associating types.objects keys to string[values.files keys]
            //files_order_loading: {},
          },
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

  class Environment_Scripted_Files_ extends util.obj.Obj {
    constructor(obj = undefined, update_members = false) {
      super(obj, update_members);
      this.properties = properties.props;
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
              (type === "object"
                ? " (" + type_name.constructor.name + ")"
                : "");
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
              (type === "object"
                ? " (" + type_path.constructor.name + ")"
                : "");
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
     * @param {string} var_name First accessor can be a file name
     * @param {string | optional} file_name Set undefined if var_name's
     *                                      first accessor is the file name
     */
    get_object(var_name, file_name = undefined) {
      const accessors = Scripted_Type.get_accessor_parts(var_name);
      const first_access = accessors[0];
      const last_access = accessors[accessors.length - 1];

      //
      // Look for in files and return if found
      {
        if (file_name || this.values.files[first_access]) {
          let vars = file_name
            ? this.values.files[file_name]
            : this.values.files[first_access];
          if (!vars) {
            const msg =
              "No variables instanciated for file " + file_name
                ? file_name
                : first_access + " (to fetch " + var_name + ")";
            logger.error = msg;
            throw TypeError(msg);
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
              vars = undefined;
              break;
            }

            vars = accessors[i];
          }

          if (vars) {
            if (vars[last_access]) {
              return vars[last_access];
            }

            logger.warn =
              "Variable " +
              last_access +
              " referenced in " +
              var_name +
              " not found in file " +
              file_name;
          }
        }
      }

      //
      // Look for in global and return if found
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
            return undefined;
          }

          vars = accessors[i];
        }

        return vars[last_access];
      }
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
     */
    async add_types_file(file) {
      //
      // Check arguments
      {
        if (!file) {
          logger.error =
            "Environment_Scripted_Files#add_types_file file argument is not specified";
          return false;
        }
        if (!file.name) {
          logger.error =
            "Environment_Scripted_Files#add_types_file file has no name member";
          return false;
        }

        let files = this.types.files;
        //
        // file.name already exists
        if (files[file.name]) {
          logger.error =
            "Environment_Scripted_Files#add_types_file Types file " +
            file.name +
            " already exists ; ignoring this new add";
          return false;
        }
      }

      let file_obj = file;
      file_obj.path = this.files_path + file_obj.path;
      if (!(file_obj instanceof Csv_File)) {
        file_obj = new Csv_File(file_obj);
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

      await this.parse_type_file(fName, function () {});
      return true;
    }

    /**
     * @param {function} cbk Callback with 2 params :
     *                            errs : string[]
     *                            nb_files_parsed_success : integer
     */
    async parse_types_files(cbk) {
      const files_order = this.types.files_order_loading;
      const nb_tot_files = files_order.length;
      let nb_files_parsed = 0;
      let errs = [];

      for (let i = 0; i < nb_tot_files; i++) {
        this.parse_type_file(files_order[i], on_parsed);
      }

      function on_parsed(err, nb_parsed_rows) {
        if (err) {
          errs.push(err);
        }

        //
        // Callback
        {
          nb_files_parsed++;
          if (nb_files_parsed === nb_tot_files) {
            logger.log =
              "Environment_Scripted_Files#parse_types_files Parsing of " +
              nb_tot_files +
              " files done with " +
              errs.length +
              " errors";

            const nb_well_parsed = nb_files_parsed - errs.length;
            cbk(errs.length > 0 ? errs : undefined, nb_well_parsed);
          }
        }
      }
    }

    /**
     *
     * @param {string} file_name File to parse ; must be a key of this.types.files
     * @param {function} cbk Callback with 2 params : err, nb_parsed_rows
     */
    async parse_type_file(file_name, cbk) {
      let file = this.types.files[file_name];
      {
        if (!file) {
          const msg =
            "The specified file does not exist in environment : " + file_name;
          logger.error = "Environment_Scripted_Files#parse_type_file " + msg;
          cbk(msg);
          return false;
        }
      }

      let that = this;
      if (file.content) {
        parse();
        return true;
      }

      logger.log = "Environment_Scripted_Files#parse_type_file Reading file...";
      file.read(function (err) {
        if (err) {
          logger.error =
            "Environment_Scripted_Files#parse_type_file::read Error reading file " +
            file_name +
            " : " +
            err;
          return cbk(err);
        }
        parse();
      });

      function parse() {
        if (!(file.content instanceof Array)) {
          file.to_csv_array();
        }

        const content = file.content;
        let nb_parsed_rows = 0;
        //
        // Iterate rows skipping first one (headings)
        for (let i = 1; i < content.length; i++) {
          if (that.parse_type_file_row(file_name, content[i])) {
            nb_parsed_rows++;
          } else {
            const msg = "Could not parse row " + i;
            logger.error =
              "Environment_Scripted_Files#parse_type_file::parse " + msg;
          }
        }

        // nb_rows skipping the first one : headings
        const nb_rows = content.length >= 1 ? content.length - 1 : 0;
        const msg = nb_parsed_rows + " parsed rows/" + nb_rows;
        //
        // Not all rows parsed
        {
          if (nb_rows !== nb_parsed_rows) {
            logger.error =
              "Environment_Scripted_Files#parse_type_file::parse Only " + msg;
            return cbk("Only " + msg, nb_parsed_rows);
          }
        }

        //
        // Success : All rows parsed
        {
          logger.log =
            "Environment_Scripted_Files#parse_type_file::parse " + msg;
          cbk(undefined, nb_parsed_rows);
        }
      }
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
     * @return {bool}
     */
    parse_type_file_row(file_name, row) {
      //
      // Check argument
      {
        if (!row || !(row instanceof Array)) {
          logger.error = file_name + " : No row set or not an array";
          return false;
        }

        if (row.length < 3) {
          logger.error =
            file_name +
            " : Row should have 3 columns but has only " +
            row.length;
          return false;
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

      const name = row[0];

      //
      // Check name
      {
        if (!name || name.length === 0) {
          const msg = file_name + " : No name set in row's first column";
          logger.error = msg;
          return false;
        }
      }

      const name_parts = Scripted_Type.get_accessor_parts(name);
      let type_object = this.types.objects;
      //
      // Iterate name parts
      // ignoring the last one
      for (let i = 0; i < name_parts.length - 1; i++) {
        if (!type_object[name_parts[i]]) {
          type_object[name_parts[i]] = {};
        }
        type_object = type_object[name_parts[i]];
      }
      const last_name = name_parts[name_parts.length - 1];

      //
      // Warning if already exists => will be removed
      if (type_object[last_name]) {
        logger.warn =
          file_name +
          " : Type with name " +
          name +
          " already exists and will be erased";
      }

      return this.parse_type_file_value(last_name, row[1], row[2], type_object);
    }

    /**
     * @param {string} name Name that'll identify the value in this.types
     * @param {string} type Type of value
     * @param {string} value String being either a class path,
     *                                              integer,
     *                                              float,
     *                                              string
     *
     * @return {boolean}
     */
    parse_type_file_value(name, type, value, dest_obj = this.types.objects) {
      type = type.toLowerCase();
      switch (type) {
        //
        // Load source
        case "source":
          try {
            dest_obj[name] = require(value);
            const msg = "Class loaded : " + name + " (" + value + ")";
            logger.log =
              "Environment_Scripted_Files#parse_type_file_value " + msg;
            return true;
          } catch (ex) {
            const msg =
              "Couldn't load class " + name + " (" + value + ") : " + ex;
            logger.error =
              "Environment_Scripted_Files#parse_type_file_row " + msg;
            return false;
          }
          break;

        // int or float
        case "number":
          //
          // int
          {
            const int = Number.parseInt(value);
            if (!Number.isNaN(int)) {
              dest_obj[name] = int;
              const msg = "Integer loaded : " + name + " (" + value + ")";
              logger.log =
                "Environment_Scripted_Files#parse_type_file_value " + msg;
              return true;
            }
          }

          //
          // float
          {
            const float = Number.parseFloat(value);
            if (!Number.isNaN(float)) {
              dest_obj[name] = float;
              const msg = "Float loaded : " + name + " (" + value + ")";
              logger.log =
                "Environment_Scripted_Files#parse_type_file_value " + msg;
              return true;
            }
          }

          {
            logger.error =
              "Number " +
              name +
              " (" +
              value +
              ") is neither an integer or a float";
            return false;
          }
          break;

        case "string":
          dest_obj[name] = this.parse_string(value);
          return true;

          break;

        default: {
          logger.error = "Unknown value type " + type + " for object " + name;
          return false;
        }
      }
    }

    /**
     * Replace variables into string and return the new string
     * @param {string} str
     *
     * @return{string}
     */
    parse_string(str) {
      //
      // Extract everyting which is between braces
      // => variable names
      let vars = str.match(/(?<=\{)[^\}](?=\})/g);
      //
      // Fetch every variable value
      {
        for (let i = 0; i < vars.length; i++) {
          const var_name = vars[i];
          vars[i] = this.get_object(vars[i]);
          if (!vars[i]) {
            logger.error = "Variable not found : " + var_name;
            vars[i] = "<undefined : " + var_name + ">";
          } else if (!util.text.String.is(vars[i])) {
            // in case of error message
            const var_type = typeof vars[i];
            const var_class =
              var_type === "object" ? "(" + vars[i].class.name + ")" : "";

            //
            // String conversion attempt
            try {
              vars[i] = new String(vars[i]) + "";
            } catch (ex) {
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
          }
        }
      }

      //
      // Format final string replacing every variable by its value
      let parsed_str = str;
      {
        for (let i = 0; i < vars.length; i++) {
          // replace the next found variable
          parsed_str = parsed_str.replace(/\{[^\}]\}/, vars[i]);
        }
      }

      logger.log = "Parsed string : " + parsed_str + " (from " + str + ")";
      return parsed_str;
    }

    //
    // === VALUES FILES ===
    /**
     *
     * @param {Scripted_File} scripted_file
     */
    add_values_file(scripted_file) {
      //
      // Check arguments
      {
        if (!scripted_file) {
          const msg = "scripted_file argument is not specified";
          logger.error = msg;
          throw TypeError(msg);
        }

        if (!(scripted_file instanceof Scripted_File)) {
          const msg = "scripted_file argument is not a Scripted_File";
          logger.error = msg;
          throw TypeError(msg);
        }

        if (!scripted_file.name) {
          const msg = "scripted_file argument has no name";
          logger.error = msg;
          throw TypeError(msg);
        }

        //
        // file.name already exists
        if (files[scripted_file.name]) {
          logger.error =
            "Values file " +
            scripted_file.name +
            " already exists ; ignoring this new add";
          return false;
        }
      }

      scripted_file.path = this.files_path + scripted_file.path;
      scripted_file.request_type = this.get_type;
      scripted_file.request_object = this.get_object;

      //
      // Add file
      const fName = scripted_file.name;
      this.values.files[fName] = scripted_file;
      //this.values.files_order_loading.push(fName);
      this.values.files[fName].parse();

      return true;
    }

    /**
     *
     */
    parse_values_files() {
      const files_order = this.values.files_order_loading;
      let files = this.values.files;

      for (let i = 0; i < files_order.length; i++) {
        const file_name = files_order[i];
        if (!files[file_name]) {
          const msg = "No file with name " + file_name;
          logger.error = "Environment_Scripted_Files#get_object " + msg;
          continue;
        }

        files[file_name].parse();
      }
    }
  }

  return Environment_Scripted_Files_.prototype.constructor;
})();

if (typeof process !== "undefined") {
  module.exports = Environment_Scripted_Files;
}
