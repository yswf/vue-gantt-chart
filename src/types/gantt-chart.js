import { Task } from "@/types/task";
import { Resource } from "@/types/resource";
import { arrayRemove } from "../utils";

export class GanttChart {
  constructor(data) {
    this.tasks = data.tasks;
    this.resources = data.resources;
    this.settings = data.settings || {};
    this.verbose = data.verbose || false;
  }

  addTask(task) {
    if (!(task instanceof Task)) {
      if (this.verbose) {
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
      if (this.verbose) {
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
}
