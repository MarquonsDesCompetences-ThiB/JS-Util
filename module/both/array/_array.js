export * as elmt from "./iElmt.js";
export { Set_Array } from "./Set_Array.js";
/**
 * To specify a position in an array
 */
export var ePosition;
(function (ePosition) {
    ePosition[ePosition["FIRST_OCCURENCE"] = -1] = "FIRST_OCCURENCE";
    ePosition[ePosition["LAST_OCCURENCE"] = -2] = "LAST_OCCURENCE";
})(ePosition || (ePosition = {}));
//# sourceMappingURL=_array.js.map