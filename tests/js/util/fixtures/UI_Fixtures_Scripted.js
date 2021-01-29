"use strict";
/**
 * Preconds
 *  process.env.SRC_ROOT = path to sources files' root
 *  global.util.obj.Obj = class Obj
 * global.tests.util.Scripted_File = Scripted_File
 * global.tests.util.fixtures.Fixtures_Scripted_File = Fixtures_Scripted_File
 */

const $ = require("jquery");
const request = require("supertest");
const Regex = require(process.env.SRC_ROOT + "dist/js/util/Regex");

/**
 * Make http requests, Jquery interactions
 */
class UI_Fixtures_Scripted extends util.obj.Obj {
  //
  // === HTTP ===
  /**
   * Available commands :
   *    GET <url>
   *    POST <url>
   */
  static http_regex = {
    request: "\\s*(GET|POST)\\s+(" + util.Regex.website + ")\\s*",
  };

  //
  // === JQUERY ===
  //
  //
  /**
   * === JQUERY INPUT ===
   * [SELECTOR]JQUERY_METHOD{VARIABLE}
   *    where {VARIABLE} is optional
   *
   * === JQUERY ASSERT OUTPUT ===
   * Classical assert's column name as its value|variable_name replaced by :
   * [SELECTOR]JQUERY_METHOD
   */
  static jquery_selector_regex; //TODO
  /**
   * $ followed by at least 1 letter
   */
  static jquery_event_regex = "\\s*\\$\\s*\\w+\\s*";
  static jquery_regex = {
    input:
      // [SELECTOR]
      "\\s*[\\s*(" +
      tests.util.fixtures.Fixtures_Scripted_File.jquery_selector_regex +
      // ] JQUERY_METHOD
      ")\\s*]\\s*(\\w+)\\s*(" +
      // optionnal VARIABLE
      +tests.util.Scripted_File.variable_name_braces_regex +
      ")?",

    output:
      // | Expect :
      "(\\s*\\|\\s*)?(Expect\\s*\\:)" +
      // jquery selector
      "\\s*[\\s*(" +
      tests.util.fixtures.Fixtures_Scripted_File.jquery_selector_regex +
      // ] JQUERY_METHOD
      ")\\s*]\\s*(\\w+)\\s*(" +
      // Assert method name
      "\\s+(" +
      tests.util.fixtures.Fixtures_Scripted_File.asserts_regex +
      "){1}\\s*",
  };

  constructor(obj = undefined) {
    super(obj);
  }

  /**
   * Send an http request and return the Jquery loaded document
   *
   * Precond : this.http_app is set
   *
   * @param {string} http_request Must match UI_Fixtures_Scripted
   *                                .http_regex.request
   * @param {Object | optional} params Parameters of POST request
   *
   * @throws {string}
   * @return {Result} http request result
   */
  async http_request(http_request, params = undefined) {
    //
    // Check preconditions
    const request_regex = new RegExp(UI_Fixtures_Scripted.http_regex.request);
    {
      if (!this.http_app) {
        const msg = "this.http_app is not set";
        logger.error = "UI_Fixtures_Scripted#http_request " + msg;
        throw msg;
      }

      //
      // http_request
      if (!http_request) {
        const msg = "Argument http_request is missing";
        logger.error = "UI_Fixtures_Scripted#http_request " + msg;
        throw msg;
      }
      if (!request_regex.test(http_request)) {
        const msg =
          "Argument http_request : " +
          http_request +
          " does not match expected form : GET|POST <url> (regex : " +
          UI_Fixtures_Scripted.http_regex.request +
          ")";
        logger.error = "UI_Fixtures_Scripted#http_request " + msg;
        throw msg;
      }
    }

    let request_parts = "" + http_request;
    //
    // Extract method (to request_parts[0]) and url (to request_parts[1])
    {
      request_parts.replace(request_regex, "$1 $2");
      request_parts = request_parts.split(" ");
    }
    let req_meth = request_parts[0] === "POST" ? "post" : "get";

    try {
      const res = await request(this.http_app)
        [req_meth](request_parts[1])
        .send();

      //
      // Store fetched page into this.pages
      {
        if (this.pages[http_request]) {
          const msg =
            "Page " +
            http_request +
            " already stored in this and will be replaced";
          logger.warn = "UI_Fixtures_Scripted#http_request " + msg;
        }

        this.pages[http_request] = {
          res: res,
          body: $(res.body),
        };
      }

      return res;
    } catch (ex) {
      const msg =
        "Could not succeed http request " +
        request_parts[0] +
        " to " +
        request_parts[1] +
        " : " +
        ex;
      logger.error = "UI_Fixtures_Scripted#http_request " + msg;
      throw msg;
    }
  }

  /**
   * Runs an UI action (input or output assert)
   * onto the specified page (http_request)
   * previously fetched with this.http_request
   *
   * @param {string} http_request Must match one of this.pages keys
   *                              => http_request argument of a
   *                                  previous this.http_request call
   *
   * @param {string} ui_action Must match jquery_regex.input|output
   *
   * @return {jquery method returned value}
   */
  ui_action(http_request, ui_action) {
    let is_assert = false;
    const input_regex = new RegExp(
      "^" + UI_Fixtures_Scripted.jquery_regex.input + "$"
    );

    //
    // Check preconds
    {
      //
      // http_request
      if (!http_request) {
        const msg = "Argument http_request is missing";
        logger.error = "UI_Fixtures_Scripted#ui_action " + msg;
        throw msg;
      }

      if (!this.pages[http_request]) {
        const msg =
          "Argument http_request (" +
          http_request +
          ") does not match a known fetched page ; have you called this.http_request ?";
        logger.error = "UI_Fixtures_Scripted#ui_action " + msg;
        throw msg;
      }

      //
      // ui_action
      if (!ui_action) {
        const msg = "Argument ui_action is missing";
        logger.error = "UI_Fixtures_Scripted#ui_action " + msg;
        throw msg;
      }

      const output_regex = new RegExp(
        "^" + UI_Fixtures_Scripted.jquery_regex.output + "$"
      );
      if (output_regex.test(ui_action)) {
        is_assert = true;
      } else if (!input_regex.test(ui_action)) {
        const msg =
          "Argument ui_action (" +
          ui_action +
          ") does match neither an ui input : '[SELECTOR] JQUERY_METHOD {OPTIONNAL_INPUT_VARIABLE}' or ui output : 'Expect : [SELECTOR] JQUERY_METHOD ASSERT_METHOD_NAME'  - Regex : Input : " +
          UI_Fixtures_Scripted.jquery_regex.input +
          " | Output : " +
          UI_Fixtures_Scripted.jquery_regex.output;
        logger.error = "UI_Fixtures_Scripted#ui_action " + msg;
        throw msg;
      }
    }

    let ui_input = "" + ui_action; //clone ui_action
    //
    // If UI assert output => extract action part
    {
      if (is_assert) {
        ui_input.replace(
          new RegExp("(" + UI_Fixtures_Scripted.jquery_regex.input + ")"),
          "$1"
        );
      }
    }

    //
    // Split action parts
    /*
      [SELECTOR]JQUERY_METHOD{OPTIONAL_VARIABLE} 
    */
    {
      ui_input.replace(input_regex, "$1$$2$$3");
      /*
          0 : selector
          1 : jquery_method
          2 : optional variable
        */
      ui_input = ui_input.split("$");

      //
      // Run input
      {
        try {
          let body = this.pages[http_request].body;
          //
          // No value specified
          if (!ui_input[2]) {
            return body.find(ui_input[0])[ui_input[1]]();
          }
          //
          // Value specified
          {
            let val = ui_input[2];
            //
            // Value is variable name
            if (
              tests.util.fixtures.Fixtures_Scripted_File.is_variable_name(val)
            ) {
              val = this.env.get_object(val);
              if (!val) {
                const msg =
                  "Undefined variable " +
                  ui_input[2] +
                  " from input action " +
                  ui_action +
                  " (" +
                  ui_input.join(" ") +
                  ")";
                logger.error = "UI_Fixtures_Scripted#ui_action " + msg;
                throw msg;
              }
            }

            return body.find(ui_input[0])[ui_input[1]](val);
          }
        } catch (ex) {
          const msg =
            "Error running input " +
            ui_action +
            " (" +
            ui_input.join(" ") +
            ") : " +
            ex;
          logger.warn = "UI_Fixtures_Scripted#ui_action " + msg;
          throw msg;
        }
      }
    }
  }

  get_object(http_request, variable_name) {
    //
    // Check preconds
    {
      if (!this.pages[http_request]) {
        const msg =
          "Argument http_request (" +
          http_request +
          ") does not match a known fetched page ; have you called this.http_request ?";
        logger.error = "UI_Fixtures_Scripted#get_object " + msg;
        return undefined;
      }
    }

    const var_name = tests.util.Scripted_File.get_variable_name(variable_name);
    let json = this.pages[http_request];
    let name_parts = var_name.split(".");
    for (let i = 0; i < name_parts.length; i++) {
      const name = name_parts[i];
      if (!json[name]) {
        const msg =
          "Undefined " + name + " in " + var_name + " from " + http_request;
        logger.warn = "UI_Fixtures_Scripted#get_object " + msg;
        return undefined;
      }

      json = json[name];
    }

    return json;
  }
}

UI_Fixtures_Scripted.init(require("./UI_Fixtures_Scripted_properties"), module);
