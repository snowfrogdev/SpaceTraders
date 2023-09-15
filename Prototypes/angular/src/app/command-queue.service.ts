import { Injectable } from "@angular/core";
import { DualTokenBucket } from "./token-bucket";
import { CommandMediatorService } from "./command-mediator.service";
import { Subscription, interval } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommandQueueService {
  private readonly _queue: Command[] = [];
  private commandExecutionSubscription?: Subscription;

  get size(): number {
    return this._queue.length;
  }

  constructor(private readonly _tokenBucket: DualTokenBucket, private readonly _mediator: CommandMediatorService) {}

  async enqueueCommand<T extends Command>(command: T): Promise<boolean> {
    if (this.size >= 180) {
      return false;
    }

    this._queue.push(command);
    this._queue.sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime());
    return true;
  }

  private peek(): Command | undefined {
    return this._queue.at(-1);
  }

  startExecutingCommands(): void {
    if (this.commandExecutionSubscription) {
      return; // Already started
    }

    this.commandExecutionSubscription = interval(15).subscribe(() => {
      if (this._tokenBucket.consume(1)) {
        let command = this.peek();
        if (command && command.scheduledTime.getTime() <= Date.now()) {
          command = this._queue.pop()!;
          this._mediator.send(command);
        }
      }
    });
  }

  stopExecutingCommands(): void {
    if (this.commandExecutionSubscription) {
      this.commandExecutionSubscription.unsubscribe();
      this.commandExecutionSubscription = undefined;
    }
  }
}

export abstract class Command {
  scheduledTime = new Date();
}
