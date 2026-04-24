import { IWhatsappAdapter } from "@/domain/repositories/IWhatsappAdapter";
import { BaileysRepository } from "./Baileys/BaileysRepository";

import { Session } from "@/domain/entities/Session";

export class RunAdapterBaileys implements IWhatsappAdapter {
  constructor(private repository: BaileysRepository) {}

  async createSession(session: Session) {
    await this.repository.createSession(session.id, session.tenant_id);
  }

  async sendText(sessionId: string, number: string, text: string) {
    this.repository.sendTextMessage(sessionId, number, text);
  }
}
