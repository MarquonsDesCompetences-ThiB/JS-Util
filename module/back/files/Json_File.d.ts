import { Json_File_props } from "./_props/Json_File_props.js";
export declare class Json_File extends Json_File_props {
    read_key(key: string | string[]): Promise<string[]>;
    read(): Promise<any>;
    read_keys(keys: string[], force_read?: boolean): Promise<any>;
    write(data?: any): Promise<any>;
}
