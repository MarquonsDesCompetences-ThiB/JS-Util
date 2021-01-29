"use strict";

/**
 * Rows :
 *  1 : Headings, every column havin objects type in parenthesis
 *  Next ones : objects declaration
 *
 * Columns :
 *  1 : Objects namesfv
 */
class Scripted_File_properties extends util.obj.Properties {
  static get instances() {
    return {
      //
      // string[]
      // Members names of values in the specified column
      cols_names: {
        enumerable: true,
        writable: true,
      },

      /**
       * {
       *    {string} name
       *    {string} type_name  type name
       *    {bool} ignore  if must be ignored (sign '\')
       *    {bool} new_group if starts a new group (sign '|')
       * }[<col_id>]
       *
       * Types of values in the specified column
       * Determined by the 2nd row
       */
      cols_descriptions: {
        enumerable: true,
        writable: true,
      },

      /**
       *  {object_name -> {Row_Description}{id, name, template_name}
       * Rows as objects
       * Object associating object name (specified in row)
       * to the row_id defining it
       * and optionnaly the row name templating this row
       *
       * To check existence if not already parsed and
       * constructed into this.instances
       */
      objects: {
        value: undefined,
        enumerable: true,
        writable: true,
      },

      /**
       * All instanciated objects
       */
      instances: {
        value: new WeakMap(),
        enumerable: true,
        writable: true,
      },

      //
      // {function}
      // Function to call to request a type from environment
      request_type: {
        value: undefined,
        enumerable: true,
        writable: true,
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

  static get statics() {
    return {};
  }
}

util.obj.Obj.export(module, Scripted_File_properties);
