// src/engine/runtime.js

import Interpreter from "./interpreter.js";
import Scheduler from "./scheduler.js";

/**
 * Worm Runtime
 * Central engine: manages targets (sprites/stage), threads, and the main loop.
 */
export default class Runtime {
  constructor() {
    /** @type {Array<any>} all targets (stage + sprites) */
    this.targets = [];

    /** @type {Array<any>} threads currently executing */
    this.threads = [];

    /** @type {Interpreter} */
    this.interpreter = new Interpreter(this);

    /** @type {Scheduler} */
    this.scheduler = new Scheduler(this);

    /** simple flag for green‑flag style running */
    this.running = false;
  }

  // ---------- TARGET MANAGEMENT ----------

  /**
   * Add a target (sprite or stage) to the runtime.
   * @param {any} target
   */
  addTarget(target) {
    this.targets.push(target);
    return target;
  }

  /**
   * Get all targets.
   */
  getTargets() {
    return this.targets;
  }

  /**
   * Find a target by id (if you store ids on them).
   * @param {string} id
   */
  getTargetById(id) {
    return this.targets.find(t => t.id === id) || null;
  }

  // ---------- THREAD MANAGEMENT ----------

  /**
   * Create a new thread for a script stack on a target.
   * @param {any} target
   * @param {Array<any>} initialStack array of block objects
   */
  startThread(target, initialStack) {
    const thread = {
      target,
      stack: [...initialStack],   // array of blocks
      status: "running"
    };
    this.threads.push(thread);
    return thread;
  }

  /**
   * Stop all threads.
   */
  stopAllThreads() {
    this.threads = [];
  }

  // ---------- MAIN LOOP ----------

  /**
   * One VM step: advance all threads by one block.
   */
  step() {
    this.scheduler.step();
  }

  /**
   * Start continuous execution (like Scratch green flag).
   */
  start() {
    if (this.running) return;
    this.running = true;

    const loop = () => {
      if (!this.running) return;
      this.step();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /**
   * Stop continuous execution.
   */
  stop() {
    this.running = false;
    this.stopAllThreads();
  }
}
import Scheduler from "./scheduler.js";
import Interpreter from "./interpreter.js";

export default class Runtime {
  constructor() {
    this.interpreter = new Interpreter(this);
    this.scheduler = new Scheduler(this);
    this.targets = [];
  }

  start() {
    const loop = () => {
      this.scheduler.step();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
