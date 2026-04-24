import { ofetch } from "ofetch";

export class WebhookDispatcher {
  constructor(private url?: string) {}

  async dispatch(event: string, data: object) {
    try {
      if (!this.url) return;

      await ofetch(this.url, {
        method: "POST",
        body: data,
      });
    } catch (err) {
      console.error("Erro ao enviar webhook:", err);
    }
  }
}
