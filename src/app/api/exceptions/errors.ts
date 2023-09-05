export class ValidationError extends Error {
  msg: string;
  data: any;

  constructor(msg: string, data: any) {
    super(msg);
    this.msg = msg;
    this.data = data;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
