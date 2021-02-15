import { Readable } from "stream";

export enum eStream_State {
  WAITING, // waiting for input data to be read
  PROCESSING, //processing received data with process()
  PAUSED,
  ERROR,
  CLOSED, //closed before end of stream
  FINISHING, // when 'end' occurred but still processing
  FINISHED, //processing is over
}

export abstract class ReadableStream_WorkingQueue extends Readable {
  #state: eStream_State = eStream_State.WAITING;

  /**
   * Error that occured, if any
   */
  protected error?;

  /**
   * Mutexes :
   * 0 : eStream_State
   */
  protected mutexes: Int8Array = new Int8Array(1);

  protected datas = [];

  /**
   * If chunks have any length property, position in stream
   * of the chunk being processed by this.process(chunk)
   */
  protected cursor: number = 0;

  constructor(opts?) {
    super(opts);

    this.on("readable", () => {
      while (this.read());
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

    this.on("error", (err: Error) => {
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
    if (
      Atomics.load(
        this.mutexes,
        0 //is_processing mutex
      )
    ) {
      return eStream_State.PROCESSING;
    }

    return this.#state;
  }

  set state(state: eStream_State) {
    this.#state = state;
  }

  //
  // === MUTEXES ===
  //
  // === Mutex is_processing
  /**
   * If return true, queue must be processed => mutex is taken
   */
  get get_processing_mutex(): boolean {
    //
    // If mutex not taken
    if (
      !Atomics.exchange(
        this.mutexes,
        0, //is_processing mutex
        1 //true
      )
    ) {
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
    } else {
      this.state = eStream_State.WAITING;
    }

    Atomics.exchange(
      this.mutexes,
      0, //is_processing mutex
      0 //false
    );
  }

  /**
   * Called when chunks are received from stream,
   * ensuring there is always only one running process()
   * To be implemented to sequentially process incoming this.datas
   */
  abstract process(chunk: any);
}
