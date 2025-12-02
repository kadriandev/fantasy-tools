export class YahooApiError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "YahooApiError";
    this.stack = undefined;

    // Set the prototype explicitly.
    // Object.setPrototypeOf(this, YahooApiError.prototype);
  }
}
