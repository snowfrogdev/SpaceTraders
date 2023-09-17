export abstract class Command {
  constructor(public readonly scheduledTime = new Date()) {}
}
