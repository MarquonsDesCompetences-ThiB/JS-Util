/**
 * An array which guarantees elements unicity
 * Set does not allow to add another set to it
 * and does not provide Array's methods
 */
declare class Set_Array extends Array {
    constructor();
    concat(array: any): any[];
    push(array: any[]): number;
    unshift(): number;
}
