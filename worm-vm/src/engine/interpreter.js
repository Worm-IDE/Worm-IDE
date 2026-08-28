// src/engine/interpreter.js
import { Opcodes } from "../blocks/opcodes.js";
import { BlockMap } from "../blocks/block-map.js";

export default class Interpreter {
  stepThread(thread) {
    const block = thread.stack[thread.stack.length - 1];
    const opcode = BlockMap[block.id];
    const fn = Opcodes[opcode];

    if (fn) fn(block.args, thread);
  }
}
