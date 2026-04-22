import { IWhatsappAdapter } from "@/domain/repositories/IWhatsappAdapter";
import { BaileysRepository } from "./Baileys/BaileysRepository";
import { BaileysConnector } from "./Baileys/BaileysConnector";
import { SessionManager } from "./SessionManager";

export class RunAdapter implements IWhatsappAdapter {
  constructor(
    private connector: BaileysConnector,
    private sessions: SessionManager,
    private repository: BaileysRepository,
  ) {}

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
    this.repository.sendTextMessage(sessionId, number, text);
  }
}
