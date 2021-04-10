import { Texts_props } from "./_props/Texts_props.js";
import { ELanguage_Code } from "../language_codes.js";
export declare class Texts extends Texts_props {
    /**
     * Add the requested texts to dest_obj
     *
     * @param dest_obj Object which receives texts
     *
     * @return dest_obj
     */
    add_texts(dest_obj: any, accessors?: string | (string | number)[], lang_id?: ELanguage_Code): any;
    /**
     * Add the texts requested from multiple resources
     * to dest_obj
     *
     * @param dest_obj Object which receives texts
     *
     * @return dest_obj
     */
    add_texts_multi(dest_obj: any, accessors?: string[][], lang_id?: ELanguage_Code): any;
    /**
     * Return multiple texts resources from this.texts
     *
     * @param accessors Every values to fetch
     *                  Every element of array must be an array with :
     *                    0: Property name to store fetched texts
     *                       in the returned object
     *                    1...: Optional Accessors; if not set, value
     *                          a index 0 is used
     */
    get_multi(accessors: string[][], lang_id?: ELanguage_Code): any;
    /**
     * Return the requested texts from this.texts
     *
     * @param accessors
     */
    get_localization(accessors?: string | (string | number)[], lang_id?: ELanguage_Code): any;
    /**
     * Return the requested texts reading files
     *
     * @param accessors
     */
    get_reading_fs(accessors?: string | (string | number)[], lang_id?: ELanguage_Code): any;
    /**
     *
     * @param {object} texts With properties :
     *                        - default {object} Used to fetch text if localized is not set
     *                        - localized {object}
     *
     * @param {string} property_accessor Property accessor
     *                                    Ex. :
     *                                      property.subprop.subprop2
     *                                      property[4].subprop
     *
     * @return {*} Value pointed by property_accessor
     *                  from texts.default if any,
     *                  otherwise from texts.localized
     */
    static get(texts: any, property_accessor: string | (string | number)[]): any;
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj?: any);
    /**
     * Replace texts
     *
     * @param to_replace values to fetch (property names)
     *                   and replace (final string value)
     * @param accessors optional Accessors to texts files
     *                            If not set, look for translations
     *                            in all language's resources files
     *
     * @return Object with 2 properties :
     *                              - texts : localized texts
     *                              - res : results {Object} :
     *                                  - nb_set [integer]
     *                                  - nb_nset [integer]
     * Example :
     *  new Localized_Texts().
     * @param {[3]} arr Array with 3 elements :
     *                      - {string} language code to fetch,
     *                      - {Object}
     *                      - {function} Callback to call with results
     *
     *
     * @throws -  If one of array's elements is missing
     *          - If one of array's elements is a wrong type
     */
    replace(to_replace: any, accessors?: string | (number | string)[]): any;
}
