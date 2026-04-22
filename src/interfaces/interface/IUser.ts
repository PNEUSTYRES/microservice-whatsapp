export interface IUser {
  createNewUserTenant(
    tenant_id: string,
    platform_name: string,
    user: {
      email: string;
      phone: string;
      name: string;
      password: string;
    },
  ): Promise<{ user_id: string }>;
  updateUserTenant(
    tenant_id: string,
    user: {
      user_id: string;
      email: string;
      name: string;
    },
  ): Promise<void>;
  updatePasswordUserTenant(
    tenant_id: string,
    user_id: string,
    password: string,
  ): Promise<void>;
}
