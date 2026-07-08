export class SlotTakenError extends Error {
  constructor() {
    super("That time slot is no longer available.");
    this.name = "SlotTakenError";
  }
}
