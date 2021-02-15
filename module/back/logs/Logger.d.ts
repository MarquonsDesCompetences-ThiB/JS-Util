/// <reference types="node" />
import { Logger_props } from "./_props/Logger_props.js";
export declare class Logger extends Logger_props {
    /**
     * Override of stream.Writable._write
     * https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback_1
     */
    _write(chunk: Buffer | string | any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    /**
     * Log specified message as debug
     * Class name is prefixed to log
     */
    set debug(message: any);
    set info(message: any);
    /**
     * Log specified message as error
     * Class name is prefixed to log
     */
    set error(message: any);
    /**
     * @param {string|Error|(string|Error)[]}
     */
    set ex(ex: string | Error | (string | Error)[]);
    set fatal(message: any);
    /**
     * Log specified message
     * Class name is prefixed to log
     */
    set log(message: any);
    /**
     * @param{object[]} If 1st element is a string, displayed before the table
     */
    set table(array: any);
    /**
     * Log specified message as trace
     * Class name is prefixed to log
     */
    set trace(message: any);
    /**
     * Log specified message as warning
     * Class name is prefixed to log
     */
    set warn(message: any);
}
