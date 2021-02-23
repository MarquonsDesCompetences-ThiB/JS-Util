export function get_idxs(elmts) {
    const idxs = [];
    elmts.forEach((elmt) => {
        idxs.push(elmt.idx);
    });
    return idxs;
}
export function get_values(elmts) {
    const values = [];
    elmts.forEach((elmt) => {
        values.push(elmt.value);
    });
    return values;
}
export function get_ids(elmts) {
    const ids = [];
    elmts.forEach((elmt) => {
        ids.push(elmt.id);
    });
    return ids;
}
//# sourceMappingURL=iElmt.js.map