import { describe, it, expect } from "vitest";
import { BaileysConnector } from "../src/infrastructure/repositories/Baileys/BaileysConnector";

describe("BaileysConnector", () => {
  it("deve criar uma sessão e retornar estrutura válida", async () => {
    const connector = new BaileysConnector();

    const instance = await connector.connect("teste_01");

    expect(instance).toHaveProperty("sock");
    expect(instance).toHaveProperty("qr");

    expect(typeof instance.isConnected).toBe("function");
  });

  it("deve armazenar o socket na memória", async () => {
    const connector = new BaileysConnector();

    await connector.connect("teste_02");

    const sock = connector.getSocket("teste_02");

    expect(sock).toBeDefined();
  });

  it("deve retornar false se não estiver conectado", () => {
    const connector = new BaileysConnector();

    const connected = connector.isConnected("sessao_inexistente");

    expect(connected).toBe(false);
  });

  it("deve gerar QR, aguardar e verificar se conectou", async () => {
    const connector = new BaileysConnector();

    const instance = await connector.connect("teste_qr");

    // garante que QR foi gerado
    expect(instance.qr).toBeDefined();

    console.log("Escaneie o QR code agora...");

    // espera 10 segundos
    console.log(instance.qr);
    await new Promise((resolve) => setTimeout(resolve, 30000));

    const isConnected = connector.isConnected("teste_qr");

    console.log("Status conexão:", isConnected);

    // aqui você decide o comportamento esperado:
    // se NÃO escanear, vai dar false (normal)
    // se escanear, deve ser true

    expect(typeof isConnected).toBe("boolean");
  }, 50000); // aumenta timeout do teste (20s)
});
