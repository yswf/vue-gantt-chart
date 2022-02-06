export function arrayRemove(arr, item) {
  const clone = arr.slice();
  const index = clone.indexOf(item);
  if (index > -1) {
    clone.splice(index, 1);
  }

  return clone;
}

export function roundToNearest(value, factor) {
  return Math.round(value / factor) * factor;
}

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
