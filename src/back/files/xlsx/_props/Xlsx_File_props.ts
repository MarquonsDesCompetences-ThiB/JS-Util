"use strict";
import { File } from "../../File.js";
import { string } from "@both_types/_types.js";
import Excel from "exceljs";

export interface iUpdates_Res {
  errs: any[];
  nb_sheets_succeed: number;

  /* coordinates of updated cells/cells tried to be update
      by sheet :
        [sheet_id][row_id][col_id]
  */
  updated_cells: number[][];
}

export abstract class Xlsx_File_props extends File {
  /**
   * xlsx
   */
  protected excel: Excel.Workbook;

  get_sheet(id_or_name: number | string): any {
    const sheet_name = string.if_is(id_or_name);
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

    const sheet = this.excel.worksheets.find((worksheet) => {
      return worksheet.name === sheet_name;
    });

    if (!sheet) {
      return -1;
    }

    return sheet.id;
  }
}
