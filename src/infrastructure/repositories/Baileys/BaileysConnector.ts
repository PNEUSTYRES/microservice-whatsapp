import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  WASocket,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import pino from "pino";
import { Boom } from "@hapi/boom";
import { WebhookDispatcher } from "../WebhookDispatcher";
import { SessionManager } from "../SessionManager";

export class BaileysConnector {
  private reconnectAttempts: Map<string, number> = new Map();

  constructor(
    private webhookDispatcher: WebhookDispatcher,
    private sockets: SessionManager,
  ) {}

  async connect(sessionId: string) {
    if (this.sockets.has(sessionId)) {
      return this.buildReturn(sessionId);
    }

    const { sock, saveCreds } = await this.createSocket(sessionId);

    this.sockets.set(sessionId, sock);

    this.bindCoreEvents(sessionId, sock, saveCreds);

    const { qr, isConnected } = await this.handleConnection(sessionId, sock);

    return {
      sock,
      qr,
      isConnected,
    };
  }

  private async createSocket(sessionId: string) {
    const { state, saveCreds } = await useMultiFileAuthState(
      `./session/auth_${sessionId}`,
    );

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
    });

    return { sock, saveCreds };
  }

  private bindCoreEvents(
    sessionId: string,
    sock: WASocket,
    saveCreds: () => void,
  ) {
    sock.ev.on("creds.update", saveCreds);

    sock.ev.process(async (events) => {
      for (const [event, data] of Object.entries(events)) {
        console.log(`[${sessionId}] Evento:`, event);

        await this.webhookDispatcher.dispatch(event, data);
      }
    });
  }

  private async handleConnection(sessionId: string, sock: WASocket) {
    let isConnected = false;
    let resolved = false;

    const qr = await new Promise<string | null>((resolve) => {
      sock.ev.on("connection.update", async (update) => {
        const { connection, qr, lastDisconnect } = update;

        // QR
        if (qr && !resolved) {
          resolved = true;
          const qrBase64 = await QRCode.toDataURL(qr);
          return resolve(qrBase64);
        }

        // conectado
        if (connection === "open") {
          console.log(`[${sessionId}] ✅ Conectado`);

          isConnected = true;
          this.reconnectAttempts.set(sessionId, 0);

          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }

        // desconectado
        if (connection === "close") {
          isConnected = false;

          const error = lastDisconnect?.error as Boom | undefined;
          const statusCode = error?.output?.statusCode;

          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(
            `[${sessionId}] ❌ Fechado. Reconectar: ${shouldReconnect}`,
          );

          this.sockets.delete(sessionId);

          if (shouldReconnect) {
            this.scheduleReconnect(sessionId);
          } else {
            console.log(`[${sessionId}] ⚠️ Logout detectado`);
          }
        }
      });
    });

    return {
      qr,
      isConnected: () => isConnected,
    };
  }

  private scheduleReconnect(sessionId: string) {
    const attempts = (this.reconnectAttempts.get(sessionId) || 0) + 1;

    this.reconnectAttempts.set(sessionId, attempts);

    const delay = Math.min(1000 * 2 ** attempts, 30000);

    setTimeout(() => {
      this.connect(sessionId);
    }, delay);
  }

  private buildReturn(sessionId: string) {
    return {
      sock: this.sockets.get(sessionId)!,
      qr: null,
      isConnected: () => this.isConnected(sessionId),
    };
  }

  isConnected(sessionId: string) {
    return !!this.sockets.get(sessionId)?.user;
  }

  getSocket(sessionId: string) {
    return this.sockets.get(sessionId);
  }
}
