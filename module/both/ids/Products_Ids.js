"use strict";
import { number } from "../_both";
/**
 * https://api.bnf.fr/fr/les-identifiants-pivots-entre-les-api
 */
export class Products_Ids {
    //
    // EAN
    // https://www.gs1.org/standards/barcodes/ean-upc
    // https://www.gs1.org/1/gtinrules/fr/
    /**
     *
     * @param {*} ean
     */
    static is_ean(ean) {
        return (Products_Ids.is_ean_8(ean) ||
            Products_Ids.is_ean_13(ean) ||
            Products_Ids.is_upc(ean));
    }
    /**
     *
     * @param {*} ean
     */
    static is_ean_8(ean) {
        let ean_str = ean;
        if (number.is(ean_str)) {
            ean_str = Number.parseInt(ean_str);
        }
        if (ean_str.length !== 8) {
            return false;
        }
        return true;
    }
    /**
     *
     * @param {*} ean
     */
    static is_ean_13(ean) {
        let ean_str = ean;
        if (number.is(ean_str)) {
            ean_str = Number.parseInt(ean_str);
        }
        if (ean_str.length !== 13) {
            return false;
        }
        return true;
    }
    /**
     *
     * @param {*} ean
     */
    static is_upc(ean) {
        let ean_str = ean;
        if (number.is(ean_str)) {
            ean_str = Number.parseInt(ean_str);
        }
        if (ean_str.length !== 12) {
            return false;
        }
        return true;
    }
    //
    // ISBN
    static is_isbn(isbn) {
        return Products_Ids.is_isbn_10(isbn) || Products_Ids.is_isbn_13(isbn);
    }
    static is_isbn_10(isbn) {
        let isbn_str = isbn;
        if (number.is(isbn_str)) {
            isbn_str = Number.parseInt(isbn_str);
        }
        if (isbn_str.length !== 10) {
            return false;
        }
        return true;
    }
    static is_isbn_13(isbn) {
        let isbn_str = isbn;
        if (number.is(isbn_str)) {
            isbn_str = Number.parseInt(isbn_str);
        }
        if (isbn_str.length !== 13) {
            return false;
        }
        return true;
    }
}
Products_Ids.currencies = [];
module.exports = Products_Ids;
//# sourceMappingURL=Products_Ids.js.map