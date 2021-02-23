export interface iElmt<T> {
    idx: number;
    value: T;
}
export declare function get_idxs<T>(elmts: iElmt<T>[]): number[];
export declare function get_values<T>(elmts: iElmt<T>[]): T[];
export interface iIdentified_Elmt<Tid, Tvalue> extends iElmt<Tvalue> {
    id: Tid;
}
export declare function get_ids<Tid, Tvalue>(elmts: iIdentified_Elmt<Tid, Tvalue>[]): Tid[];
