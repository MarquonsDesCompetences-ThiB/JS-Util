"use strict";

class Fixtures_Scripted_File_statics {
  /**
   * Names that cannot be used as column name
   */
  static reserved_names = ["id"];

  //
  // === ROW NAME ===
  /**
   * Row name can be either an alphanumeric name (optionnal including any _)
   * Can be templated by another row suffixing :
   *  = other_row_name
   */
  static row_name_regex = "\\s*(\\w|_)*\\s*(=\\s*\\{(\\w|_)+\\})?";

  /**
   * The name an assert column can match
   */
  static expect_regex =
    // | Expect :
    "(\\s*\\|\\s*)?(Expect\\s*\\:)" +
    // variable name
    tests.util.Scripted_File.variable_name_regex +
    // Assert method name
    "\\s+(" +
    tests.util.fixtures.Asserts_Scripted.asserts_regex +
    "){1}\\s*";

  static is_assert_column_name(name) {
    return new RegExp("/^" + Fixtures_Scripted_File_.expect_regex + "$/").test(
      name
    );
  }

  /**
   * Extract variable name and assert method (if any)
   * from the specified assert column name
   * Should be {<var_name>} => <assert_method>
   *
   * @param {string} name
   *
   * @return{string[1;2]} variable name and eventual assert_method name
   */
  static extract_column_name_values(name) {
    //
    // Check preconds
    {
      if (!name || !util.text.String.is(name)) {
        const type = typeof name;
        const msg =
          "Wrong name argument " +
          name +
          " of type " +
          type +
          (type === "object" ? " (" + name.constructor.name + ")" : "");
        logger.error = msg;
        throw new TypeException(msg);
      }
    }

    let name_parts = [];
    /*
        Extract variable name and method(s)
    */
    {
      if (!/\}\s*=>/.test(name)) {
        // only a text or variable name
        name_parts.push(name.replace(/\s/g, ""));
      } else {
        // variable name
        name_parts.push(name.match(/\|?[\w\.]+\s*\}(?=\s*=>)/)[0]);
        // method name
        name_parts.push(name.match(/(?<==>\s*).*/)[0]);
      }
    }

    return name_parts;
  }
}

util.obj.Obj.export(module, Fixtures_Scripted_File_statics);
