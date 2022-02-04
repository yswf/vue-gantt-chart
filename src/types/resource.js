import { uuidv4 } from "../utils";

export class Resource {
  constructor(data) {
    const clone = Object.assign({}, data);

    this.chart = clone.chart;

    this.id = uuidv4();
    this.name = clone.name;
    this.style = clone.style || {};
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      style: this.style,
    };
  }

  static fromJSON(json) {
    return new Resource(json);
  }
}
