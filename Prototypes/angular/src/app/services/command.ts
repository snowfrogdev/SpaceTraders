export abstract class Command {
  constructor(public scheduledTime = new Date()) {}
}
