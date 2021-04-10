import { to_object as primitive_to_object } from "../../types/type.js";
/**
 * All waiting promises ids
 */
const waiting_promises = new WeakSet();
/**
 * Associate waiting id to its computed data
 */
const waiting_promises_results = new WeakMap();
export function wakable_promise(id, check_delay_ms = 10) {
    // If id argument is a primitive,
    // convert it to object
    // for WeakMap compatibility
    id = primitive_to_object(id);
    //
    // Check for existence of the requested data
    {
        if (waiting_promises_results.has(id)) {
            //
            // Return the data
            return Promise.resolve(waiting_promises_results.get(id));
        }
        else {
            waiting_promises.add(id);
        }
    }
    //
    // Wait for <check_delay_ms>ms then recursive call
    // to return the datas or wait again for them
    return new Promise(() => {
        setTimeout(() => {
            return wakable_promise(id, check_delay_ms);
        }, check_delay_ms);
    });
}
export function awake_promise(id, datas) {
    // If id argument is a primitive,
    // convert it to object
    // for WeakMap compatibility
    id = primitive_to_object(id);
    //
    // Add datas
    waiting_promises_results.set(id, datas);
}
//# sourceMappingURL=Wakable_Promise.js.map