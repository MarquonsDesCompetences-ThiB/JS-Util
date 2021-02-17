"use strict";
import { file } from "@src/back/_back.js";
import { text } from "@src/both/_both.js";

export abstract class Xlsx_File_props extends file.File {
  /**
   * xlsx
   */
  protected excel: any;

  get_sheet(id_or_name: number | Number | string | String): any {
    const sheet_name = text.string.if_is(id_or_name);
    return this.excel.getWorksheet(
      sheet_name
        ? this.get_sheet_id(sheet_name) // by name
        : id_or_name // by id
    );
  }

  get_sheet_id(sheet_name: string | String): number {
    if (!this.excel) {
      const msg = "Excel not loaded yet; File.read(...) must be called first";
      logger.error = msg;
      return -2;
    }

    const sheet = this.excel._worksheets.find((worksheet) => {
      return worksheet.name === sheet_name;
    });

    if (!sheet) {
      return -1;
    }

    return sheet.id;
  }
}
