'use strict'

class Util_values {
    constructor() {}

    /**
     * Set properties in obj to the specified jquery form
     * Form's names must be the same than object's properties
     * @param {jquery object} jquery_form 
     * @param {json} obj 
     */
    static set_form_values(jquery_form, obj) {
        for (let key in obj) {
            const selector = 'input[name="' + key + '"]';
            let inp = jquery_form.children(selector)[0];
            if (inp !== undefined) {
                inp.val(obj[key]);
            }
        }
    }
}

module.exports = Util_values;