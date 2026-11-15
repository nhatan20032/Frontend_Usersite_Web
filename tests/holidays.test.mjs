import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

function holidays(get, preference = null) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL('../src/utils/vietnamHolidays.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, Date, localStorage: { getItem: () => preference }, require: () => ({ apiClient: { get } }) });
  return exports;
}
test('holidays use the selected backend region and date without timezone shifts', async () => {
  let parameters;
  const api = holidays(async (_, query) => { parameters = query; return { source: 'https://source.test', fetchedAt: '2026-01-01T00:00:00Z', holidays: [{ date: '2026-02-17', name: 'Tet Holiday' }] }; }, '{"country":"US","subdivision":"US-CA"}');
  const [event] = await api.getVietnamHolidays(2026);
  assert.equal(parameters.country, 'US'); assert.equal(parameters.subdivision, 'US-CA');
  assert.equal(event.month, 1); assert.equal(event.day, 17); assert.equal(event.backendId, undefined);
  assert.match(event.description, /source.test/);
});
test('an empty or unavailable holiday source never generates local holidays', async () => {
  assert.equal((await holidays(async () => ({ holidays: [] })).getVietnamHolidays(2026)).length, 0);
  await assert.rejects(holidays(async () => { throw new Error('Source unavailable'); }).getVietnamHolidays(2026), /Source unavailable/);
});

test('productivity summary reflects loaded server data without invented historical metrics', () => {
  const nativeRequire = createRequire(import.meta.url);
  const React = nativeRequire('react');
  const { renderToStaticMarkup } = nativeRequire('react-dom/server');
  let data = { tasksData: [], eventsData: [] };
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL('../src/components/calendar/ProductivityKPI.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => name.includes('AppContext') ? { useApp: () => data } : name.includes('LanguageContext') ? { useLanguage: () => ({ language: 'vi' }) } : nativeRequire(name) });
  const render = () => renderToStaticMarkup(React.createElement(exports.ProductivityKPI));
  assert.match(render(), /0\/0 công việc/);
  data = { tasksData: [{ completed: true }, { completed: false }], eventsData: [{ type: 'routine' }, { type: 'event' }] };
  assert.match(render(), /1\/2 công việc hoàn thành · 1 thói quen/);
  assert.doesNotMatch(render(), /87\.5|21 ngày|PDF|tuần trước/);
});

test('November holiday stays on November 24 in the web calendar', async () => {
  const api = holidays(async () => ({source: 'backend', fetchedAt: '2026-11-15T00:00:00Z', holidays: [{date: '2026-11-24', name: 'Ngày Văn hoá Việt Nam'}]}));
  const [event] = await api.getVietnamHolidays(2026);
  assert.equal(event.month, 10);
  assert.equal(new Date(event.year, event.month, event.day).getDay(), 2);
  assert.equal(event.day, 24);
});