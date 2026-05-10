import type { MeUser } from '@/lib/api/me';

type Role = MeUser['role'];

const OPERATOR_PERMS = [
  'batch.read',
  'batch.upload',
  'order.read',
  'merchant.read',
  'investor.read',
  'investor.write',
  'certificate.read',
  'certificate.simulate',
  'certificate.create',
  'certificate.cancel',
  'audit.read',
] as const;

const AUDITOR_PERMS = [
  'batch.read',
  'order.read',
  'merchant.read',
  'investor.read',
  'certificate.read',
  'audit.read',
] as const;

const ADMIN_PERMS = [
  ...OPERATOR_PERMS,
  'permission.manage',
  'setting.write',
  'user.manage',
] as const;

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<string>> = {
  operator: new Set(OPERATOR_PERMS),
  auditor: new Set(AUDITOR_PERMS),
  admin: new Set(ADMIN_PERMS),
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}
