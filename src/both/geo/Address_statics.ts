"use strict";
export namespace address {
  export const lengthes = {
    number: {
      max: 8,

      digit: {
        min: 1,
        max: 4,
      },
      alpha: {
        min: 1,
        max: 4,
      },
    },
  };

  export const regex = {
    number:
      "/^(\\s*)(\\d){" +
      lengthes.number.digit.min +
      "," +
      lengthes.number.digit.max +
      "}\\s*([a-zA-Z]){" +
      lengthes.number.alpha.min +
      "," +
      lengthes.number.alpha.max +
      "}$/",
  };
}
