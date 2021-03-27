"use strict";

export abstract class Obj_Errors_props {
  //
  // Values user tried to set but failed
  protected tried_sets: any = {};
  //
  // Raised errors
  protected errs: any = {};

  /*
        Init obj::<property_name>_set getters
        They return the value set to object 
        even if an error have been throw
        *
      for (const prop_name in obj) {
        //
        // Init obj::<property_name>.set
        // pointing to value in this.tried_sets if an error occured
        // or to this.<property_name> otherwise
        {
          const that = this;
          define_prop(prop_name);
          function define_prop(prop_name) {
            Object.defineProperty(obj, prop_name + "_set", {
              enumerable: false,
              configurable: false,
              get: function () {
                if (that.tried_sets[prop_name]) {
                  return that.tried_sets[prop_name];
                }

                return obj[prop_name];
              },

              //set: use this.set_error(prop_name,
              //                        error,
              //                        value_which_raised = undefined)
            });
          }
        }
      }*/

  //
  // === GETTERS ===
  get nb() {
    return Object.keys(this.errs).length;
  }

  /**
   * Return all errors as a single string
   */
  get str() {
    let errs = [];
    for (const key in this.errs) {
      errs.push((this.errs = key));
    }

    return errs.join("\n");
  }

  /**
   * Get error associated to specified property name
   *
   * @return{str}
   */
  get_str(prop_name, include_stack = false) {
    //
    // Check preconds
    {
      if (!this.errs[prop_name]) {
        logger.warn = "No error associated to " + prop_name;
        return prop_name + " : No error";
      }
    }

    const err = this.errs[prop_name];
    {
      //
      // Instance of error
      // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error
      if (err instanceof Error) {
        const str = err.name + " : " + err.message;
        if (include_stack) {
          return str + " " + err.stack;
        }
        return str;
      }

      //
      // Try to convert as string and return
      {
        const err_type = typeof err;
        try {
          if (err_type === "object" && !(err instanceof String)) {
            return JSON.stringify(err);
          }

          return new String(err);
        } catch (ex) {
          const err_type_str =
            " of type " + err_type + (err_type === "object")
              ? " (" + err.constructor.name + ")"
              : "";

          logger.error =
            "Could not convert to string error associated to " +
            prop_name +
            err_type_str;
          return prop_name + " : Error" + err_type_str;
        }
      }
    }
  }

  /**
   * Flush stored errors
   * @return {integer} Number of errors flushed
   */
  get flush() {
    let nb = 0;
    for (const prop_name in this.tried_sets) {
      delete this.tried_sets[prop_name];
      delete this.errs[prop_name];
      nb++;
    }
    return nb;
  }

  //
  // === SETTERS ===
  /**
   *
   * @param {string} prop_name Property's name which raised the error
   * @param {*} error Error raised
   * @param {*} value_which_raised  Value which raised the error
   */
  set_error(prop_name, error: any, value_which_raised?) {
    this.errs[prop_name] = error;
    this.tried_sets[prop_name] = value_which_raised;
  }
}
