"use strict";
import * as obj from "../Obj_statics.js";
/**
 * Preconds
 */
import { Obj_Errors } from "../Obj_Errors.js";
/**
 * To quickly initialize Obj with a Properties class
 */
export class Obj_props {
    constructor() {
        //
        // === PROPERTIES ===s
        //
        // To handle set errors
        this.errs = new Obj_Errors();
        /*
            Members updated that need to be stored in DB
            string[] : members name
          */
        this.updated_members = [];
    }
    //
    // === STATICS RELATIVE TO CLASS ===
    /**
     * {Object}
     */
    static get props() {
        let ret = {};
        const props = Object.getOwnPropertyNames(this);
        {
            //
            // We don't want any of those properties
            const wrong_props = [
                //default JS static properties
                "length",
                "prototype",
                //Obj_Properties' properties
                "props",
                "lenghtes",
                "regex",
            ];
            //
            // Iterate props' names and fetch the right ones (eg. not in wrong_props)
            for (const name of props) {
                if (!wrong_props.includes(name)) {
                    ret[name] = this[name];
                }
            }
        }
        return ret;
    }
    set_error(prop_name, error, value_which_raised) {
        this.errs.set_error(prop_name, error, value_which_raised);
    }
    /**
     * All property keys of this object
     * (=> at every generation contrary to Object.keys)
     *
     * @return {Set}
     */
    get all_keys() {
        let keys = new Set();
        let proto = this;
        do {
            //
            // Enumerable ones
            {
                Object.keys(proto).forEach((key) => {
                    keys.add(key);
                });
            }
            //
            // Not enumerable ones
            {
                const nenums = proto.constructor[Symbol.for(proto.constructor.name + "_nenums")];
                if (nenums) {
                    nenums.forEach((key) => {
                        keys.add(key);
                    });
                }
            }
        } while ((proto = Object.getPrototypeOf(proto)) != null);
        return keys;
    }
    get non_enumerable_keys() {
        return obj.get_non_enumerable_keys(this);
    }
    //
    // === DB SYNCHRONIZATION ===
    /**
     * Return updated members values (identified by this.updated_members)
     * to be Redis set compliant => 2n values alternating
     * member key (Redis structure format), member value
     *
     * @param{json} Json associating ever member with its Redis format
     *
     * @return{string[]}
     */
    get_redis_array(key_members_to_redis) {
        let arr = [];
        for (let i = 0; i < this.updated_members.length; i++) {
            let member = this.updated_members[i];
            const value = this[member];
            const value_type = typeof value;
            if (value === null ||
                value_type === "undefined" ||
                (value_type === "object" && !(value instanceof Date))) {
                logger.warn =
                    "Obj#get_redis_array Member " +
                        member +
                        " has wrong type " +
                        value_type +
                        " ; skipping it";
                continue;
            }
            logger.log =
                "Obj#get_redis_array Member " + member + " type : " + value_type;
            //
            // Redis member key
            {
                if (!key_members_to_redis[member]) {
                    logger.error =
                        "Obj#get_redis_array No Redis key format associated to member " +
                            member;
                    continue;
                }
                arr.push(key_members_to_redis[member]);
            }
            //
            // Member's value
            {
                let string_value = value;
                // number to string
                if (value_type === "number" || value instanceof Number) {
                    string_value = value + "";
                }
                // Date to string
                else if (value instanceof Date) {
                    string_value = value.toString();
                }
                arr.push(string_value);
            }
        }
        return arr;
    }
    flush_updated_members() {
        this.updated_members = [];
    }
    /**
     * Push member_name in this.updated_members if it's not already inside
     * @param {string} member_name
     */
    push_updated_member(member_name) {
        if (!this.updated_members.includes(member_name)) {
            this.updated_members.push(member_name);
        }
    }
    set_updated_members(object_memberNames_to_DB_format) {
        for (const member_name in object_memberNames_to_DB_format) {
            this.push_updated_member(member_name);
        }
    }
}
//# sourceMappingURL=Obj_props.js.map