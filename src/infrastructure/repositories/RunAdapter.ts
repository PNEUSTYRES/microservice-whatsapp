import { IWhatsappAdapter } from "@/domain/repositories/IWhatsappAdapter";
import { BaileysRepository } from "./Baileys/BaileysRepository";
import { BaileysConnector } from "./Baileys/BaileysConnector";
import { SessionManager } from "./SessionManager";
import { WebhookDispatcher } from "./WebhookDispatcher";

export class RunAdapter implements IWhatsappAdapter {
  private connector = new BaileysConnector(
    new WebhookDispatcher(
      "https://webhook.site/d290fe5e-cea1-4ad3-a600-d677bc1e4370",
    ),
  ); // WHAPI | Evolution | OFICIAL
  private sessions = new SessionManager();
  private repository = new BaileysRepository(this.connector, this.sessions);

  private async ensureSession(sessionId: string) {
    let sock = this.sessions.get(sessionId);

    // ❌ não existe → cria
    if (!sock) {
      console.log(`[${sessionId}] criando nova sessão`);

      const result = await this.connector.connect(sessionId);

      sock = result.sock;

      this.sessions.set(sessionId, sock);
    }

    if (!sock.user) {
      console.log(`[${sessionId}] aguardando conexão...`);
      await this.connector.waitUntilConnected(sessionId);
    }

    return sock;
  }

  async createSession() {
    const sessionId = crypto.randomUUID();

    const { sock, qr } = await this.connector.connect(sessionId);

    this.sessions.set(sessionId, sock);

    return {
      sessionId,
      qr: qr ?? "",
    };
  }

  async sendText(sessionId: string, number: string, text: string) {
    await this.ensureSession(sessionId); // 🔥 GARANTE TUDO

    return this.repository.sendTextMessage(sessionId, number, text);
  }
}
