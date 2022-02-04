import { TASK_INTERACTIONS, SIDES } from "../constants";
import { GanttChart } from "./gantt-chart";
import { Resource } from "./resource";

export class Task {
  chart: GanttChart;

  readonly id: string;
  name: string;

  start: Date;
  end: Date;
  resource: Resource;

  x: number;
  y: number;

  style: object;

  interaction: TASK_INTERACTIONS;
  methodsRefs: object;
  eventsMeta: object;

  get duration(): number;
  get width(): number;
  get left(): number;
  get top(): number;

  interactionIs(interaction: TASK_INTERACTIONS): boolean;
  setInteraction(interaction: TASK_INTERACTIONS): void;

  setStart(start: Date): void;
  setEnd(end: Date): void;
  setY(y: number): void;

  resizeStart(side: SIDES, event: Event): void;
  resize(event: Event): void;
  resizeEnd(): void;

  moveStart(event: Event): void;
  move(event: Event): void;
  moveEnd(): void;

  say(args: any[]): void;

  toJSON(): object;
  static fromJSON(json: object): Task;
}
