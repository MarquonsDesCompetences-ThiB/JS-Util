/// <reference types="node" />
import { Readable } from "stream";
export declare enum eStream_State {
    WAITING = 0,
    PROCESSING = 1,
    PAUSED = 2,
    ERROR = 3,
    CLOSED = 4,
    FINISHING = 5,
    FINISHED = 6
}
export declare abstract class ReadableStream_WorkingQueue extends Readable {
    #private;
    /**
     * Error that occured, if any
     */
    protected error?: any;
    /**
     * Mutexes :
     * 0 : eStream_State
     */
    protected mutexes: Int8Array;
    protected datas: any[];
    /**
     * If chunks have any length property, position in stream
     * of the chunk being processed by this.process(chunk)
     */
    protected cursor: number;
    constructor(opts?: any);
    get state(): eStream_State;
    set state(state: eStream_State);
    /**
     * If return true, queue must be processed => mutex is taken
     */
    get get_processing_mutex(): boolean;
    release_processing_mutex(): void;
    /**
     * Called when chunks are received from stream,
     * ensuring there is always only one running process()
     * To be implemented to sequentially process incoming this.datas
     */
    abstract process(chunk: any): any;
}
