export type UserRole = 'operator' | 'admin' | 'auditor';

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface UsersListResponse {
  data: AppUser[];
  total: number;
}

export interface UserUpdateInput {
  role?: UserRole;
  is_active?: boolean;
}

export interface UsersListQuery {
  q?: string;
  role?: UserRole;
  is_active?: boolean;
}
