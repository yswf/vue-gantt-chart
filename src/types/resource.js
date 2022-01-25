import { uuidv4 } from "../utils";

export class Resource {
  constructor(data) {
    this.id = uuidv4();
    this.name = data.name;
    this.style = data.style || {};
  }
}
