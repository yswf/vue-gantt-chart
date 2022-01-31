import { Task } from "@/types/task";
import { Resource } from "@/types/resource";
import { arrayRemove, uuidv4 } from "../utils";

import { DEFAULT_TIME_UNIT_WIDTH, TIME_PERIODS } from "../constants";
import moment from "moment";

export class GanttChartTimeline {
  constructor(data) {
    this.id = `gantt-timeline-${uuidv4()}`;
    this.timePeriod = data?.timePeriod || TIME_PERIODS.days;
    this.container = document.getElementById(this.id);

    this.TIME_UNIT_WIDTH = DEFAULT_TIME_UNIT_WIDTH;

    this.year = 2022;
    this.month = 1;
    this.day = 22;
    this.hour = 16;
    this.minute = 30;
  }

  get containerWidth() {
    return this.container.clientWidth;
  }

  get containerHeight() {
    return this.container.clientHeight;
  }

  get containerScrollLeft() {
    return this.container.scrollLeft;
  }

  set containerScrollLeft(scrollLeft) {
    this.container.scrollLeft = scrollLeft;
  }

  get containerScrollWidth() {
    return this.container.scrollWidth;
  }

  getCurrentDate() {
    return `${this.year}/${this.month}/${this.day} ${this.hour}:${this.minute}`;
  }

  getCurrentMoment() {
    return moment(this.getCurrentDate(), "YYYY/M/DD HH:mm");
  }

  changeTimePeriod(offset = 1) {
    const keys = Object.keys(TIME_PERIODS);
    const currentTimePeriodIndex = keys.indexOf(this.timePeriod.name);
    const newPeriod = TIME_PERIODS[keys[currentTimePeriodIndex + offset]];
    if (!newPeriod) return;

    this.setTimePeriod(newPeriod);
  }

  setTimePeriod(timePeriod) {
    if (!TIME_PERIODS[timePeriod?.name]) return;
    this.timePeriod = timePeriod;
  }

  getTimePeriod(period) {
    period = period || this.timePeriod;
    if (typeof period != "object") period = { name: period };

    const start = period.startDate;
    const end = period.endDate;

    const primaryUnit = period.primary.unit || "days";
    const secondaryUnit = period.secondary.unit || "hours";

    const secondaryUnitsPerPrimaryUnit = period.primary.secondaryPerUnit || 1;

    const primaryFormat = period.primary.format || "MM/YYYY DD";
    const secondaryFormat = period.secondary.format || "HH:mm";
    const secondaryStep = period.secondary.step || 1;

    const currentDate = this.getCurrentMoment();
    const startDate = moment(this.getCurrentMoment()).subtract(
      start.term,
      start.unit
    );
    const endDate = currentDate.add(end.term, end.unit);

    let source = GanttChartTimeline.getTimeRange(
      startDate,
      endDate,
      primaryUnit
    );

    const primary = [];
    let widthsSum = 0;
    for (const item of source) {
      const name = item.format(primaryFormat).toString();
      const width = this.TIME_UNIT_WIDTH * secondaryUnitsPerPrimaryUnit;

      primary.push({
        name,
        width,
        left: widthsSum,
      });

      widthsSum += width;
    }

    source = GanttChartTimeline.getTimeRange(
      startDate,
      endDate,
      secondaryUnit,
      { step: secondaryStep }
    );

    const secondary = [];
    for (const item of source) {
      const name = item.format(secondaryFormat).toString();

      secondary.push({
        name,
        width: this.TIME_UNIT_WIDTH,
      });
    }

    return {
      primary,
      secondary,
    };
  }

  static getTimeRange(startDate, endDate, type, options = {}) {
    if (!(startDate instanceof moment)) startDate = moment(startDate);
    if (!(endDate instanceof moment)) endDate = moment(endDate);

    const step = options.step || 1;
    const format = options.format || null;
    const stringify = options.stringify || false;
    const excludeLast = options.excludeLast || false;

    let diff = endDate.diff(startDate, type);
    if (diff < 0) return [];

    if (!excludeLast) diff += 1;

    let range = [];
    for (let i = 0; i < diff; i += step) {
      let date = moment(startDate).add(i, type);
      if (format) date = date.format(format);
      if (stringify) date = date.toString();
      range.push(date);
    }

    return range;
  }
}

export class GanttChart {
  constructor(data) {
    if (data == null || typeof data != "object") data = {};

    const defaultSettings = {
      verbose: false,
      snapToGrid: false,
    };

    this.tasks = data.tasks || [];
    this.resources = data.resources || [];
    this.settings = Object.assign(defaultSettings, data.settings);

    this.timeline = new GanttChartTimeline(data.timeline);
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
}
