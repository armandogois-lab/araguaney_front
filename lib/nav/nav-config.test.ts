import { describe, it, expect } from 'vitest';
import { NAV_SECTIONS } from './nav-config';
import type { MeUser } from '@/lib/api/me';

type Role = MeUser['role'];

function visibleItemsForRole(role: Role): { section: string; item: string }[] {
  const out: { section: string; item: string }[] = [];
  for (const section of NAV_SECTIONS) {
    if (!section.allowedRoles.includes(role)) continue;
    for (const item of section.items) {
      if (item.allowedRoles && !item.allowedRoles.includes(role)) continue;
      out.push({ section: section.title, item: item.label });
    }
  }
  return out;
}

describe('NAV_SECTIONS', () => {
  it('has the 3 expected section titles in order', () => {
    expect(NAV_SECTIONS.map((s) => s.title)).toEqual(['Operación', 'Datos', 'Sistema']);
  });

  it('has 9 unique routes across all sections', () => {
    const all = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.href));
    expect(all).toHaveLength(9);
    expect(new Set(all).size).toBe(9);
  });

  it('admin sees all 9 items across 3 sections', () => {
    const visible = visibleItemsForRole('admin');
    expect(visible).toHaveLength(9);
  });

  it('auditor sees 8 items (no Usuarios) across 3 sections', () => {
    const visible = visibleItemsForRole('auditor');
    expect(visible).toHaveLength(8);
    expect(visible.find((v) => v.item === 'Usuarios')).toBeUndefined();
  });

  it('operator sees 6 items across 2 sections (no Sistema)', () => {
    const visible = visibleItemsForRole('operator');
    expect(visible).toHaveLength(6);
    expect(visible.find((v) => v.section === 'Sistema')).toBeUndefined();
  });

  it('every item has a unique key', () => {
    const keys = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
  });
});
