export type AuditEntityType =
  | 'batch'
  | 'order'
  | 'installment'
  | 'certificate'
  | 'certificate_order'
  | 'investor'
  | 'merchant'
  | 'end_user'
  | 'user'
  | 'setting'
  | 'role_permission'
  | 'system';

export type AuditAction = 'create' | 'update' | 'cancel' | 'grant' | 'revoke' | (string & {});

export interface AuditActor {
  id: string;
  email: string;
  full_name: string;
}

export interface AuditEntry {
  id: string;
  occurred_at: string;
  actor: AuditActor | null;
  action: AuditAction;
  entity_type: AuditEntityType;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  payload: unknown;
}

export interface AuditListResponse {
  data: AuditEntry[];
  total: number;
  limit: number;
  offset: number;
}
