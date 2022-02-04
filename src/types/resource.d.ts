export class Resource {
  readonly id: string;
  name: string;
  style: object;

  toJSON(): object;
  static fromJSON(json: object): Resource;
}
