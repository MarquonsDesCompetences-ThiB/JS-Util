export interface iResults {
    nb: number;
    success: number;
    fails: number;
}
export declare function empty_Results(): iResults;
export declare function add_Results(result_in_out: iResults, result_in: iResults): iResults;
