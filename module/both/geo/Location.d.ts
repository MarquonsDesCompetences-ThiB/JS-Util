import { Location_props } from "./_props/Location_props.js";
export declare class Location extends Location_props {
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj?: any);
    equals(location: any): boolean;
    /**
     * Set every members in obj but functions
     *
     * @param {json|object} obj
     *
     * @return number of set/not set members which are not a function
     *          3 values : nb_set, nb_not_set, that
     */
    set(obj: any): {
        nb_set: number;
        nb_nset: number;
        nb_nset_ro: number;
    };
    to_string(): string;
}
