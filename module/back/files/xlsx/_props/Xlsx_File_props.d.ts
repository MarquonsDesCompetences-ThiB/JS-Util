import { File } from "../../File.js";
import Excel from "exceljs";
export interface iUpdates_Res {
    errs: any[];
    nb_sheets_succeed: number;
    updated_cells: number[][];
}
export declare abstract class Xlsx_File_props extends File {
    /**
     * xlsx
     */
    protected excel: Excel.Workbook;
    get_sheet(id_or_name: number | string): any;
    get_sheet_id(sheet_name: string | String): number;
}
