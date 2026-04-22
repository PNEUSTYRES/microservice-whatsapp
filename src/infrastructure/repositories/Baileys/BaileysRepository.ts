import { SessionManager } from "../SessionManager";
import { BaileysConnector } from "./BaileysConnector";
import { WASocket } from "@whiskeysockets/baileys";

export class BaileysRepository {
  constructor(
    private connector: BaileysConnector,
    private sessions: SessionManager,
  ) {}

  async createSession(sessionId: string) {
    const { sock, qr } = await this.connector.connect(sessionId);

    this.sessions.set(sessionId, sock);

    return {
      sessionId,
      qr,
    };
  }

  async sendTextMessage(sessionId: string, number: string, text: string) {
    const sock = this.sessions.get(sessionId);

    if (!sock || !sock.user) {
      throw new Error("Sessão não conectada");
    }
    const jid = `${number.replace(/\D/g, "")}@s.whatsapp.net`;

    return sock.sendMessage(
      jid,
      { text },
      {
        quoted: {
          key: {
            remoteJid: "554399005171@s.whatsapp.net", // 👈 use o jid correto
            id: "3A1043B636CD2B15C87E",
            fromMe: true,
          },
          message: {
            conversation: "Tetseme",
          },
        },
      },
    );
  }

  async getContactProfilePicture(sessionId: string, number: string) {
    const sock = this.sessions.get(sessionId);

    if (!sock || !sock.user) {
      throw new Error("Sessão não conectada");
    }

    const jid = `${number.replace(/\D/g, "")}@s.whatsapp.net`;

    let photo: string | null = null;
    let name: string | null = null;

    // foto
    try {
      photo = await sock.profilePictureUrl(jid, "image");
    } catch {
      photo = null;
    }

    const contact = sock.contacts?.[jid];

    name = contact?.name || contact?.notify || contact?.verifiedName || null;

    return {
      jid,
      name,
      photo,
    };
  }

  setSession(sessionId: string, sock: WASocket) {
    this.sessions.set(sessionId, sock);
  }
}
