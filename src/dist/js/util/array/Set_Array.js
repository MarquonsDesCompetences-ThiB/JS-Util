"use strict";

/**
 * An array which guarantees elements unicity
 * Set does not allow to add another set to it
 * and does not provide Array's methods
 */
class Set_Array extends Array {
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

  push() {
    const that = this;
    let new_elmts = array.filter((value) => {
      return !that.includes(value);
    });

    return super.push(...new_elmts);
  }

  splice() {
    const that = this;
    let new_elmts = arguments.filter((value, index) => {
      /*
            The 2 first arguments are index and how many
            => keep them for super.splice
        */
      if (index < 2) {
        return true;
      }

      return !that.includes(value);
    });

    return super.splice(...new_elmts);
  }

  unshift() {
    const that = this;
    let new_elmts = arguments.filter((value) => {
      return !that.includes(value);
    });

    return super.unshift(...new_elmts);
  }
}

if (typeof process !== undefined) {
  module.exports = Set_Array;
}
