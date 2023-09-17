import { Command } from "./command";

export interface CommandHandler<T extends Command> {
  handles: new (...args: any[]) => T;
  handle(command: T): Promise<void>;
}
