"use strict";

class Obj_Errors {
  //
  // === LOGS ===
  /**
   *
   * @param {integer} line_from
   * @param {integer | optional} line_to Line included in result
   */
  static get_stack_trace(line_from, line_to = line_from) {
    return new Error().stack.split("\n").slice(line_from, line_to + 1);
  }

  /**
   *
   * @param {Obj | Object} obj Object whose errors have to be handled
   */
  constructor(obj) {
    for (const prop_name in obj) {
      /*
        Init obj::<property_name>_set getters
        They return the value set to object 
        even if an error have been throw
        */
      {
        //
        // Init this.tried_sets
        {
          Object.defineProperty(this, tried_sets, {
            enumerable: true,
            configurable: false,
            writable: true,
          });
        }

        //
        // Init obj::<property_name>.set
        // pointing to this.tried_sets if an error occured
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
              set: function (value) {
                that.tried_sets[prop_name] = value;
              },
            });
          }
        }
      }
    }
  }

  get nb() {
    let nb = 0;
    for (const prop_name in this) {
      // if not a <prop_name>_set member
      if (!/_set$/.test(prop_name) && this.tried_sets[prop_name]) {
        nb++;
      }
    }
    return nb;
  }

  /**
   * Flush stored errors
   * @return {integer} Number of errors flushed
   */
  get flush() {
    let nb = 0;
    for (const prop_name in this) {
      // if not a <prop_name>_set member
      if (!/_set$/.test(prop_name) && this.tried_sets[prop_name]) {
        delete this.tried_sets[prop_name];
        delete this[prop_name];
        nb++;
      }
    }
    return nb;
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
          logger.error("Obj_Errors#localize " + msg);
          throw msg;
        }
        if (!global_texts.default) {
          const msg = "No default property in global_texts argument";
          logger.error("Obj_Errors#localize " + msg);
          throw msg;
        }
        if (!global_texts.default.errors) {
          const msg = "No errors property in global_texts.default argument";
          logger.error("Obj_Errors#localize " + msg);
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
        // Skip this.tried_sets
        {
          if (prop === "tried_sets") {
            continue;
          }
        }

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
