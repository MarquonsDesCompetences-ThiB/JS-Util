/**
 * An array which guarantees elements unicity
 * Set does not allow to add another set to it
 * and does not provide Array's methods
 */
export class Set_Array extends Array {
    constructor() {
        super(...arguments);
    }
    concat(array) {
        const that = this;
        let new_elmts = array.filter((value) => {
            return !that.includes(value);
        });
        return super.concat(new_elmts);
    }
    push(array) {
        const that = this;
        let new_elmts = array.filter((value) => {
            return !that.includes(value);
        });
        return super.push(...new_elmts);
    }
    unshift() {
        const that = this;
        let new_elmts = [].filter.call(arguments, (value) => {
            return !that.includes(value);
        });
        return super.unshift(...new_elmts);
    }
}
//# sourceMappingURL=Set_Array.js.map