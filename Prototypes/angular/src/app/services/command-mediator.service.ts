import { Injectable } from "@angular/core";
import { CommandHandler } from "./command-handler";
import { Command } from "./command";

export class CommandMediatorService {
  private readonly _handlers = new Map<typeof Command, CommandHandler<Command>>();

  constructor(handlers: CommandHandler<Command>[]) {
    for (const handler of handlers) {
      this.register(handler);
    }
  }

  register<T extends Command>(handler: CommandHandler<T>) {
    if (this._handlers.has(handler.handles)) {
      throw new Error(`Command ${handler.handles.name} already has a handler registered`);
    }

    this._handlers.set(handler.handles, handler);
  }
  async send<T extends Command>(command: T): Promise<void> {
    const handler = this._handlers.get(command.constructor as typeof Command);
    if (!handler) {
      throw new Error(`No handler registered for command ${command.constructor.name}`);
    }

    await handler.handle(command);
  }
}
