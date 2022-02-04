import { Task } from "./task";
import { Resource } from "./resource";
import { GanttChartTimeline } from "./gantt-chart-timeline";

export class GanttChart {
  readonly id: string;

  tasks: Task[];
  resources: Resource[];
  settings: GanttChartSettings;
  timeline: GanttChartTimeline;

  createTask(task: Task): void;
  private addTask(task: Task): Task;
  removeTask(task: Task): void;

  createResource(resource: Resource): void;
  private addResource(resource: Resource): Resource;
  removeResource(resource: Resource): void;

  setSettings(settings: GanttChartSettings): void;
  getSetting(key: string, def: undefined): GanttChartSettings;

  toJSON(): object;
  static fromJSON(json: object): GanttChart;
}

export class GanttChartSettings {
  verbose: boolean;
  snapToGrid: boolean;
}
