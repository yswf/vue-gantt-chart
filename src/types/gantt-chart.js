import { Task } from "@/types/task";
import { Resource } from "@/types/resource";
import { arrayRemove, uuidv4 } from "../utils";
import { GanttChartTimeline } from "./gantt-chart-timeline";

export class GanttChart {
  constructor(data) {
    if (data == null || typeof data != "object") data = {};

    const defaultSettings = {
      verbose: false,
      snapToGrid: false,
    };

    this.id = `gantt-chart-${uuidv4()}`;
    this.tasks = data.tasks || [];
    this.resources = data.resources || [];
    this.settings = Object.assign({}, defaultSettings, data.settings);

    this.timeline = new GanttChartTimeline(data.timeline, this);
  }

  addTask(task) {
    if (!(task instanceof Task)) {
      if (this.settings.verbose) {
        console.warn("Task must be an instance of Task class");
      }
      return;
    }
    this.tasks.push(task);
  }

  removeTask(task) {
    this.tasks = arrayRemove(this.tasks, task);
  }

  addResource(resource) {
    if (!(resource instanceof Resource)) {
      if (this.settings.verbose) {
        console.warn("Resource must be an instance of Resource class");
      }
      return;
    }
    this.resources.push(resource);
  }

  removeResource(resource) {
    this.resources = arrayRemove(this.resources, resource);
  }

  setSettings(settings) {
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
        this.settings[key] = settings[key];
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      tasks: this.tasks.map((t) => t.toJSON()),
      resources: this.resources.map((r) => r.toJSON()),
      settings: this.settings,
      timeline: this.timeline.toJSON(),
    };
  }

  static fromJSON(data) {
    return new GanttChart(data);
  }
}
