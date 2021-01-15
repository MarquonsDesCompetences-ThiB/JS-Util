"use strict";

const { callbackify } = require("util");
const Csv_File = require("../Csv_File");
const Scripted_File = require("./Scripted_File");

class Environment_Scripted_Files {
  constructor() {
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
    this.types = {
      objects : {}, //initialised with this.init_types_objects()
      files : {},
      //
      // string[types.files keys]
      files_order_loading = []
    };
    this.init_types_objects();

    this.values = {
        files : {},
        //
        // object associating types.objects keys to string[values.files keys]
        files_order_loading : {}
    };
  }

  //
  // === INITIALISATION ===
  /**
   * Init this.types.objects with primitive JS objects
   */
  init_types_objects(){
    this.types.objects = {
        "Array" : Array,
        "Date" : Date,
        "Number" : Number,
        "Object" : Object,
        "String" : String,
        "null": null,
        "undefined": undefined,
    };
  }

  //
  // === TYPES FILES ===
  /**
   * 
   * @param {Csv_File | _File | Object} file If not Csv_File type, will be created
   */
  add_types_file(file){
    //
    // Check arguments
    {
        if(!file){
            logger.error("Environment_Scripted_Files#add_types_file file argument is not specified");
            return false;
        }
        if(!file.name){
            logger.error("Environment_Scripted_Files#add_types_file file has no name member");
            return false;
        }

        //
        // file.name already exists
        if(files[file.name]){
            logger.error("Environment_Scripted_Files#add_types_file Types file "+file.name+" already exists ; ignoring this new add");
            return false;
        }

        if(!file.object_type){
            logger.error("Environment_Scripted_Files#add_types_file file has no object_type member : the type of objects listed in it");
            return false;
        }
    }

    let file_obj = file;
    if(!(file_obj instanceof Csv_File)){
        file_obj = new Csv_File(file_obj);
    }

    //
    // Add file
    const fName = file.name;
    this.values.files[fName] = file_obj;

    const obj_type = file.object_type;
    if(!this.values.files_order_loading[obj_type]){
        this.values.files_order_loading[obj_type] = [];
    }
    this.values.files_order_loading[obj_type].push(fName);

    return true;
  }

  /**
   * @param {function} cbk Callback with 2 params :
   *                            errs : string[]
   *                            nb_files_parsed_success : integer
   */
  async parse_types_files(cbk){
    const files_order = this.types.files_order_loading;
    const nb_tot_files = files_order.length;
    let nb_files_parsed = 0;
    let errs = [];

    for(let i=0; i<nb_tot_files; i++){
        this.parse_type_file(files_order[i], on_parsed);
    }

    function on_parsed(err, nb_parsed_rows){
        if(err){
            errs.push(err);
        }

        //
        // Callback
        {
            nb_files_parsed++;
            if(nb_files_parsed === nb_tot_files){              
                logger.log("Environment_Scripted_Files#parse_types_files Parsing of "+nb_tot_files+" files done with "+errs.length+" errors");

                const nb_well_parsed = nb_files_parsed-errs.length;
                cbk(errs.length>0?errs:undefined,nb_well_parsed);
            }
        }
    }
  }

  /**
   * 
   * @param {string} name File to parse ; must be a key of this.types.files
   * @param {function} cbk Callback with 2 params : err, nb_parsed_rows
   */
  async parse_type_file(name, cbk){
        let file = this.types.files[name];
      {
          if(!file){
              const msg = "The specified file does not exist in environment : "+name;
              logger.error("Environment_Scripted_Files#parse_type_file "+msg);
              cbk(msg);
              return false;
          }
      }

      let that = this;
      if(file.content){
        parse();
        return true;
      }

      logger.log("Environment_Scripted_Files#parse_type_file Reading file...");
      file.read(function(err){
          if(err){              
              logger.error("Environment_Scripted_Files#parse_type_file::read Error reading file "+name+" : "+err);
              return cbk(err);
          }
          parse();
      });

      function parse(){
        if(!(file.content instanceof Array)){
            file.to_csv_array();
        }

        const content = file.content;
        let nb_parsed_rows = 0;
        //
        // Iterate rows skipping first one (headings)
        for(let i=1; i<content.length; i++){
            if(that.parse_type_file_row(content[i])){
                nb_parsed_rows++;
            }else {
                const msg = "Could not parse row " + i;
                logger.error("Environment_Scripted_Files#parse_type_file::parse " + msg);
              }
        }

        // nb_rows skipping the first one : headings
        const nb_rows = content.length>=1?content.length-1:0;
        const msg = nb_parsed_rows+" parsed rows/"+nb_rows;
        //
        // Not all rows parsed
        {
            if(nb_rows !== nb_parsed_rows){
                logger.error("Environment_Scripted_Files#parse_type_file::parse Only "
                +msg);
                return cbk("Only "+msg, nb_parsed_rows);    
            }
        }

        //
        // Success : All rows parsed
        {
            logger.log("Environment_Scripted_Files#parse_type_file::parse "+msg);
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
   * @param {array[3]} row 
   * 
   * @return {bool}
   */
  parse_type_file_row(row){
    //
    // Check argument
      {
        if (!row || !(row instanceof Array)) {
          const msg = "No row set or not an array";
          logger.error("Environment_Scripted_Files#parse_type_file_row " + msg);
          return false;
        }

        if(row.length<3){
            const msg = "Row should have 3 columns but has only "+row.length;
            logger.error("Environment_Scripted_Files#parse_type_file_row "+msg);
            return false;
        }

        //
        // Warn unused columns
        if(row.length>3){
            const msg = "Only the 3 first columns will be used for parsing (nb columns : "+row.length+")";
            logger.warn("Environment_Scripted_Files#parse_type_file_row "+msg);
        }
      }
    
        const name = row[0];
        
        //
        // Check name
        {
            if(!name || name.length === 0){
                const msg = "No name set in row's first column";
                logger.error("Environment_Scripted_Files#parse_type_file_row "+msg);
                return false;
            }
        }

        const name_parts = name.split(".");
        let type_object = this.types.objects;
        //
        // Iterate name parts
        // ignoring the last one
        for(let i=0; i<name_parts.length-1; i++){
            if(!type_object[name_parts[i]]){
                type_object[name_parts[i]] = {};
            }
            type_object = type_object[name_parts[i]];
        }
        const last_name = name_parts[name_parts.length-1];
        
        //
        // Warning if already exists => will be removed
        if(type_object[last_name]){
            const msg = "Type with name "+name+" already exists and will be erased";
            logger.warn("Environment_Scripted_Files#parse_type_file_row "+msg);
        }

        return this.parse_type_file_value(last_name, 
                                            row[1], row[2], 
                                            type_object);
    }

    /**
     * Ensure object pointed by name exists in this.types.objects,
     * ignoring the last one
     * @param {*} name 
     */
    ensure_type_object(name){
        if(!name || name.length === 0){
            const msg = "No name argument set";
            logger.error("Environment_Scripted_Files#ensure_type_object "+msg);
            return false;
        }

        const name_parts = name.split(".");
        // no dot divider
        if(name_parts.length === 1){
            return true;
        }

        //
        // Iterate name parts to check existence
        // ignoring the last one
        let json = this.types.objects;
        for(let i=0; i<name_parts.length-1; i++){
            if(!json[name_parts[i]]){
                json[name_parts[i]] = {};
            }
            json = json[name_parts[i]];
        }
        return true;
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
    parse_type_file_value(name, type, value, dest_obj = this.types.objects){
        type = type.toLowerCase();
        switch(type){
            //
            // Load class
            case "class":
                try{
                    dest_obj[name] = require(value);
                    const msg = "Class loaded : "+name+" ("+value+")";
                    logger.log("Environment_Scripted_Files#parse_type_file_value "+msg);
                    return true;
                }
                catch(ex){
                    const msg = "Couldn't load class "+name+" ("+value+") : "+ex;
                    logger.error("Environment_Scripted_Files#parse_type_file_row "+msg);
                    return false;
                }
            break;

            // int or float
            case number:
                //
                // int
                {
                    const int = Number.parseInt(value);
                    if(!Number.isNaN(int)){
                        dest_obj[name] = int;
                        const msg = "Integer loaded : "+name+" ("+value+")";
                        logger.log("Environment_Scripted_Files#parse_type_file_value "+msg);
                        return true;
                    }
                }

                //
                // float
                {
                    const float = Number.parseFloat(value);
                    if(!Number.isNaN(float)){
                        dest_obj[name] = float;
                        const msg = "Float loaded : "+name+" ("+value+")";
                        logger.log("Environment_Scripted_Files#parse_type_file_value "+msg);
                        return true;
                    }
                }
                const msg = "Number "+name+" ("+value+") is neither an integer or a float";
                logger.error("Environment_Scripted_Files#parse_type_file_value "+msg);
                return false;
            break;

            
            case string:
                dest_obj[name] = this.parse_string(value);
                if(!dest_obj[name]){
                    const msg = "Could not parse string value of "+name;
                    logger.error("Environment_Scripted_Files#parse_type_file_row "+msg);
                    return false;
                }
                const msg = "String loaded : "+name+" : "+dest_obj[name]+" ("+value+")";
                logger.log("Environment_Scripted_Files#parse_type_file_value "+msg);
                return true;
            break;

            default:
                const msg = "Unknown value type "+type+" for object "+name;
                logger.error("Environment_Scripted_Files#parse_type_file_row "+msg);
                return false;
        }
    }

    parse_string(str){
        let str_parts = []; //string[]
        //
        // Fetch str's variables
        {
            let start_extract_idx = 0;
            let brace_idx, end_brack_idx;
            while((brace_idx = str.find("{", start_extract_idx))>=0){
                //
                // Extract part before opening brace
                {
                    if(brace_idx>start_extract_idx){
                        str_parts.push(str.substring(start_extract_idx, 
                                                    brace_idx));
                    }
                }

                //
                // Extract variable
                {
                    end_brack_idx = str.find("}", search_idx);
                    //
                    // No end brace
                    if(end_brace_idx<0){
                        const msg = "Opening brace at index "+brace_idx+" has no closing brace";
                        logger.error("Environment_Scripted_Files#parse_string "+msg);
                        return null;
                    }

                    //
                    // Get variable value
                    const var_name = str.substring(start_extract_idx+1, 
                        brace_idx);
                    const obj = this.get_object(var_name);
                    if(obj == null){
                        const msg = "Variable "+var_name+" does not exist in environment";
                        logger.warn("Environment_Scripted_Files#parse_string "+msg);
                        str_parts.push("<undefined "+var_name+">");
                        continue;
                    }
                    //
                    //else convert obj to string
                    let str_val = obj;
                    if(typeof str_val === "function"){
                        str_val = str_val();
                    }

                    //
                    //str_val is an object with to_string/toString function
                    if(typeof str_val === "object" && (str_val.to_string || str_val.toString)){
                        str_val = str_val.toString ? str_val.toString():str_val.to_string();
                    }

                    //
                    // str_val is neither a string or number
                    if(!util.text.String.is_string(str_val) && !util.text.Number.is_number(str_val)){
                        const msg = "Variable "+var_name+" is neither a string, number or object with to_string/toString method";
                        logger.warn("Environment_Scripted_Files#parse_string "+msg);
                        str_parts.push("<not stringable "+var_name+">");
                        continue;
                    }

                    str_parts.push(str_val);
                }

                start_extract_idx = end_brack_idx+1;
            }

            //
            // Extract the eventual final string part
            str_parts.push(str.substring(start_extract_idx));
        }

        const parsed_str = str_parts.join("");
        const msg = "Parsed string :"+parsed_str;
        logger.log("Environment_Scripted_Files#parse_string "+msg);
        return parsed_str;
    }

  //
  // === VALUES FILES ===
  /**
   * 
   * @param {Scripted_File | Csv_File | _File | Object} file If not Scripted_File type, will be created
   * @param {string | optional} objects_type Optional if file already has objects_type set
   */
  add_values_file(file, objects_type = undefined){
    //
    // Check arguments
    {
        if(!file){
            logger.error("Environment_Scripted_Files#add_values_file file argument is not specified");
            return false;
        }
        if(!file.name){
            logger.error("Environment_Scripted_Files#add_values_file file has no name member");
            return false;
        }

        //
        // file.name already exists
        if(files[file.name]){
            logger.error("Environment_Scripted_Files#add_values_file Values file "+file.name+" already exists ; ignoring this new add");
            return false;
        }
    }

    let file_obj = file;
    if(!(file_obj instanceof Scripted_File)){
        file_obj.request_object = this.get_object;
        file_obj = new Scripted_File(file_obj);
    }

    //
    // Set and check file.objects_type
    {
        if(!file_obj.objects_type){
            file_obj.objects_type = objects_type;
        }

        if(!file_obj.objects_type){
            logger.warn("Environment_Scripted_Files#add_values_file objects_type is not set in file "+file.name+" or as argument");
        }
    }

    //
    // Add file
    const fName = file.name;
    this.values.files[fName] = file_obj;
    this.values.files_order_loading.push(fName);

    return true;
  }
  
  /**
   * 
   */
    parse_values_files(){
        const files_order = this.values.files_order_loading;
        let files = this.values.files;

        for(let i=0; i<files_order.length; i++){
            const file_name = files_order[i];
            if(!files[file_name]){
                const msg = "No file with name "+file_name;
                logger.error("Environment_Scripted_Files#get_object "+msg);
                continue;
            }

            files[file_name].parse();
        }
    }

    //
    // === GETTERS ===
    get_object(name){
        const name_parts = name.split(".");
        //
        // 1 part only
        {
            if(name_parts.length === 1){
                if(!this.types.objects[name]){
                    const msg = "No object with type name "+name;
                    logger.warn("Environment_Scripted_Files#get_object "+msg);
                    return undefined;
                }
                return this.types.objects[name];
            }
        }
        //
        // else
        //
        // Looking for in this.values.files
        {
            const first_part = name_parts[0];
            if(this.values.files[first_part]){
                const name = name_parts.slice(1, name_parts.length).join(".");
                let val = this.values.files[first_part].get_object(name);
                if(val){
                    const msg = "Value "+name+" found in file "+first_part;
                    logger.log("Environment_Scripted_Files#get_object "+msg);
                    return val;
                }
                
                const msg = "Value "+name+" not found in file "+first_part;
                logger.warn("Environment_Scripted_Files#get_object "+msg);
            }
        }

        
        //
        // Looking for in this.types.objects
        {
            let json = this.types.objects;
            for(let i=0; i<name_parts.length; i++){
                const sub_name = name_parts[i];
                if(!json[sub_name]){
                    let msg = "Value "+sub_name+" is not ";
                    if(i===0){
                        msg += "in environment";
                    }
                    else{
                        msg += "a member of "+name_parts[i-1];
                    }
                    msg += " (from "+name+")";
                    logger.error("Environment_Scripted_Files#get_object "+msg);
                    return undefined;
                }

                json = json[sub_name];
            }

            const msg = "Value "+name+" found in environment";
            logger.log("Environment_Scripted_Files#get_object "+msg);
            return json;
        }
    }
}

module.exports = Environment_Scripted_Files;
