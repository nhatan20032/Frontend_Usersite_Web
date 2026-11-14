import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function client(fetch, initial = {}) {
  const storage = new Map(Object.entries(initial));
  const events = [];
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL('../src/api/apiClient.ts', import.meta.url), 'utf8').replaceAll('import.meta.env', 'env'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, env: { VITE_API_BASE_URL: 'http://api.test/api/v1' }, fetch, URLSearchParams,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    window: { location: { pathname: '/', href: '' }, dispatchEvent: event => events.push(event) },
    CustomEvent: class { constructor(type) { this.type = type; } },
  });
  return { exports, storage, events };
}
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

test('guest mutations require authentication without issuing requests', async () => {
  let calls = 0; const { exports: c } = client(async () => { calls++; return json({}); });
  await assert.rejects(c.apiClient.post('/user/tasks', { title: 'Task' }), error => error.status === 401);
  assert.equal(calls, 0);
});
test('empty server responses stay empty', async () => {
  const { exports: c } = client(async () => json([]), { access_token: 'access' });
  assert.equal((await c.apiClient.get('/user/notes')).length, 0);
});
test('parallel expired requests share one refresh and preserve UUID requests', async () => {
  let refreshes = 0;
  const { exports: c, storage } = client(async (url, options) => {
    if (url.endsWith('/auth/refresh-token')) { refreshes++; await new Promise(r => setTimeout(r, 5)); return json({ token: 'renewed', refreshToken: 'rotated' }); }
    return options.headers.Authorization === 'Bearer renewed' ? json([]) : json({}, 401);
  }, { access_token: 'expired', refresh_token: 'refresh' });
  await Promise.all([c.apiClient.get('/user/tasks'), c.apiClient.get('/user/notes')]);
  assert.equal(refreshes, 1); assert.equal(storage.get('access_token'), 'renewed');
});
test('forbidden access is not advertised as a subscription upgrade', async () => {
  const { exports: c, events } = client(async () => json({ errorCode: 'ACCOUNT_BANNED', message: 'Banned' }, 403), { access_token: 'access' });
  await assert.rejects(c.apiClient.get('/user/tasks'), error => error.status === 403 && !error.isUpgradeRequired);
  assert.equal(events.length, 0);
});
test('server failures propagate instead of becoming local success', async () => {
  const { exports: c } = client(async () => json({ message: 'Cannot save' }, 500), { access_token: 'access' });
  await assert.rejects(c.apiClient.post('/user/tasks', { title: 'Task' }), /Cannot save/);
});
