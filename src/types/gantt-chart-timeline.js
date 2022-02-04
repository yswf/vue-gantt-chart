import { DEFAULT_TIME_UNIT_WIDTH, TIME_PERIODS } from "../constants";
import { uuidv4 } from "@/utils";
import moment from "moment";

export class GanttChartTimeline {
  constructor(data) {
    this.chart = data?.chart;

    this.id = `gantt-timeline-${uuidv4()}`;
    this.timePeriod = data?.timePeriod || TIME_PERIODS.days;

    this.TIME_UNIT_WIDTH = DEFAULT_TIME_UNIT_WIDTH;

    this.year = 2022;
    this.month = 1;
    this.day = 15;
    this.hour = 12;
    this.minute = 0;
  }

  get container() {
    return document.getElementById(this.id) || {};
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

  get containerScrollbarThumbWidth() {
    const scrollbarArrowWidth = 20;
    const viewableRatio = window.innerWidth / this.containerScrollWidth;
    const scrollBarArea = window.innerWidth - scrollbarArrowWidth * 2;

    return scrollBarArea * viewableRatio;
  }

  getStartDate() {
    if (!this.timePeriod?.startDate) {
      if (this.chart.settings.verbose) {
        console.warn(
          `GanttChartTimeline: startDate is not defined on a time period: ${this.timePeriod}`
        );
      }
      return this.getCurrentMoment();
    }

    return this.getCurrentMoment().subtract(
      this.timePeriod.startDate.term,
      this.timePeriod.startDate.unit
    );
  }

  getEndDate() {
    if (!this.timePeriod?.endDate) {
      if (this.chart.settings.verbose) {
        console.warn(
          `GanttChartTimeline: endDate is not defined on a time period: ${this.timePeriod}`
        );
      }
      return this.getCurrentMoment();
    }

    return this.getCurrentMoment().add(
      this.timePeriod.endDate.term,
      this.timePeriod.endDate.unit
    );
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
    if (typeof timePeriod != "object") timePeriod = TIME_PERIODS[timePeriod];
    if (!TIME_PERIODS[timePeriod?.name]) return;

    this.timePeriod = timePeriod;
  }

  getTimePeriod(period) {
    period = period || this.timePeriod;
    if (typeof period != "object") period = { name: period };

    const primaryUnit = period.primary.unit || "days";
    const secondaryUnit = period.secondary.unit || "hours";

    const secondaryUnitsPerPrimaryUnit = period.primary.secondaryPerUnit || 1;

    const primaryFormat = period.primary.format || "MM/YYYY DD";
    const secondaryFormat = period.secondary.format || "HH:mm";
    const secondaryStep = period.secondary.step || 1;
    const primaryExcludeLast = period.primary.excludeLast || false;
    const secondaryExcludeLast = period.secondary.excludeLast || false;

    const startDate = this.getStartDate();
    const endDate = this.getEndDate();

    let source = GanttChartTimeline.getTimeRange(
      startDate,
      endDate,
      primaryUnit,
      { excludeLast: primaryExcludeLast }
    );

    const primary = [];
    const primaryUnitWidth =
      this.TIME_UNIT_WIDTH * secondaryUnitsPerPrimaryUnit;
    let widthsSum = 0;
    for (const item of source) {
      const name = item.format(primaryFormat).toString();
      const width = primaryUnitWidth;

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
      { step: secondaryStep, excludeLast: secondaryExcludeLast }
    );

    const secondary = [];
    for (const item of source) {
      const name = item.format(secondaryFormat).toString();

      secondary.push({
        name,
        width: this.TIME_UNIT_WIDTH,
      });
    }

    const result = {
      primary,
      secondary,
      totalWidth: widthsSum,
      primaryUnitWidth,
    };

    //! temporary solution
    //? what is this?
    //? when we set scrollLeft property of an element,
    //? it seems to be setting the width somehow relative
    //? to the scrollWidth property of the element.
    //? As scrollWidth property is read-only, we need to wait
    //? for DOM to update, and re-calculate the scrollWidth,
    //? then we can properly set the scrollLeft.
    setTimeout(() => {
      if (!this.container) return;
      this.containerScrollLeft =
        this.getPositionFromDate(this.getCurrentMoment()) -
        this.containerScrollbarThumbWidth;
    }, 25);

    return result;
  }

  pixelsPerSecond() {
    return (
      this.getEndDate().diff(this.getStartDate(), "seconds") /
      this.containerScrollWidth
    );
  }

  getDateFromPosition(positionEvent) {
    const delta =
      positionEvent.clientX -
      this.container.getBoundingClientRect().left +
      this.containerScrollLeft;

    return this.getStartDate().add(delta * this.pixelsPerSecond(), "seconds");
  }

  getPositionFromDate(date) {
    return date.diff(this.getStartDate(), "seconds") / this.pixelsPerSecond();
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

  toJSON() {
    return {
      timePeriod: this.timePeriod,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
    };
  }
}
