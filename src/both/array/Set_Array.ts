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
    const new_elmts = array.filter((value) => {
      return !this.includes(value);
    });

    return super.concat(new_elmts);
  }

  push(...vals: any[]): number {
    const new_elmts = vals.filter((value) => {
      return !this.includes(value);
    });

    return super.push(...new_elmts);
  }

  unshift() {
    const new_elmts = [].filter.call(arguments, (value) => {
      return !this.includes(value);
    });

    return super.unshift(...new_elmts);
  }
}
