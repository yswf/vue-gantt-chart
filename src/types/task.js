import {
  SIDES,
  TASK_INTERACTIONS,
  DAY_WIDTH_PX,
  RESOURCE_HEIGHT_PX,
} from "@/constants";
import moment from "moment";
import { uuidv4 } from "../utils";

export class Task {
  constructor(data) {
    this.id = uuidv4();
    this.name = data.name;

    this.start = Number(data.start) || 0;
    this.end = Number(data.end) || 1;

    this.x = this.start * DAY_WIDTH_PX;
    this.y = (Number(data.y) || 0) * RESOURCE_HEIGHT_PX;

    this.style = data.style || {};

    //? interaction property is used to determine
    //? if there is any interaction with the task
    //? and what type of interaction is it
    //? Note: at the end of interaction,
    //? it must be set to TASK_INTERACTIONS.none
    //? otherwise any other interactions will be blocked
    this.interaction = TASK_INTERACTIONS.none;

    this.methodsReferences = {};
    this.eventsMeta = {};

    this.verbose = data.verbose || false;
  }

  get duration() {
    return this.end - this.start;
  }

  get width() {
    return this.duration * DAY_WIDTH_PX;
  }

  get left() {
    return this.start * DAY_WIDTH_PX;
  }

  get top() {
    return this.y * RESOURCE_HEIGHT_PX;
  }

  setVerbose(verbose) {
    this.verbose = Boolean(verbose);
  }

  interactionIs(interaction) {
    return this.interaction === interaction;
  }

  setInteraction(interaction) {
    if (
      this.interaction != TASK_INTERACTIONS.none &&
      interaction != TASK_INTERACTIONS.none
    ) {
      if (this.verbose) {
        console.warn(
          this.say(
            `can't set interaction to ${interaction} because ${this.interaction} is already set`
          )
        );
      }
      return false;
    }

    this.interaction = interaction;
    return true;
  }

  setStart(day) {
    if (day < 0 || day > this.end) {
      if (this.verbose) {
        console.warn(
          this.say(
            `start day ${day} is out of bound\n`,
            `start day must be between 1 and ${this.end}`
          )
        );
      }

      return;
    }

    this.start = Number(day);
  }

  setEnd(day) {
    // moment current month length
    if (day < this.start || day > moment().daysInMonth()) {
      if (this.verbose) {
        console.warn(this.say(`end day ${day} is out of bound`));
      }

      return;
    }

    this.end = Number(day);
  }

  setY(y) {
    this.y = Number(y);
  }

  resizeStart(side, event, options) {
    const set = this.setInteraction(TASK_INTERACTIONS.resize);
    if (!set) return;

    const snapTasksToGrid = options?.snapTasksToGrid || false;

    this.eventsMeta["resizeStart"] = {
      side,
      snapTasksToGrid,
      startX: event.clientX,
      start: this.start,
      end: this.end,
    };

    this.methodsReferences["resize"] = this.resize.bind(this);

    window.addEventListener("mousemove", this.methodsReferences["resize"]);
    window.addEventListener("mouseup", this.resizeEnd.bind(this), {
      once: true,
    });
  }

  resize(event) {
    if (
      !this.interactionIs(TASK_INTERACTIONS.resize) ||
      !this.eventsMeta["resizeStart"]
    )
      return;

    const { startX, start, end, side, snapTasksToGrid } =
      this.eventsMeta["resizeStart"];

    let delta = (event.clientX - startX) / DAY_WIDTH_PX;
    if (snapTasksToGrid && Math.abs(delta) < 1) return;
    else if (snapTasksToGrid) delta = parseInt(delta);

    if (side === SIDES.left) {
      this.setStart(start + delta);
    } else if (side === SIDES.right) {
      this.setEnd(end + delta);
    }
  }

  resizeEnd() {
    if (!this.interactionIs(TASK_INTERACTIONS.resize)) return;

    const { snapTasksToGrid } = this.eventsMeta["resizeStart"];
    if (!snapTasksToGrid) {
      this.setStart(Math.round(this.start));
      this.setEnd(Math.round(this.end));
    }

    window.removeEventListener("mousemove", this.methodsReferences["resize"]);
    delete this.eventsMeta["resizeStart"];
    this.setInteraction(TASK_INTERACTIONS.none);
  }

  moveStart(event, options) {
    this.setInteraction(TASK_INTERACTIONS.move);

    const snapTasksToGrid = options?.snapTasksToGrid || false;

    this.eventsMeta["moveStart"] = {
      snapTasksToGrid,
      startX: event.clientX,
      startY: event.clientY,
      oldStart: this.start,
      oldEnd: this.end,
      oldY: this.y,
    };

    this.methodsReferences["move"] = this.move.bind(this);

    window.addEventListener("mousemove", this.methodsReferences["move"]);
    window.addEventListener("mouseup", this.moveEnd.bind(this), {
      once: true,
    });
  }

  move(event) {
    if (
      !this.interactionIs(TASK_INTERACTIONS.move) ||
      !this.eventsMeta["moveStart"]
    )
      return;

    const { startX, startY, oldStart, oldEnd, oldY, snapTasksToGrid } =
      this.eventsMeta["moveStart"];

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    let days = deltaX / DAY_WIDTH_PX;
    let y = deltaY / RESOURCE_HEIGHT_PX;

    if (snapTasksToGrid) {
      const daysMovement = Math.abs(days) >= 1;
      const yMovement = Math.abs(y) >= 1;

      days = daysMovement ? parseInt(days) : 0;
      y = yMovement ? parseInt(y) : 0;
    }

    this.setStart(oldStart + days);
    this.setEnd(oldEnd + days);
    this.setY(oldY + y);
  }

  moveEnd() {
    if (!this.interactionIs(TASK_INTERACTIONS.move)) return;

    const { snapTasksToGrid } = this.eventsMeta["moveStart"];
    if (!snapTasksToGrid) {
      this.setStart(Math.round(this.start));
      this.setEnd(Math.round(this.end));
      this.setY(Math.round(this.y));
    }

    window.removeEventListener("mousemove", this.methodsReferences["move"]);
    delete this.eventsMeta["moveStart"];
    this.setInteraction(TASK_INTERACTIONS.none);
  }

  say(...args) {
    return `Task ${this.id} says: ${args.join(" ")}`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      start: this.start,
      end: this.end,
    };
  }

  static fromJSON(data) {
    return new Task(data);
  }
}
