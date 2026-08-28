// src/engine/thread.js
export default class Thread {
  constructor(target) {
    this.target = target;
    this.stack = [];
    this.repeatStack = [];
    this.status = "running";
  }
}
