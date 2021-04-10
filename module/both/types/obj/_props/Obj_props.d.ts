import { Obj_Errors } from "../Obj_Errors.js";
/**
 * To quickly initialize Obj with a Properties class
 */
export declare abstract class Obj_props {
    /**
     * {Object}
     */
    static get props(): {};
    protected _errs: Obj_Errors;
    set_error(prop_name: any, error: any, value_which_raised?: any): void;
    get errs(): Obj_Errors;
    updated_members: string[];
    /**
     * All property keys of this object
     * (=> at every generation contrary to Object.keys)
     *
     * @return {Set}
     */
    get all_keys(): string[];
    get non_enumerable_keys(): string[];
    /**
     * Return updated members values (identified by this.updated_members)
     * to be Redis set compliant => 2n values alternating
     * member key (Redis structure format), member value
     *
     * @param{json} Json associating ever member with its Redis format
     *
     * @return{string[]}
     */
    get_redis_array(key_members_to_redis: any): any[];
    flush_updated_members(): void;
    /**
     * Push member_name in this.updated_members if it's not already inside
     * @param {string} member_name
     */
    push_updated_member(member_name: any): void;
    set_updated_members(object_memberNames_to_DB_format: any): void;
}
