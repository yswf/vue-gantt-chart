export class TasksGroup {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.tasks = data.tasks;
    this.verbose = data.verbose || false;
    this.methodsReferences = {};
    this.eventsMeta = {};
  }
}
