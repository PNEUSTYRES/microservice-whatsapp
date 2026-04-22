import { BaileysConnector } from "@/infrastructure/repositories/Baileys/BaileysConnector";
import fs from "fs";
import path from "path";
export class SessionBootstrap {
  constructor(private connector: BaileysConnector) {}

  async init() {
    const sessionDir = path.resolve("./session");

    if (!fs.existsSync(sessionDir)) {
      console.log("Nenhuma sessão encontrada.");
      return;
    }

    const folders = fs.readdirSync(sessionDir);

    const sessionIds = folders
      .filter((name) => name.startsWith("auth_"))
      .map((name) => name.replace("auth_", ""));

    console.log("Sessões encontradas:", sessionIds);

    for (const sessionId of sessionIds) {
      console.log(`🔄 Subindo sessão ${sessionId}`);
      this.connector.connect(sessionId);
    }
  }
}
