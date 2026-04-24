import { WebhookWhatsapp } from "@/domain/repositories/IWhatsappAdapter";
import { WebhookDispatcher } from "@/infrastructure/repositories/WebhookDispatcher";

export class OnMessageReceivedHandler {
  constructor(private webhookDispatcher: WebhookDispatcher) {}

  async handle(event: {
    sessionId: string;
    tenantId: string;
    data: WebhookWhatsapp | null;
  }) {
    if (!event.data) return;

    const payload = {
      ...event.data,
      tenant_id: event.tenantId,
      session_id: event.sessionId,
    };

    await this.webhookDispatcher.dispatch("messages.upsert", payload);
  }
}
