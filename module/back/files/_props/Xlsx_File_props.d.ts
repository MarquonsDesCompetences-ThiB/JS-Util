import { file } from "../../_back";
export declare abstract class Xlsx_File_props extends file.File {
    /**
     * xlsx
     */
    protected excel: any;
    get_sheet(id_or_name: number | Number | string | String): any;
    get_sheet_id(sheet_name: string | String): number;
}
