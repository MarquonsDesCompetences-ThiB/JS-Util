/// <reference types="node" />
import stream from "stream";
import { Logger } from "../Logger.js";
export declare class Logger_props extends stream.Writable {
    #private;
    static logger: Logger;
    /**
     * When calling this.write(chunk, encoding, cbk),
     * if chunk is a buffer, how to encode it
     * https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback_1
     */
    encoding: BufferEncoding;
    protected logs: any;
    protected file_desc: any;
    /**
     * Other streams to call when this is called
     */
    protected _thrs_strms: stream.Writable[];
    /**
     * https://nodejs.org/api/stream.html#stream_implementing_a_writable_stream
     *
     * @param file_name_prefix
     * @param other_stream_to_call Opional stream to call ; for example, original std.out
     * @param writable_stream_opts
     */
    constructor(file_name_prefix?: string, other_stream_to_call?: stream.Writable, writable_stream_opts?: stream.WritableOptions);
    add_stream_to_call(writable_stream: stream.Writable): void;
    get file_path(): string;
    set file_path(file_path: string);
}
