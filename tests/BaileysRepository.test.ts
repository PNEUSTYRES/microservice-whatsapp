import { describe, it } from "vitest";
import { BaileysRepository } from "../src/infrastructure/repositories/Baileys/BaileysRepository";
import { BaileysConnector } from "../src/infrastructure/repositories/Baileys/BaileysConnector";
import { SessionManager } from "../src/infrastructure/repositories/SessionManager";
import { WebhookDispatcher } from "../src/infrastructure/repositories/WebhookDispatcher";

describe("BaileysRepository (integration)", () => {
  //   it("deve criar sessão real e retornar QR", async () => {
  //     const connector = new BaileysConnector();
  //     const sessions = new SessionManager();

  //     const repository = new BaileysRepository(connector, sessions);

  //     const result = await repository.createSession("teste_real");

  //     expect(result.sessionId).toBe("teste_real");

  //     // pode ser string (QR) ou null (já logado)
  //     if (result.qr) {
  //       expect(result.qr).toContain("data:image/png;base64");
  //     }
  //   });
  it("deve enviar uma mensagem", async () => {
    const connector = new BaileysConnector(
      new WebhookDispatcher("https://google.com"),
    );
    const sessions = new SessionManager();
    const repository = new BaileysRepository(connector, sessions);

    const { sock } = await connector.connect("teste_qr");
    // console.log(qr);
    // await connector.waitUntilConnected('sessions')
    // aguarda conectar de verdade
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (sock.user) {
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    });

    await repository.createSession("teste_qr");

    // await repository.sendTextMessage(
    //   "teste_qr",
    //   "554399005171",
    //   "Teste automático  🚀",
    // );

    console.log(
      await repository.getContactProfilePicture("teste_qr", "554396538929"),
    );
  }, 30000);
});
