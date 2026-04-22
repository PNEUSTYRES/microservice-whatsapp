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
  private async getReadySocket(sessionId: string): Promise<WASocket> {
    let sock = this.sessions.get(sessionId);

    // cria se não existir
    if (!sock) {
      const result = await this.connector.connect(sessionId);
      sock = result.sock;

      this.sessions.set(sessionId, sock);
    }

    // espera conectar
    if (!sock.user) {
      await this.waitForConnection(sock);
    }

    return sock;
  }

  private waitForConnection(sock: WASocket) {
    return new Promise<void>((resolve, reject) => {
      if (sock.user) return resolve();

      const timeout = setTimeout(() => {
        reject(new Error("Timeout ao conectar sessão"));
      }, 20000);

      sock.ev.on("connection.update", (update) => {
        if (update.connection === "open") {
          clearTimeout(timeout);
          resolve();
        }

        if (update.connection === "close") {
          clearTimeout(timeout);
          reject(new Error("Conexão fechada antes de conectar"));
        }
      });
    });
  }

  async sendTextMessage(sessionId: string, number: string, text: string) {
    const sock = await this.getReadySocket(sessionId);

    const jid = `${number.replace(/\D/g, "")}@s.whatsapp.net`;

    return sock.sendMessage(jid, { text });
  }

  setSession(sessionId: string, sock: WASocket) {
    this.sessions.set(sessionId, sock);
  }
}
