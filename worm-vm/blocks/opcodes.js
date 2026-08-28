// blocks/opcodes.js
// Full opcode pack for Worm VM (Scratch-style)

export const Opcodes = {
  // ========== MOTION ==========
  motion_moveSteps(args, thread) {
    const sprite = thread.target;
    sprite.x += Number(args.STEPS || 0);
  },

  motion_turnRight(args, thread) {
    const sprite = thread.target;
    sprite.direction += Number(args.DEGREES || 0);
  },

  motion_turnLeft(args, thread) {
    const sprite = thread.target;
    sprite.direction -= Number(args.DEGREES || 0);
  },

  motion_goTo(args, thread) {
    const sprite = thread.target;
    const dest = args.TO;
    if (dest === "_mouse") {
      sprite.x = thread.runtime.mouse.x;
      sprite.y = thread.runtime.mouse.y;
    } else {
      const target = thread.runtime.getTargetById(dest);
      if (target) {
        sprite.x = target.x;
        sprite.y = target.y;
      }
    }
  },

  motion_goToXY(args, thread) {
    const sprite = thread.target;
    sprite.x = Number(args.X || 0);
    sprite.y = Number(args.Y || 0);
  },

  motion_glideTo(args, thread) {
    // Simple instant glide (no tween)
    const sprite = thread.target;
    const dest = args.TO;
    if (dest === "_mouse") {
      sprite.x = thread.runtime.mouse.x;
      sprite.y = thread.runtime.mouse.y;
    } else {
      const target = thread.runtime.getTargetById(dest);
      if (target) {
        sprite.x = target.x;
        sprite.y = target.y;
      }
    }
  },

  motion_glideXY(args, thread) {
    const sprite = thread.target;
    sprite.x = Number(args.X || 0);
    sprite.y = Number(args.Y || 0);
  },

  motion_pointInDirection(args, thread) {
    const sprite = thread.target;
    sprite.direction = Number(args.DIRECTION || 90);
  },

  motion_pointTowards(args, thread) {
    const sprite = thread.target;
    const dest = args.TOWARDS;
    let dx = 0;
    let dy = 0;
    if (dest === "_mouse") {
      dx = thread.runtime.mouse.x - sprite.x;
      dy = thread.runtime.mouse.y - sprite.y;
    } else {
      const target = thread.runtime.getTargetById(dest);
      if (target) {
        dx = target.x - sprite.x;
        dy = target.y - sprite.y;
      }
    }
    sprite.direction = (Math.atan2(dy, dx) * 180) / Math.PI;
  },

  motion_changeXBy(args, thread) {
    const sprite = thread.target;
    sprite.x += Number(args.DX || 0);
  },

  motion_setX(args, thread) {
    const sprite = thread.target;
    sprite.x = Number(args.X || 0);
  },

  motion_changeYBy(args, thread) {
    const sprite = thread.target;
    sprite.y += Number(args.DY || 0);
  },

  motion_setY(args, thread) {
    const sprite = thread.target;
    sprite.y = Number(args.Y || 0);
  },

  motion_ifOnEdgeBounce(args, thread) {
    const sprite = thread.target;
    const stage = thread.runtime.stage;
    if (!stage) return;
    const halfW = stage.width / 2;
    const halfH = stage.height / 2;
    let bounced = false;
    if (sprite.x > halfW) {
      sprite.x = halfW;
      bounced = true;
    }
    if (sprite.x < -halfW) {
      sprite.x = -halfW;
      bounced = true;
    }
    if (sprite.y > halfH) {
      sprite.y = halfH;
      bounced = true;
    }
    if (sprite.y < -halfH) {
      sprite.y = -halfH;
      bounced = true;
    }
    if (bounced) sprite.direction = 180 - sprite.direction;
  },

  motion_setRotationStyle(args, thread) {
    const sprite = thread.target;
    sprite.rotationStyle = args.STYLE || "all around";
  },

  // ========== LOOKS ==========
  looks_say(args, thread) {
    thread.target.sayBubble = String(args.MESSAGE || "");
  },

  looks_sayForSecs(args, thread) {
    thread.target.sayBubble = String(args.MESSAGE || "");
    thread.target.sayExpire = performance.now() + Number(args.SECS || 2) * 1000;
  },

  looks_think(args, thread) {
    thread.target.thinkBubble = String(args.MESSAGE || "");
  },

  looks_thinkForSecs(args, thread) {
    thread.target.thinkBubble = String(args.MESSAGE || "");
    thread.target.thinkExpire = performance.now() + Number(args.SECS || 2) * 1000;
  },

  looks_show(args, thread) {
    thread.target.visible = true;
  },

  looks_hide(args, thread) {
    thread.target.visible = false;
  },

  looks_switchCostumeTo(args, thread) {
    thread.target.costume = args.COSTUME || 0;
  },

  looks_nextCostume(args, thread) {
    thread.target.costume = (thread.target.costume || 0) + 1;
  },

  looks_switchBackdropTo(args, thread) {
    const stage = thread.runtime.stage;
    if (stage) stage.backdrop = args.BACKDROP || 0;
  },

  looks_nextBackdrop(args, thread) {
    const stage = thread.runtime.stage;
    if (stage) stage.backdrop = (stage.backdrop || 0) + 1;
  },

  looks_changeEffectBy(args, thread) {
    const effect = args.EFFECT;
    const amount = Number(args.AMOUNT || 0);
    thread.target.effects = thread.target.effects || {};
    thread.target.effects[effect] =
      (thread.target.effects[effect] || 0) + amount;
  },

  looks_setEffectTo(args, thread) {
    const effect = args.EFFECT;
    const value = Number(args.VALUE || 0);
    thread.target.effects = thread.target.effects || {};
    thread.target.effects[effect] = value;
  },

  looks_clearGraphicEffects(args, thread) {
    thread.target.effects = {};
  },

  looks_changeSizeBy(args, thread) {
    thread.target.size = (thread.target.size || 100) + Number(args.AMOUNT || 0);
  },

  looks_setSizeTo(args, thread) {
    thread.target.size = Number(args.SIZE || 100);
  },

  looks_goToFrontBack(args, thread) {
    const mode = args.FRONT_BACK;
    const list = thread.runtime.targets;
    const idx = list.indexOf(thread.target);
    if (idx === -1) return;
    list.splice(idx, 1);
    if (mode === "front") list.push(thread.target);
    else list.unshift(thread.target);
  },

  looks_goForwardBackwardLayers(args, thread) {
    const list = thread.runtime.targets;
    const idx = list.indexOf(thread.target);
    if (idx === -1) return;
    const n = Number(args.NUM || 1);
    let newIdx = idx + (args.FORWARD_BACK === "forward" ? n : -n);
    newIdx = Math.max(0, Math.min(list.length - 1, newIdx));
    list.splice(idx, 1);
    list.splice(newIdx, 0, thread.target);
  },

  // ========== SOUND ==========
  sound_play(args, thread) {
    thread.runtime.audio.playSound(args.SOUND || "");
  },

  sound_playUntilDone(args, thread) {
    thread.runtime.audio.playSound(args.SOUND || "", { wait: true, thread });
  },

  sound_stopAllSounds(args, thread) {
    thread.runtime.audio.stopAll();
  },

  sound_playDrumForBeats(args, thread) {
    thread.runtime.audio.playDrum(args.DRUM || 1, Number(args.BEATS || 0.25));
  },

  sound_restForBeats(args, thread) {
    thread.waitTimer = performance.now() + Number(args.BEATS || 0.25) * 500;
  },

  sound_playNoteForBeats(args, thread) {
    thread.runtime.audio.playNote(
      Number(args.NOTE || 60),
      Number(args.BEATS || 0.5)
    );
  },

  sound_setInstrument(args, thread) {
    thread.runtime.audio.instrument = Number(args.INSTRUMENT || 1);
  },

  sound_changeEffectBy(args, thread) {
    const effect = args.EFFECT;
    const amount = Number(args.AMOUNT || 0);
    thread.runtime.audio.effects[effect] =
      (thread.runtime.audio.effects[effect] || 0) + amount;
  },

  sound_setEffectTo(args, thread) {
    const effect = args.EFFECT;
    const value = Number(args.VALUE || 0);
    thread.runtime.audio.effects[effect] = value;
  },

  sound_clearEffects(args, thread) {
    thread.runtime.audio.effects = {};
  },

  sound_changeVolumeBy(args, thread) {
    thread.runtime.audio.volume += Number(args.AMOUNT || 0);
  },

  sound_setVolumeTo(args, thread) {
    thread.runtime.audio.volume = Number(args.VOLUME || 100);
  },

  // ========== EVENTS ==========
  event_whenFlagClicked(args, thread) {
    // Handled by runtime: this is a hat block.
  },

  event_whenKeyPressed(args, thread) {
    // Hat block, runtime triggers.
  },

  event_whenThisSpriteClicked(args, thread) {
    // Hat block, runtime triggers.
  },

  event_whenBackdropSwitchesTo(args, thread) {
    // Hat block, runtime triggers.
  },

  event_whenGreaterThan(args, thread) {
    // Hat block, runtime triggers.
  },

  event_whenBroadcastReceived(args, thread) {
    // Hat block, runtime triggers.
  },

  event_broadcast(args, thread) {
    thread.runtime.broadcast(args.MESSAGE);
  },

  event_broadcastAndWait(args, thread) {
    thread.runtime.broadcastAndWait(args.MESSAGE, thread);
  },

  // ========== CONTROL ==========
  control_wait(args, thread) {
    const secs = Number(args.SECONDS || 1);
    thread.waitTimer = performance.now() + secs * 1000;
  },

  control_repeat(args, thread) {
    const times = Number(args.TIMES || 10);
    thread.repeatStack = thread.repeatStack || [];
    thread.repeatStack.push({ times, counter: 0, startIndex: thread.stack.length });
  },

  control_forever(args, thread) {
    thread.forever = true;
  },

  control_if(args, thread) {
    if (!this._truthy(args.CONDITION)) {
      thread.skipNext = true;
    }
  },

  control_ifElse(args, thread) {
    thread.ifElseCondition = this._truthy(args.CONDITION);
  },

  control_waitUntil(args, thread) {
    if (!this._truthy(args.CONDITION)) {
      thread.status = "waiting";
    }
  },

  control_repeatUntil(args, thread) {
    thread.repeatUntil = {
      condition: args.CONDITION,
      startIndex: thread.stack.length
    };
  },

  control_stop(args, thread) {
    const what = args.WHAT || "all";
    if (what === "all") {
      thread.runtime.stopAllThreads();
    } else if (what === "this script") {
      thread.status = "stopped";
    }
  },

  control_startAsClone(args, thread) {
    // Hat block for clones.
  },

  control_createCloneOf(args, thread) {
    thread.runtime.createClone(args.CLONE_OPTION, thread.target);
  },

  control_deleteThisClone(args, thread) {
    thread.runtime.deleteClone(thread.target);
  },

  // helper
  _truthy(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.length > 0;
    return !!value;
  },

  // ========== SENSING ==========
  sensing_touchingObject(args, thread) {
    // Placeholder: collision system needed
    return false;
  },

  sensing_touchingColor(args, thread) {
    return false;
  },

  sensing_colorIsTouchingColor(args, thread) {
    return false;
  },

  sensing_distanceTo(args, thread) {
    const sprite = thread.target;
    const dest = args.TO;
    let dx = 0;
    let dy = 0;
    if (dest === "_mouse") {
      dx = thread.runtime.mouse.x - sprite.x;
      dy = thread.runtime.mouse.y - sprite.y;
    } else {
      const target = thread.runtime.getTargetById(dest);
      if (target) {
        dx = target.x - sprite.x;
        dy = target.y - sprite.y;
      }
    }
    return Math.sqrt(dx * dx + dy * dy);
  },

  sensing_askAndWait(args, thread) {
    const question = String(args.QUESTION || "");
    thread.runtime.io.ask(question, thread);
  },

  sensing_answer(args, thread) {
    return thread.runtime.io.answer || "";
  },

  sensing_keyPressed(args, thread) {
    return !!thread.runtime.keyboard.keys[args.KEY];
  },

  sensing_mouseDown(args, thread) {
    return !!thread.runtime.mouse.down;
  },

  sensing_mouseX(args, thread) {
    return thread.runtime.mouse.x;
  },

  sensing_mouseY(args, thread) {
    return thread.runtime.mouse.y;
  },

  sensing_setDragMode(args, thread) {
    thread.target.draggable = args.MODE === "draggable";
  },

  sensing_loudness(args, thread) {
    return thread.runtime.audio.loudness || 0;
  },

  sensing_timer(args, thread) {
    return (performance.now() - thread.runtime.timerStart) / 1000;
  },

  sensing_resetTimer(args, thread) {
    thread.runtime.timerStart = performance.now();
  },

  sensing_of(args, thread) {
    // Generic property access
    const property = args.PROPERTY;
    const targetName = args.OBJECT;
    const target = thread.runtime.getTargetById(targetName);
    if (!target) return 0;
    return target[property];
  },

  sensing_current(args, thread) {
    const what = args.WHAT;
    const now = new Date();
    switch (what) {
      case "year": return now.getFullYear();
      case "month": return now.getMonth() + 1;
      case "date": return now.getDate();
      case "dayofweek": return now.getDay() + 1;
      case "hour": return now.getHours();
      case "minute": return now.getMinutes();
      case "second": return now.getSeconds();
      default: return 0;
    }
  },

  sensing_daysSince2000(args, thread) {
    const now = Date.now();
    const base = Date.UTC(2000, 0, 1);
    return (now - base) / (1000 * 60 * 60 * 24);
  },

  sensing_username(args, thread) {
    return thread.runtime.username || "WormUser";
  },

  // ========== OPERATORS ==========
  operator_add(args, thread) {
    return Number(args.NUM1 || 0) + Number(args.NUM2 || 0);
  },

  operator_subtract(args, thread) {
    return Number(args.NUM1 || 0) - Number(args.NUM2 || 0);
  },

  operator_multiply(args, thread) {
    return Number(args.NUM1 || 0) * Number(args.NUM2 || 0);
  },

  operator_divide(args, thread) {
    return Number(args.NUM1 || 0) / Number(args.NUM2 || 1);
  },

  operator_random(args, thread) {
    const a = Number(args.FROM || 0);
    const b = Number(args.TO || 10);
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  operator_lt(args, thread) {
    return Number(args.NUM1 || 0) < Number(args.NUM2 || 0);
  },

  operator_equals(args, thread) {
    return String(args.NUM1) === String(args.NUM2);
  },

  operator_gt(args, thread) {
    return Number(args.NUM1 || 0) > Number(args.NUM2 || 0);
  },

  operator_and(args, thread) {
    return this._truthy(args.OPERAND1) && this._truthy(args.OPERAND2);
  },

  operator_or(args, thread) {
    return this._truthy(args.OPERAND1) || this._truthy(args.OPERAND2);
  },

  operator_not(args, thread) {
    return !this._truthy(args.OPERAND);
  },

  operator_join(args, thread) {
    return String(args.STRING1 || "") + String(args.STRING2 || "");
  },

  operator_letterOf(args, thread) {
    const s = String(args.STRING || "");
    const idx = Number(args.LETTER || 1) - 1;
    return s[idx] || "";
  },

  operator_lengthOf(args, thread) {
    return String(args.STRING || "").length;
  },

  operator_contains(args, thread) {
    return String(args.STRING1 || "").includes(String(args.STRING2 || ""));
  },

  operator_mod(args, thread) {
    return Number(args.NUM1 || 0) % Number(args.NUM2 || 1);
  },

  operator_round(args, thread) {
    return Math.round(Number(args.NUM || 0));
  },

  operator_mathOp(args, thread) {
    const op = args.OPERATOR;
    const n = Number(args.NUM || 0);
    switch (op) {
      case "abs": return Math.abs(n);
      case "floor": return Math.floor(n);
      case "ceiling": return Math.ceil(n);
      case "sqrt": return Math.sqrt(n);
      case "sin": return Math.sin((n * Math.PI) / 180);
      case "cos": return Math.cos((n * Math.PI) / 180);
      case "tan": return Math.tan((n * Math.PI) / 180);
      case "asin": return (Math.asin(n) * 180) / Math.PI;
      case "acos": return (Math.acos(n) * 180) / Math.PI;
      case "atan": return (Math.atan(n) * 180) / Math.PI;
      case "ln": return Math.log(n);
      case "log": return Math.log10(n);
      case "e ^": return Math.exp(n);
      case "10 ^": return Math.pow(10, n);
      default: return n;
    }
  },

  // ========== VARIABLES ==========
  data_setVariableTo(args, thread) {
    const name = args.VARIABLE;
    const value = args.VALUE;
    thread.target.vars = thread.target.vars || {};
    thread.target.vars[name] = value;
  },

  data_changeVariableBy(args, thread) {
    const name = args.VARIABLE;
    const amount = Number(args.VALUE || 0);
    thread.target.vars = thread.target.vars || {};
    thread.target.vars[name] = Number(thread.target.vars[name] || 0) + amount;
  },

  data_showVariable(args, thread) {
    // UI responsibility; mark as visible
    thread.runtime.ui.showVariable(args.VARIABLE);
  },

  data_hideVariable(args, thread) {
    thread.runtime.ui.hideVariable(args.VARIABLE);
  },

  // ========== LISTS ==========
  data_addToList(args, thread) {
    const listName = args.LIST;
    const item = args.ITEM;
    thread.target.lists = thread.target.lists || {};
    const list = (thread.target.lists[listName] =
      thread.target.lists[listName] || []);
    list.push(item);
  },

  data_deleteOfList(args, thread) {
    const listName = args.LIST;
    const index = Number(args.INDEX || 1) - 1;
    thread.target.lists = thread.target.lists || {};
    const list = thread.target.lists[listName];
    if (!list) return;
    list.splice(index, 1);
  },

  data_deleteAllOfList(args, thread) {
    const listName = args.LIST;
    thread.target.lists = thread.target.lists || {};
    thread.target.lists[listName] = [];
  },

  data_insertAtList(args, thread) {
    const listName = args.LIST;
    const index = Number(args.INDEX || 1) - 1;
    const item = args.ITEM;
    thread.target.lists = thread.target.lists || {};
    const list = (thread.target.lists[listName] =
      thread.target.lists[listName] || []);
    list.splice(index, 0, item);
  },

  data_replaceItemOfList(args, thread) {
    const listName = args.LIST;
    const index = Number(args.INDEX || 1) - 1;
    const item = args.ITEM;
    thread.target.lists = thread.target.lists || {};
    const list = thread.target.lists[listName];
    if (!list) return;
    list[index] = item;
  },

  data_itemOfList(args, thread) {
    const listName = args.LIST;
    const index = Number(args.INDEX || 1) - 1;
    thread.target.lists = thread.target.lists || {};
    const list = thread.target.lists[listName] || [];
    return list[index] || "";
  },

  data_lengthOfList(args, thread) {
    const listName = args.LIST;
    thread.target.lists = thread.target.lists || {};
    const list = thread.target.lists[listName] || [];
    return list.length;
  },

  data_listContainsItem(args, thread) {
    const listName = args.LIST;
    const item = args.ITEM;
    thread.target.lists = thread.target.lists || {};
    const list = thread.target.lists[listName] || [];
    return list.includes(item);
  },

  data_showList(args, thread) {
    thread.runtime.ui.showList(args.LIST);
  },

  data_hideList(args, thread) {
    thread.runtime.ui.hideList(args.LIST);
  },

  // ========== CUSTOM BLOCKS ==========
  procedures_definition(args, thread) {
    // Handled by compiler / VM setup; no runtime body.
  },

  procedures_call(args, thread) {
    // In a full VM, this would push a new call frame.
    thread.runtime.callProcedure(args.PROCEDURE, args.ARGS, thread);
  },

  procedures_return(args, thread) {
    thread.runtime.returnFromProcedure(thread);
  }
};
