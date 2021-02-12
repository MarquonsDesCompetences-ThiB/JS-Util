"use strict";
export var address;
(function (address) {
    address.lengthes = {
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
    address.regex = {
        number: "/^(\\s*)(\\d){" +
            address.lengthes.number.digit.min +
            "," +
            address.lengthes.number.digit.max +
            "}\\s*([a-zA-Z]){" +
            address.lengthes.number.alpha.min +
            "," +
            address.lengthes.number.alpha.max +
            "}$/",
    };
})(address || (address = {}));
//# sourceMappingURL=Address_statics.js.map