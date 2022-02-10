import { uuidv4 } from "../utils";

export class Resource {
  constructor(data) {
    const clone = Object.assign({}, data);

    this.chart = clone.chart;

    this.id = `resource-${uuidv4()}`;
    this.name = clone.name;

    this.height = 1;

    this.classes_ = new Set(clone.classes || []);
  }

  get classes() {
    return Array.from(this.classes_);
  }

  addClass(className) {
    this.classes_.add(className);
  }

  removeClass(className) {
    this.classes_.delete(className);
  }

  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;
  }

  getHeightPx() {
    return this.height * this.chart.timeline.TASK_HEIGHT;
  }

  getTop() {
    const selfIndex = this.getIndex();
    let top = 0;

    for (const resource of this.chart.resources) {
      if (resource.getIndex() >= selfIndex) break;
      top += resource.getHeight();
    }

    return top;
  }

  getIndex() {
    const index = this.chart.resources.indexOf(this);
    return index < 0 ? 0 : index;
  }

  getTasks() {
    return this.chart.tasks.filter((task) => task.resource?.id === this.id);
  }

  resolveCollisions() {
    const tasks = this.getTasks();
    const collisionsMap = {};

    tasks.forEach((task) => {
      tasks.forEach((task2) => {
        if (task === task2) return;

        if (task.collidesWith(task2)) {
          collisionsMap[task.id] = task;
          collisionsMap[task2.id] = task2;
        }
      });
    });

    const collisions = Object.values(collisionsMap);
    this.setHeight(Math.max(1, collisions.length));

    collisions.sort((a, b) => b.getDuration() - a.getDuration());
    for (let i = 0; i < collisions.length; i++) {
      collisions[i].verticalOrder = i;
    }

    for (const task of tasks) {
      if (!collisionsMap[task.id]) task.verticalOrder = 0;
    }
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
