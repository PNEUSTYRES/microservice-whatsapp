import { ISessionRepository } from "@/domain/repositories/ISessionRepository";

export class OnQrGeneratedHandler {
  constructor(private sessionRepo: ISessionRepository) {}

  async handle(event: { sessionId: string; tenantId: string; qr: string }) {
    const session = await this.sessionRepo.findById(event.sessionId);

    if (!session) return;

    session.changeQrCode(event.qr);

    await this.sessionRepo.update(session);
  }
}
