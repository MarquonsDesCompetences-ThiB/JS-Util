export interface iElmt<T> {
    idx: number;
    value: T;
}
export interface iIdentified_Elmt<Tid, Tvalue> extends iElmt<Tvalue> {
    id: Tid;
}
