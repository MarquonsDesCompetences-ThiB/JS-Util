//
// === iELEMENT ===
export interface iElmt<T> {
  idx: number;
  value: T;
}

export function get_idxs<T>(elmts: iElmt<T>[]): number[] {
  const idxs: number[] = [];
  elmts.forEach((elmt) => {
    idxs.push(elmt.idx);
  });

  return idxs;
}

export function get_values<T>(elmts: iElmt<T>[]): T[] {
  const values: T[] = [];
  elmts.forEach((elmt) => {
    values.push(elmt.value);
  });

  return values;
}

//
// === iIDENTIFIED ELEMENT ===
export interface iIdentified_Elmt<Tid, Tvalue> extends iElmt<Tvalue> {
  id: Tid;
}

export function get_ids<Tid, Tvalue>(
  elmts: iIdentified_Elmt<Tid, Tvalue>[]
): Tid[] {
  const ids: Tid[] = [];
  elmts.forEach((elmt) => {
    ids.push(elmt.id);
  });

  return ids;
}
