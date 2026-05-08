import type { MeUser } from '@/lib/api/me';

type Role = MeUser['role'];

export interface NavItem {
  key: string;
  label: string;
  href: string;
  /** Roles that can see this item. Undefined = all authenticated. */
  allowedRoles?: readonly Role[];
}

export interface NavSection {
  title: string;
  /** Roles that can see this section (any item still applies its own filter). */
  allowedRoles: readonly Role[];
  items: readonly NavItem[];
}

const ALL_ROLES = ['operator', 'admin', 'auditor'] as const;

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: 'Operación',
    allowedRoles: ALL_ROLES,
    items: [
      { key: 'cycle', label: 'Panel del ciclo', href: '/cycle' },
      { key: 'certificates', label: 'Certificados', href: '/certificates' },
      { key: 'stock', label: 'Stock de órdenes', href: '/stock' },
      { key: 'investors', label: 'Inversores', href: '/investors' },
    ],
  },
  {
    title: 'Datos',
    allowedRoles: ALL_ROLES,
    items: [
      { key: 'batches', label: 'Lotes', href: '/batches' },
      { key: 'merchants', label: 'Comercios', href: '/merchants' },
    ],
  },
  {
    title: 'Sistema',
    allowedRoles: ['admin', 'auditor'],
    items: [
      { key: 'audit', label: 'Auditoría', href: '/audit' },
      { key: 'traceability', label: 'Trazabilidad', href: '/traceability' },
      { key: 'users', label: 'Usuarios', href: '/users', allowedRoles: ['admin'] },
    ],
  },
] as const;
