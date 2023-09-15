import { Injectable } from "@angular/core";
import { Command } from "./command-queue.service";

@Injectable({
  providedIn: "root",
})
export class CommandMediatorService {
  private readonly _handlers = new Map<typeof Command, CommandHandler<Command>>();

  register<T extends Command>(commandType: new () => T, handler: CommandHandler<T>) {
    if (this._handlers.has(commandType)) {
      throw new Error(`Command ${commandType.name} already has a handler registered`);
    }

    this._handlers.set(commandType, handler);
  }
  async send<T extends Command>(command: T): Promise<void> {
    const handler = this._handlers.get(command.constructor as typeof Command);
    if (!handler) {
      throw new Error(`No handler registered for command ${command.constructor.name}`);
    }

    await handler.handle(command);
  }
}

export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}
