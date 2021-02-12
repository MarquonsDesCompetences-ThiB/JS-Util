"use strict";
import { Obj_Errors_props } from "./_props/Obj_Errors_props.js";

export class Obj_Errors extends Obj_Errors_props {
  /**
   *
   */
  constructor() {
    super();
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
          logger.error = "Errors#localize " + msg;
          throw msg;
        }
        if (!global_texts.default) {
          const msg = "No default property in global_texts argument";
          logger.error = "Errors#localize " + msg;
          throw msg;
        }
        if (!global_texts.default.errors) {
          const msg = "No errors property in global_texts.default argument";
          logger.error = "Errors#localize " + msg;
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
          const class_str = Object.getPrototypeOf(this).class.name;
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
      const props = Object.keys(this);
      for (const prop in props) {
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
