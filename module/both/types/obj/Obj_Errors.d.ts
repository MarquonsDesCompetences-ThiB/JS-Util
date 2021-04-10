import { Obj_Errors_props } from "./_props/Obj_Errors_props.js";
export declare class Obj_Errors extends Obj_Errors_props {
    /**
     *
     */
    constructor();
    /**
     *
     * @param {object} global_texts Must have 2 properties :
     *                                - default with an errors property
     *                                - localized {optional} with an errors property
     * @param {object | optional} class_texts Must have 2 properties :
     *                                            - default
     *                                                with an errors property
     *                                            - localized {optional}
     *                                                with an errors property
     *
     * @return {object} set_res - nb_set {integer} Number of localized errors
     *                           - nb_nset {integer} Number of not localized errors
     *
     * @throws {string} If global_texts is undefined or has no errors property
     */
    localize(global_texts: any, class_texts?: any): {
        nb_set: number;
        nb_nset: number;
    };
}
