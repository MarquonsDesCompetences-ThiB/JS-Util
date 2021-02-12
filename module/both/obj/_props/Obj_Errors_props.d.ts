export declare abstract class Obj_Errors_props {
    protected tried_sets: any;
    protected errs: any;
    get nb(): number;
    /**
     * Return all errors as a single string
     */
    get str(): string;
    /**
     * Get error associated to specified property name
     *
     * @return{str}
     */
    get_str(prop_name: any, include_stack?: boolean): String;
    /**
     * Flush stored errors
     * @return {integer} Number of errors flushed
     */
    get flush(): number;
    /**
     *
     * @param {string} prop_name Property's name which raised the error
     * @param {*} error Error raised
     * @param {*} value_which_raised  Value which raised the error
     */
    set_error(prop_name: any, error: any, value_which_raised?: any): void;
}
