import { SIDES, TASK_INTERACTIONS, DAY_WIDTH_PX } from "@/constants";

export class Task {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.startDay = Number(data.startDay);
    this.endDay = Number(data.endDay);
    this.style = data.style || {};

    this.verbose = data.verbose || false;

    //? interaction property is used to determine
    //? if there is any interaction with the task
    //? and what type of interaction is it
    //? Note: at the end of interaction,
    //? it must be set to TASK_INTERACTIONS.none
    //? otherwise any other interactions will be blocked
    this.interaction = TASK_INTERACTIONS.none;

    //! remove hardcoded date
    this.daysInJanuary = 31;
    if (
      this.startDay < 1 ||
      this.endDay > this.daysInJanuary ||
      this.startDay > this.endDay
    ) {
      throw new Error(
        `Task ${this.id} start date is out of bound of the month`
      );
    }

    this.methodsReferences = {};
    this.eventsMeta = {};
  }

  get duration() {
    return this.endDay - this.startDay;
  }

  get width() {
    return this.duration * DAY_WIDTH_PX;
  }

  get left() {
    return this.startDay * DAY_WIDTH_PX;
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

  setStartDay(day) {
    if (day < 1 || day > this.endDay) {
      if (this.verbose) {
        console.warn(
          this.say(
            `start day ${day} is out of bound\n`,
            `start day must be between 1 and ${this.endDay}`
          )
        );
      }

      return;
    }

    this.startDay = Number(day);
  }

  setEndDay(day) {
    if (day < this.startDay || day > this.daysInJanuary) {
      if (this.verbose) {
        console.warn(this.say(`end day ${day} is out of bound`));
      }

      return;
    }

    this.endDay = Number(day);
  }

  resizeStart(side, event, options) {
    const set = this.setInteraction(TASK_INTERACTIONS.resize);
    if (!set) return;

    const snapToDays = options?.snapToDays || false;

    this.eventsMeta["resizeStart"] = {
      side,
      snapToDays,
      startX: event.clientX,
      startDay: this.startDay,
      endDay: this.endDay,
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

    const { startX, startDay, endDay, side, snapToDays } =
      this.eventsMeta["resizeStart"];

    let delta = (event.clientX - startX) / DAY_WIDTH_PX;
    if (snapToDays && Math.abs(delta) < 1) return;
    else if (snapToDays) delta = parseInt(delta);

    if (side === SIDES.left) {
      this.setStartDay(startDay + delta);
    } else if (side === SIDES.right) {
      this.setEndDay(endDay + delta);
    }
  }

  resizeEnd() {
    if (!this.interactionIs(TASK_INTERACTIONS.resize)) return;

    const { snapToDays } = this.eventsMeta["resizeStart"];
    if (!snapToDays) {
      this.setStartDay(Math.round(this.startDay));
      this.setEndDay(Math.round(this.endDay));
    }

    window.removeEventListener("mousemove", this.methodsReferences["resize"]);
    delete this.eventsMeta["resizeStart"];
    this.setInteraction(TASK_INTERACTIONS.none);
  }

  moveStart(event, options) {
    this.setInteraction(TASK_INTERACTIONS.move);

    const snapToDays = options?.snapToDays || false;

    this.eventsMeta["moveStart"] = {
      snapToDays,
      startX: event.clientX,
      startDay: this.startDay,
      endDay: this.endDay,
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

    const { startX, startDay, endDay, snapToDays } =
      this.eventsMeta["moveStart"];

    let delta = (event.clientX - startX) / DAY_WIDTH_PX;
    if (snapToDays && Math.abs(delta) < 1) return;
    else if (snapToDays) delta = parseInt(delta);

    this.setStartDay(startDay + delta);
    this.setEndDay(endDay + delta);
  }

  moveEnd() {
    if (!this.interactionIs(TASK_INTERACTIONS.move)) return;

    const { snapToDays } = this.eventsMeta["moveStart"];
    if (!snapToDays) {
      this.setStartDay(Math.round(this.startDay));
      this.setEndDay(Math.round(this.endDay));
    }

    window.removeEventListener("mousemove", this.methodsReferences["move"]);
    delete this.eventsMeta["moveStart"];
    this.setInteraction(TASK_INTERACTIONS.none);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      startDay: this.startDay,
      endDay: this.endDay,
    };
  }

  say(...args) {
    return `Task ${this.id} says: ${args.join(" ")}`;
  }

  static fromJSON(data) {
    return new Task(data);
  }
}
