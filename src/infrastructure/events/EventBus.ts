export class EventBus<TEvents extends Record<string, unknown>> {
  private listeners: {
    [K in keyof TEvents]?: ((payload: TEvents[K]) => void | Promise<void>)[];
  } = {};

  on<K extends keyof TEvents>(
    event: K,
    handler: (payload: TEvents[K]) => void | Promise<void>,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(handler);
  }

  async emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {
    const handlers = this.listeners[event] || [];

    for (const handler of handlers) {
      await handler(payload);
    }
  }
}
