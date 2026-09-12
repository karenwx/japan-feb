import { describe, expect, test } from 'vitest';
import { handleHealthz } from './healthz.js';

describe('handleHealthz', () => {
  test('returns ok:true at {basePath}/healthz', async () => {
    const req = new Request('https://karenwang.org/projects/japan-feb/healthz');
    const res = handleHealthz(req, { BASE_PATH: '/projects/japan-feb' }, { service: 'japan-feb' });
    expect(res).not.toBeNull();
    const body = await res.json();
    expect(body).toMatchObject({ service: 'japan-feb', ok: true });
  });

  test('returns ok:true at /healthz when BASE_PATH is empty (preview)', async () => {
    const req = new Request('https://japan-feb-dev.example.workers.dev/healthz');
    const res = handleHealthz(req, { BASE_PATH: '' }, { service: 'japan-feb' });
    expect(res).not.toBeNull();
  });

  test('returns null for non-healthz paths', () => {
    const req = new Request('https://karenwang.org/projects/japan-feb/');
    const res = handleHealthz(req, { BASE_PATH: '/projects/japan-feb' }, { service: 'japan-feb' });
    expect(res).toBeNull();
  });
});
