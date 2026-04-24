import { Session } from "../entities/Session";

export interface ISessionRepository {
  create(session: Session): Promise<{ session_id: string }>;
  update(session: Session): Promise<void>;
  findById(id: string): Promise<Session | null>;
  findAllByTenant(tenantId: string): Promise<Session[]>;
  delete(id: string, tenant_id: string): Promise<void>;
}
