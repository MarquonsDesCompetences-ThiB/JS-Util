"use strict";
import { file } from "../../_back.js";
import { text } from "../../../both/_both.js";
export class Xlsx_File_props extends file.File {
    get_sheet(id_or_name) {
        const sheet_name = text.string.if_is(id_or_name);
        return this.excel.getWorksheet(sheet_name
            ? this.get_sheet_id(sheet_name) // by name
            : id_or_name // by id
        );
    }
    get_sheet_id(sheet_name) {
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
//# sourceMappingURL=Xlsx_File_props.js.map