import * as language_codes from "./language_codes.js";
import * as codes_countries from "./country_codes.js";
export declare class Languages {
    static codes_languages: typeof language_codes;
    static codes_countries: typeof codes_countries;
    static languages_codes: {};
    static countries_codes: {};
    protected static readonly singleton: Languages;
    static get_dom_select(select_id: any, select_name: any): any;
    static get_country(country_code: any): any;
    static get_country_code(country: any): any;
    static get_language(lang_code: any): any;
    static get_language_code(language: any): any;
    static is_country(country: any): boolean;
    static is_country_code(country_code: any): boolean;
    static is_language(language: any): boolean;
    static is_language_code(lang_code: any): boolean;
    constructor();
}
