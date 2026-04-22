export interface IWhatsappAdapter {
  createSession(): Promise<{ sessionId: string; qr: string }>;
  sendText(sessionId: string, number: string, text: string): Promise<void>;
}
