"use strict";
import { Csv_File_props } from "./_props/Csv_File_props.js";
import { text } from "@src/both/_both.js";
import $ from "jquery";

export class Csv_File extends Csv_File_props {
  /**
   * Return the column letter following col_letter
   * Columns letters use the sheets order, eg A, B,...Z,AA,AB,...AZ,AAA...
   * @param {string} col_letters
   *
   * @return {string}
   */
  static next_column_letters(col_letters: string = "A"): string {
    col_letters = col_letters.toUpperCase();

    let next_letters = "";
    const last_letter = col_letters[col_letters.length - 1];
    //
    // Go back to A with a new letter starting at A
    {
      if (last_letter === "Z") {
        for (let i = 0; i <= col_letters.length; i++) {
          next_letters += "A";
        }
        return next_letters;
      }
    }

    //
    // Keep first col_letters' letters the same
    {
      if (col_letters.length > 1) {
        next_letters = col_letters.substring(0, col_letters.length - 1);
      }
    }

    //
    //Increment last letter
    {
      next_letters += String.fromCharCode(last_letter.charCodeAt(0) + 1);
    }

    return next_letters;
  }
  constructor(obj = undefined) {
    super(obj);

    /**
     * All column names asociated to their index
     * Keys are repercuted into this.content[0]
     * => columns index are their index in this.content[0]
     */
    if (!this.col_names) {
      this.col_names = [];
    }
  }

  //
  // === COLUMN NAMES ===
  add_col_name(col_name: string): number {
    if (col_name in this.col_names) {
      return null;
    }

    {
      const id = this.content[0].indexOf(col_name);
      if (id >= 0) {
        this.col_names[id] = col_name;
        return id;
      }
    }

    {
      const id = (<any[]>this.content[0]).push(col_name) - 1;
      this.col_names[col_name] = id;
      return id;
    }
  }

  /**
   * Init this.col_names with this.content[0]
   */
  first_row_to_col_names() {
    this.col_names = [];
    let that = this;
    (<any[]>this.content[0]).forEach(function (elmt, idx) {
      that.col_names[idx] = elmt;
    });
  }

  //
  // === CONTENT ===
  /**
   * Convert json content to double dimensions Array csv content and
   * set it to this.content
   *
   * @return {integer} Number of rows (including first row : columns names)
   */
  add_json_content(json: any): number {
    if (!(this.content instanceof Array)) {
      this.content = [[]]; //create 2D array with 1 row : columns names

      //
      // Init first row (columns names) with this.col_names
      this.col_names.forEach((name, id) => {
        (<string>this.content[0][id]) = name;
      });
    }

    //
    // Iterate json's objects -> convert them to rows
    let nb_added = 0;
    {
      for (const row_name in json) {
        const row = json[row_name];
        //
        // Iterate columns to convert them to an array : array_row
        let array_row = [];
        for (const col_name in row) {
          let col_id = this.col_names.indexOf(col_name);
          if (!col_id) {
            col_id = this.add_col_name(col_name);
          }

          // fills still empty columns
          while (array_row.length <= col_id) {
            array_row.push("");
          }

          array_row[col_id] = row[col_name];
        }
        this.content.push(array_row);
        nb_added++;
      }
    }

    logger.info =
      this.content.length +
      " rows in " +
      this.name +
      " (" +
      nb_added +
      " added)";
    return this.content.length;
  }

  /**
   * Convert this.content to array
   */
  to_csv_array(): string[][] {
    function converted() {
      logger.info = this.content.length + " rows in " + this.name;
      return this.content;
    }

    if (this.content instanceof Array) {
      return converted.call(this);
    }

    if (!this.nb_cols) {
      logger.error = "Csv_File#to_csv_array The number of columns is not set";
      return undefined;
    }

    if (text.string.is(this.content)) {
      let all_columns = this.content.split(",");
      if (all_columns.length % this.nb_cols !== 0) {
        logger.error =
          "Csv_File#to_csv_array Wrong number of columns : expected a multiple of " +
          this.nb_cols;
        return undefined;
      }

      this.content = [];
      while (all_columns.length) {
        this.content.push(all_columns.splice(0, this.nb_cols));
      }
      this.first_row_to_col_names();
      return converted();
    }

    if (typeof this.content === "object") {
      this.add_json_content(this.content);
      return converted.call(this);
    }

    logger.error =
      "Csv_File#to_csv_array Content is not an handled type : " +
      typeof this.content;
    return undefined;
  }

  async to_csv_string() {
    function converted(): string {
      logger.info = this.content.length + " characters in " + this.name;
      return this.content;
    }

    if (text.string.is(this.content)) {
      return converted.call(this);
    }

    if (this.content instanceof Array) {
      //
      // Convert every array row in a string
      // -> joins content[i][]
      await this.content.forEach((row_arr, idx) => {
        (<string>this.content[idx]) = row_arr.join(",");
      });

      //
      // Join all rows string in one
      // -> joins content[]
      this.content = this.content.join(",");
      return converted.call(this);
    }

    if (typeof this.content === "object") {
      this.add_json_content(this.content);
      //now this.content is instanceof Array
      return this.to_csv_string();
    }

    logger.error =
      "Csv_File#to_csv_string Content is not an handled type : " +
      typeof this.content;
    return undefined;
  }

  //
  // === VALUES ASSOCIATION ===
  /**
   * Init this.values_associations[column_id] setting keys from values
   * of this.content[i][column_id]
   *
   * @param {integer [0;this.content[i].length-1]} column_id
   *
   * @return {integer} Number of keys
   */
  init_values_association_column(column_id: number): number {
    //
    // Check preconditions
    {
      if (!(this.content instanceof Array)) {
        logger.error =
          "Csv_File#init_values_association_column this.content is not an array ; typeof content : " +
          typeof this.content;
        return 0;
      }
    }

    //
    // Init member
    {
      if (!this.values_associations) {
        this.values_associations = {};
      }
      this.values_associations[column_id] = {};
    }

    let vals_associations = this.values_associations[column_id];
    let nb_keys = 0;
    //
    // Iterate rows to set keys
    {
      for (let i = 0; i < this.content.length; i++) {
        //
        // Check row
        if (this.content[i].length <= column_id) {
          logger.error =
            "Csv_File#init_values_association_column Column " +
            column_id +
            " is missing from row " +
            i;
          continue;
        }

        //
        // Add content[i][column_id] value to this.values_associations
        const col_val = this.content[i][column_id];
        if (!vals_associations[i][col_val]) {
          vals_associations[i][col_val] = [];
          nb_keys++;
        }
      }
    }

    return nb_keys;
  }

  //
  // === VIEW ===
  construct_dom_column_select(
    select_name: string = "",
    select_id: string = ""
  ) {
    if (!(this.content instanceof Array) || this.content.length === 0) {
      logger.error = "Content misses a 1st row";
      return undefined;
    }

    let sel_str = "<select id='" + select_id + "' name='" + select_name + "'>";
    //
    // Iterate columns' names -> first row
    {
      const names = this.content[0];
      for (let i = 0; i < names.length; i++) {
        const val = names[i];
        sel_str += "<option value='" + val + "'>" + val + "</option>";
      }
    }

    sel_str += "</select>";
    return $(sel_str);
  }
}
