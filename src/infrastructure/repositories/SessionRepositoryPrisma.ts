import { ISessionRepository } from "@/domain/repositories/ISessionRepository";
import { Session } from "@/domain/entities/Session";
import { $prismaClient } from "@config/database";

export class SessionRepositoryPrisma implements ISessionRepository {
  constructor() {}

  async create(session: Session): Promise<{ session_id: string }> {
    const data = session.toDTO();

    const result = await $prismaClient.session.create({
      data,
    });
    return { session_id: result.id };
  }

  async update(session: Session): Promise<void> {
    const data = session.toDTO();

    await $prismaClient.session.update({
      where: { id: session.id },
      data,
    });
  }

  async findById(id: string): Promise<Session | null> {
    const session = await $prismaClient.session.findUnique({
      where: { id },
    });

    if (!session) return null;

    return Session.restore({
      id: session.id,
      name: session.name,
      tenant_id: session.tenant_id,
      created_at: session.created_at,
      descricao: session.descricao || "",
      qrcode: session.qrcode || "",
    });
  }

  async findAllByTenant(tenantId: string): Promise<Session[]> {
    const sessions = await $prismaClient.session.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: "desc" },
    });

    return sessions.map((s) =>
      Session.restore({
        id: s.id,
        name: s.name,
        tenant_id: s.tenant_id,
        created_at: s.created_at,
        descricao: s.descricao || "",
        qrcode: s.qrcode || "",
      }),
    );
  }

  async delete(id: string, tenant_id: string): Promise<void> {
    await $prismaClient.session.delete({
      where: { id, tenant_id },
    });
  }
}
