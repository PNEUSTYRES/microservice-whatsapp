import { ISessionRepository } from "@/domain/repositories/ISessionRepository";

export class OnSessionConnectedHandler {
  constructor(private sessionRepo: ISessionRepository) {}

  async handle(event: { sessionId: string; tenantId: string }) {
    const session = await this.sessionRepo.findById(event.sessionId);

    if (!session) return;

    session.changeQrCode("");

    await this.sessionRepo.update(session);
  }
}
