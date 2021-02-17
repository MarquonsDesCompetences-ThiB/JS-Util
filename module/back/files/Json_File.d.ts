import { Json_File_props } from "./_props/Json_File_props";
export declare class Json_File extends Json_File_props {
    read_key(key: string | string[]): Promise<string[]>;
    read(): Promise<any>;
    write(): Promise<void>;
}
