/**
 * https://api.bnf.fr/fr/les-identifiants-pivots-entre-les-api
 */
export declare class Products_Ids {
    static currencies: any[];
    /**
     *
     * @param {*} ean
     */
    static is_ean(ean: any): boolean;
    /**
     *
     * @param {*} ean
     */
    static is_ean_8(ean: any): boolean;
    /**
     *
     * @param {*} ean
     */
    static is_ean_13(ean: any): boolean;
    /**
     *
     * @param {*} ean
     */
    static is_upc(ean: any): boolean;
    static is_isbn(isbn: any): boolean;
    static is_isbn_10(isbn: any): boolean;
    static is_isbn_13(isbn: any): boolean;
}
