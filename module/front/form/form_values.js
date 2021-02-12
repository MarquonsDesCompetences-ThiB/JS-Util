"use strict";
export var form_values;
(function (form_values) {
    /**
     * Set properties in obj to the specified jquery form
     * Form's names must be the same than object's properties
     * @param {jquery object} jquery_form
     * @param {json} obj
     */
    function set_form_values(jquery_form, obj) {
        for (let key in obj) {
            const selector = 'input[name="' + key + '"]';
            let inp = jquery_form.children(selector)[0];
            if (inp !== undefined) {
                inp.val(obj[key]);
            }
        }
    }
    form_values.set_form_values = set_form_values;
})(form_values || (form_values = {}));
//# sourceMappingURL=form_values.js.map