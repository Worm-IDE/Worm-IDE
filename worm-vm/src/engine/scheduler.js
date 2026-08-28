// src/engine/scheduler.js
export default class Scheduler {
  constructor(runtime) {
    this.runtime = runtime;
    this.threads = [];
  }

  step() {
    for (const thread of this.threads) {
      this.runtime.interpreter.stepThread(thread);
    }
  }
}
