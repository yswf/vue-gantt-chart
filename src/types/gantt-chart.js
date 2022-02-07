/// <reference path="./gantt-chart.d.ts" />

import { Task } from "./task";
import { Resource } from "./resource";
import { arrayRemove, uuidv4 } from "../utils";
import { GanttChartTimeline } from "./gantt-chart-timeline";

export class GanttChart {
  constructor(data) {
    const clone = Object.assign({}, data);

    const defaultSettings = {
      verbose: false,
      snapToGrid: false,
    };

    this.id = `gantt-chart-${uuidv4()}`;
    this.tasks = clone.tasks || [];
    this.resources = clone.resources || [];
    this.settings = Object.assign({}, defaultSettings, clone.settings);

    this.timeline = new GanttChartTimeline({ chart: this });
  }

  /* -------------------------------------------------------------------------- */
  /*                                tasks methods                               */
  /* -------------------------------------------------------------------------- */

  createTask(data) {
    const task = new Task(Object.assign({}, data, { chart: this }));
    this.addTask(task);
    return task;
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

  /* -------------------------------------------------------------------------- */
  /*                              resources methods                             */
  /* -------------------------------------------------------------------------- */

  createResource(data) {
    const resource = new Resource(Object.assign({}, data, { chart: this }));
    this.addResource(resource);
    return resource;
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

  /* -------------------------------------------------------------------------- */
  /*                              settings methods                              */
  /* -------------------------------------------------------------------------- */

  setSettings(settings) {
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
        this.settings[key] = settings[key];
      }
    }
  }

  getSetting(key, def) {
    if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
      return this.settings[key];
    }
    return def;
  }

  /* -------------------------------------------------------------------------- */
  /*                                misc methods                                */
  /* -------------------------------------------------------------------------- */

  toJSON() {
    return {
      id: this.id,
      tasks: this.tasks.map((t) => t.toJSON()),
      resources: this.resources.map((r) => r.toJSON()),
      settings: this.settings,
    };
  }

  static fromJSON(json) {
    return new GanttChart(json);
  }
}
