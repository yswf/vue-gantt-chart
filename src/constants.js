export const SIDES = {
  left: 0,
  right: 1,
};

export const TASK_INTERACTIONS = {
  none: 0,
  move: 1,
  resize: 2,
  regroup: 3,
};

export const DEFAULT_TIME_UNIT_WIDTH = 40;
export const RESOURCE_HEIGHT_PX = 40;
export const DEFAULT_DATE_FORMAT = "YYYY-MM-DD HH:mm";

export const TIME_PERIODS = {
  hours: {
    name: "hours",
    roundTo: "day",
    startDate: {
      unit: "hours",
      term: 2,
    },
    endDate: {
      unit: "hours",
      term: 2,
    },
    primary: {
      unit: "hours",
      format: "HH:mm MMM DD YYYY",
      secondaryPerUnit: 6,
    },
    secondary: {
      unit: "minutes",
      format: "HH:mm",
      step: 10,
    },
  },
  days: {
    name: "days",
    roundTo: "day",
    startDate: {
      unit: "days",
      term: 5,
    },
    endDate: {
      unit: "days",
      term: 5,
    },
    primary: {
      unit: "days",
      format: "ddd DD MMM YYYY",
      secondaryPerUnit: 4,
    },
    secondary: {
      unit: "hours",
      format: "HH:mm",
      step: 6,
    },
  },
  weeks: {
    name: "weeks",
    roundTo: "week",
    startDate: {
      unit: "months",
      term: 1,
    },
    endDate: {
      unit: "months",
      term: 1,
    },
    primary: {
      unit: "weeks",
      format: "ddd DD MMM YYYY",
      secondaryPerUnit: 7,
    },
    secondary: {
      unit: "days",
      format: "DD",
    },
  },
  months: {
    name: "months",
    roundTo: "year",
    startDate: {
      unit: "years",
      term: 1,
    },
    endDate: {
      unit: "years",
      term: 1,
    },
    primary: {
      unit: "months",
      format: "MMM YYYY",
      secondaryPerUnit: 4,
    },
    secondary: {
      unit: "weeks",
      format: "w",
    },
  },
  quarters: {
    name: "quarters",
    roundTo: "year",
    startDate: {
      unit: "years",
      term: 2,
    },
    endDate: {
      unit: "years",
      term: 2,
    },
    primary: {
      unit: "quarters",
      format: "[Q]Q YYYY",
      secondaryPerUnit: 3,
    },
    secondary: {
      unit: "months",
      format: "MMM",
    },
  },
  years: {
    name: "years",
    roundTo: "year",
    startDate: {
      unit: "years",
      term: 5,
    },
    endDate: {
      unit: "years",
      term: 5,
    },
    primary: {
      unit: "years",
      format: "YYYY",
      secondaryPerUnit: 4,
    },
    secondary: {
      unit: "quarters",
      format: "[Q]Q",
    },
  },
};
