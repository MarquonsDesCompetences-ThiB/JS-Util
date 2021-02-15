var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _state;
import { Readable } from "stream";
export var eStream_State;
(function (eStream_State) {
    eStream_State[eStream_State["WAITING"] = 0] = "WAITING";
    eStream_State[eStream_State["PROCESSING"] = 1] = "PROCESSING";
    eStream_State[eStream_State["PAUSED"] = 2] = "PAUSED";
    eStream_State[eStream_State["ERROR"] = 3] = "ERROR";
    eStream_State[eStream_State["CLOSED"] = 4] = "CLOSED";
    eStream_State[eStream_State["FINISHING"] = 5] = "FINISHING";
    eStream_State[eStream_State["FINISHED"] = 6] = "FINISHED";
})(eStream_State || (eStream_State = {}));
export class ReadableStream_WorkingQueue extends Readable {
    constructor(opts) {
        super(opts);
        _state.set(this, eStream_State.WAITING);
        /**
         * Mutexes :
         * 0 : eStream_State
         */
        this.mutexes = new Int8Array(1);
        this.datas = [];
        /**
         * If chunks have any length property, position in stream
         * of the chunk being processed by this.process(chunk)
         */
        this.cursor = 0;
        this.on("readable", () => {
            while (this.read())
                ;
        });
        /**
         * Called by this.read()
         */
        this.on("data", (chunk) => {
            //
            // Appending datas and check if must process it
            {
                this.datas.push(chunk);
                if (!this.get_processing_mutex) {
                    return;
                }
            }
            //
            // Processing datas
            {
                while ((chunk = this.datas.shift())) {
                    this.process(chunk);
                    //
                    // Update cursor position
                    {
                        const chunk_length = chunk.length;
                        if (chunk_length) {
                            this.cursor += chunk_length;
                        }
                    }
                }
                this.release_processing_mutex();
            }
        });
        this.on("close", () => {
            this.state = eStream_State.CLOSED;
        });
        this.on("end", () => {
            this.state = eStream_State.FINISHING;
        });
        this.on("error", (err) => {
            this.state = eStream_State.ERROR;
            this.error = err;
        });
        this.on("pause", () => {
            this.state = eStream_State.PAUSED;
        });
        this.on("resume", () => {
            this.state = eStream_State.WAITING;
        });
    }
    get state() {
        //
        // To avoid wrong value change of state in this.on("data")
        if (Atomics.load(this.mutexes, 0 //is_processing mutex
        )) {
            return eStream_State.PROCESSING;
        }
        return __classPrivateFieldGet(this, _state);
    }
    set state(state) {
        __classPrivateFieldSet(this, _state, state);
    }
    //
    // === MUTEXES ===
    //
    // === Mutex is_processing
    /**
     * If return true, queue must be processed => mutex is taken
     */
    get get_processing_mutex() {
        //
        // If mutex not taken
        if (!Atomics.exchange(this.mutexes, 0, //is_processing mutex
        1 //true
        )) {
            this.state = eStream_State.PROCESSING;
            return true;
        }
        //
        // Else already taken
        return false;
    }
    release_processing_mutex() {
        if (this.state === eStream_State.FINISHING) {
            this.state = eStream_State.FINISHED;
        }
        else {
            this.state = eStream_State.WAITING;
        }
        Atomics.exchange(this.mutexes, 0, //is_processing mutex
        0 //false
        );
    }
}
_state = new WeakMap();
//# sourceMappingURL=ReadableStream_WorkingQueue.js.map