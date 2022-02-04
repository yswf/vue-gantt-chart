//? source: https://github.com/djsauble/date-round/

import moment from "moment";

export function floor(start, boundary) {
  // Account for the default case
  if (!boundary) {
    boundary = "day";
  }

  // Are we rounding to the day?
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  if (boundary === "day") {
    return start;
  }

  // Are we rounding to the week?
  if (boundary === "week") {
    start.setDate(start.getDate() - start.getDay());

    return start;
  }

  // Are we rounding to the month?
  start.setDate(1);
  if (boundary === "month") {
    return start;
  }

  // Are we rounding to the year?
  start.setMonth(0);
  if (boundary === "year") {
    return start;
  }

  return undefined;
}

export function ceil(end, boundary) {
  // Account for the default case
  if (!boundary) {
    boundary = "day";
  }

  // Are we rounding to the day?
  end.setHours(0);
  end.setMinutes(0);
  end.setSeconds(0);
  end.setMilliseconds(0);
  if (boundary === "day") {
    end.setDate(end.getDate() + 1);

    return end;
  }

  // Are we rounding to the week?
  if (boundary === "week") {
    end.setDate(end.getDate() + (7 - end.getDay()));

    return end;
  }

  // Are we rounding to the month?
  end.setDate(1);
  if (boundary === "month") {
    end.setMonth(end.getMonth() + 1);

    return end;
  }

  // Are we rounding to the year?
  end.setMonth(0);
  if (boundary === "year") {
    end.setYear(1900 + end.getYear() + 1);

    return end;
  }

  return undefined;
}

export function round(date, boundary) {
  var start = date,
    end = date,
    closest = function (a, b) {
      if (date.getTime() - a.getTime() <= b.getTime() - date.getTime()) {
        return a;
      } else {
        return b;
      }
    };

  // Account for the default case
  if (!boundary) {
    boundary = "day";
  }

  // Are we rounding to the nearest day?
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  end.setHours(0);
  end.setMinutes(0);
  end.setSeconds(0);
  end.setMilliseconds(0);
  if (boundary === "day") {
    end.setDate(end.getDate() + 1);

    return closest(start, end);
  }

  // Are we rounding to the nearest week?
  if (boundary === "week") {
    start.setDate(start.getDate() - start.getDay());
    end.setDate(end.getDate() + (7 - end.getDay()));

    return closest(start, end);
  }

  // Are we rounding to the nearest month?
  start.setDate(1);
  end.setDate(1);
  if (boundary === "month") {
    end.setMonth(end.getMonth() + 1);

    return closest(start, end);
  }

  // Are we rounding to the nearest year?
  start.setMonth(0);
  end.setMonth(0);
  if (boundary === "year") {
    end.setYear(1900 + end.getYear() + 1);

    return closest(start, end);
  }

  return undefined;
}

export function momentFloor(momentDate, boundary) {
  return moment(floor(momentDate.toDate(), boundary));
}

export function momentCeil(momentDate, boundary) {
  return moment(ceil(momentDate.toDate(), boundary));
}

export function momentRound(momentDate, boundary) {
  return moment(round(momentDate.toDate(), boundary));
}
