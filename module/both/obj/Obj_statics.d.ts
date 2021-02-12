export declare function exports_(module: any, to_export: any): void;
export declare function clone(object: any): any;
/**
 * Concatenate child props to parent props making an overriding :
 *   If no value in child_props but in parent_props, child_props' remains
 *   child_props' getter (if any) first calls parent_props' getter (if any)
 *   child_props' setter (if any) first calls parent_props' setter (if any)
 *
 * @param {Obj_Properties.props} parent_props If null, child_props is returned
 * @param {Obj_Properties.props} child_props If null, parent_props is returned
 *
 * @rturn {Obj_Properties.props}
 */
export declare function concat(parent_props: any, child_props: any): any;
export declare function get_non_enumerable_keys(obj: any): string[];
