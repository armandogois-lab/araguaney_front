import { describe, it, expect } from 'vitest';
import { hasPermission } from './has-permission';

describe('hasPermission', () => {
  it('operator can upload batches', () => {
    expect(hasPermission('operator', 'batch.upload')).toBe(true);
  });

  it('admin can upload batches', () => {
    expect(hasPermission('admin', 'batch.upload')).toBe(true);
  });

  it('auditor cannot upload batches', () => {
    expect(hasPermission('auditor', 'batch.upload')).toBe(false);
  });

  it('all roles can read batches', () => {
    expect(hasPermission('operator', 'batch.read')).toBe(true);
    expect(hasPermission('admin', 'batch.read')).toBe(true);
    expect(hasPermission('auditor', 'batch.read')).toBe(true);
  });

  it('returns false for unknown permissions', () => {
    expect(hasPermission('admin', 'nonexistent.perm')).toBe(false);
  });
});
