"use strict";

class Obj_Errors {
  /**
   *
   * @param {Obj | Object} obj Object whose errors have to be handled
   */
  constructor(obj) {
    {
      //
      // Init members
      {
        //
        // Values user tried to set but failed
        Object.defineProperty(this, "tried_sets", {
          value: {},
          enumerable: true,
          configurable: false,
          writable: true,
        });

        //
        // Raised errors
        Object.defineProperty(this, "errs", {
          value: {},
          enumerable: true,
          configurable: false,
          writable: true,
        });
      }

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
    }
  }

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
      errs.push((this.err_str = key));
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
        const str =
          err.name +
          " : " +
          err.message +
          "(" +
          err.fileName +
          " at " +
          err.lineNumber +
          ")";
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
  set_error(prop_name, error, value_which_raised = undefined) {
    this.errs[prop_name] = error;
    this.tried_sets[prop_name] = value_which_raised;
  }

  //
  // === LOCALIZED TEXT ===
  /**
   *
   * @param {object} global_texts Must have 2 properties :
   *                                - default with an errors property
   *                                - localized {optional} with an errors property
   * @param {object | optional} class_texts Must have 2 properties :
   *                                            - default
   *                                                with an errors property
   *                                            - localized {optional}
   *                                                with an errors property
   *
   * @return {object} set_res - nb_set {integer} Number of localized errors
   *                           - nb_nset {integer} Number of not localized errors
   *
   * @throws {string} If global_texts is undefined or has no errors property
   */
  localize(global_texts, class_texts = undefined) {
    //
    // Check preconds
    {
      //
      // global_texts
      {
        if (!global_texts) {
          const msg = "No global_texts argument or errors property in it";
          logger.error = "Obj_Errors#localize " + msg;
          throw msg;
        }
        if (!global_texts.default) {
          const msg = "No default property in global_texts argument";
          logger.error = "Obj_Errors#localize " + msg;
          throw msg;
        }
        if (!global_texts.default.errors) {
          const msg = "No errors property in global_texts.default argument";
          logger.error = "Obj_Errors#localize " + msg;
          throw msg;
        }
      }
    }

    let global_errs, class_errs;
    //
    // Init errs localized texts access
    {
      //
      // Set global_errs
      {
        global_errs = {
          default: global_texts.default.errors,
          localized: global_texts.localized
            ? global_texts.localized.errors
            : undefined,
        };
      }

      //
      // Set class_errs
      {
        if (class_texts) {
          class_errs = {
            default: class_texts.default
              ? class_texts.default.errors
              : undefined,
            localized: class_texts.localized
              ? class_texts.localized.errors
              : undefined,
          };
        } else {
          const class_str = classOf(this);
          class_errs = {
            default: global_texts.default[class_str]
              ? global_texts.default[class_str].errors
              : undefined,

            localized:
              global_texts.localized && global_texts.localized[class_str]
                ? global_texts.localized[class_str].errors
                : undefined,
          };
        }
      }
    }

    let set_res = {
      nb_set: 0,
      nb_nset: 0,
    };

    //
    // Iterate properties
    {
      for (const prop in this) {
        //
        // Localize
        {
          let set = false;
          const err = this[prop];
          //
          // Fetch from specifics texts
          {
            //
            // Fetch from specific localized
            {
              if (class_errs.localized) {
                this[prop] = class_errs.localized[prop]; //errors strings object
                if (this[prop]) {
                  this[prop] = this[prop][err];

                  if (this[prop]) {
                    set = true;
                  }
                }
              }
            }

            //
            // Fetch from specific default
            if (!set && class_errs.default) {
              this[prop] = class_errs.default[prop]; //errors strings object
              if (this[prop]) {
                this[prop] = this[prop][err];

                if (this[prop]) {
                  set = true;
                }
              }
            }
          }

          //
          // Fetch from global texts
          {
            //
            // Fetch from global localized
            {
              if (global_errs.localized) {
                this[prop] = global_errs.localized[prop]; //errors strings object
                if (this[prop]) {
                  this[prop] = this[prop][err];

                  if (this[prop]) {
                    set = true;
                  }
                }
              }
            }

            //
            // Fetch from global default
            if (!set) {
              this[prop] = global_errs.default[prop]; //errors strings object
              if (this[prop]) {
                this[prop] = this[prop][err];

                if (this[prop]) {
                  set = true;
                }
              }
            }
          }

          //
          // Restore error string if localized text not found
          {
            if (!set) {
              this[prop] = err;
              set_res.nb_nset++;
            } else {
              set_res.nb_set++;
            }
          }
        }
      }
    }

    return set_res;
  }
}

module.exports = Obj_Errors;
