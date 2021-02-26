import { Obj } from "../../../obj/_obj.js";
import { ELanguage_Code } from "../../language_codes.js";
export declare abstract class Texts_props extends Obj {
    #private;
    constructor(accessor?: string | (string | number)[]);
    get init_accessor(): string | (string | number)[];
    set init_accessor(accessor: string | (string | number)[]);
    /**
     * {Object}
     * Localized texts by language_code
     */
    protected texts: {};
    add_lang(lang_id?: ELanguage_Code): void;
    get_path(lang_id?: ELanguage_Code): any;
}
