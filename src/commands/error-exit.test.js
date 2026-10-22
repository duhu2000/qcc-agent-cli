/* eslint-env jest */
const { spawnSync } = require('child_process');
const path = require('path');

// Real command entry, memory-only config/cache and transports; no user config or network.
const childScript = String.raw`
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const config = require('./src/services/configService');
const http = require('./src/utils/httpClient');
const scenario = JSON.parse(process.env.QMCP_SCENARIO, (_key, value) => typeof value === 'string' ? value.replaceAll('__qmcp_large__', 'x'.repeat(192 * 1024)) : value);
let expired = scenario.cache !== 'warm';
const tools = [{ name: 'probe', description: 'fixture', inputSchema: { type: 'object', properties: {} } }];
const cache = { company: { tools } };
Object.assign(config, {
  checkConfigIntegrity: () => ({ exists: true }), isMcpConfigValid: () => true,
  getMcpConfig: () => ({ baseUrl: 'https://fixture.invalid/mcp', authorization: 'Bearer fixture', timeout: 1000 }),
  getToolsCachePath: () => __filename, isToolsCacheExpired: () => expired,
  loadToolsCache: () => expired ? null : cache, loadToolsCacheWithFallback: () => cache,
  saveToolsCache: () => { expired = false; }
});
const originalExists = fs.existsSync;
fs.existsSync = p => p === __filename || originalExists(p);
const mcp = require('./src/services/mcpService');
let calls = 0;
mcp.fetchToolsFromServer = async () => {
  if (scenario.cache === 'fallback') throw new http.QccError('MCP_ERROR', 'fixture refresh failed');
  return tools;
};
mcp.httpClient.post = async () => {
  calls++;
  if (scenario.httpStatus) return http.createHttpClient().interceptors.response.handlers[0].rejected({ response: { status: scenario.httpStatus, data: scenario.body } });
  const payload = JSON.stringify(scenario.body, null, scenario.sse === 'multiline' ? 2 : undefined);
  return { data: scenario.sse ? payload.split('\n').map(line => 'data: ' + line).join('\n') + '\n\n' : payload };
};
const idp = require('./src/services/idpService');
const realParse = idp.parseDocument;
const realResult = idp.getParseResult;
const remoteConfig = { baseUrl: 'https://fixture.invalid', authorization: 'fixture', timeout: 1000 };
const gateway = {
  post: async (url) => {
    if (url.endsWith('/create_upload_url')) return { status: 200, data: { upload_file_id: 'upload-1', upload_url: 'http://fixture.invalid/upload', method: 'PUT', expires_in: 300, headers: { 'Content-Type': 'application/pdf', 'Content-Length': '16', 'QCC-Upload-Source': 'fixture' } } };
    calls++; return { status: scenario.body.status === 'failed' ? 402 : 200, data: scenario.body };
  },
  get: async () => { calls++; return { status: 200, data: scenario.body }; }
};
idp.parseDocument = payload => realParse(payload, {
  remoteConfig, httpClient: gateway,
  encryptionDetector: { detectLocalFileEncryption: async () => ({ status: 'not_encrypted' }) },
  rawUploadClient: request => new Promise((resolve, reject) => {
    request.fileStream.once('error', reject);
    request.fileStream.once('end', () => resolve({ status: 204 }));
    request.fileStream.resume();
  })
});
idp.getParseResult = task => realResult(task, { remoteConfig, httpClient: gateway });
(async () => {
  let localDir;
  if (scenario.argv.includes('__local_pdf__')) {
    localDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qmcp-4539-'));
    const file = path.join(localDir, 'sample.pdf');
    fs.writeFileSync(file, '%PDF-1.4 fixture');
    scenario.argv = scenario.argv.map(arg => arg === '__local_pdf__' ? file : arg);
  }
  try {
  const { createProgram } = require('./src/cliSetup');
  const program = await createProgram(scenario.argv);
  await program.parseAsync(scenario.argv, { from: 'user' });
  assert.equal(calls, 1, 'one final call, no retry');
  } finally {
    if (localDir) {
      assert.equal(path.dirname(path.resolve(localDir)), path.resolve(os.tmpdir()));
      fs.rmSync(localDir, { recursive: true, force: true });
    }
  }
})().catch(error => { console.error(error); process.exitCode = 2; });
`;

function run(scenario) {
  const result = spawnSync(process.execPath, ['-e', childScript], {
    cwd: path.resolve(__dirname, '../..'), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1', QMCP_SCENARIO: JSON.stringify({ cache: 'warm', ...scenario }, (_key, value) => typeof value === 'string' ? value.replaceAll('x'.repeat(192 * 1024), '__qmcp_large__') : value) }
  });
  if (result.error) throw result.error;
  return result;
}

const failed = {
  task_id: 'task-1', status: 'failed', message: 'safe failed message',
  error: { code: 300008, description: '积分余额不足', explanation: 'safe reason', details: {
    status: 402, service: 'qichacha_mcp_service', error_type: 'credit_balance_insufficient',
    quota_status: 'insufficient', retry_allowed: false, recharge_supported: true,
    recharge_entry: 'https://agent.qcc.com/', suggested_action: 'RECHARGE'
  } },
  extension: { keep: [null, 'x'.repeat(192 * 1024)] }
};
const toolResult = { isError: true, content: [{ type: 'text', text: JSON.stringify(failed) }] };

describe('QMCP-4539 actual exit and complete output', () => {
  test.each(['warm', 'refresh', 'fallback'])('--json failure via createProgram with %s cache', (cache) => {
    const result = run({ cache, argv: ['company', 'probe', '--json'], body: { jsonrpc: '2.0', id: 1, result: toolResult } });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual(toolResult);
    expect(result.stderr).toContain('充值到账后重新调用');
    if (cache !== 'warm') expect(result.stderr).toContain('缓存');
  });

  test.each([404, 405])('HTTP%s renormalization retains the entire body', (httpStatus) => {
    const body = { error: { code: 100404, message: 'independent remote reason', description: 'independent description', explanation: 'independent explanation' }, extra: { keep: null }, extension: failed.extension };
    for (const json of [false, true]) {
      const result = run({ argv: ['company', 'probe', ...(json ? ['--json'] : [])], httpStatus, body });
      expect(result.status).toBe(1);
      if (json) expect(JSON.parse(result.stdout)).toEqual(body);
      expect(result.stderr).toContain(`MCP 服务地址不可用（HTTP ${httpStatus}）`);
      expect(result.stderr).toContain('100404');
      expect(result.stderr).toContain('修复命令：qcc config set mcp.baseUrl');
      for (const reason of [body.error.message, body.error.description, body.error.explanation]) {
        expect(result.stderr.split(reason)).toHaveLength(2);
      }
    }
  });

  test('ordinary HTTP error with identical message and serverMessage prints the reason once', () => {
    const body = { error: { code: 100400, message: 'ordinary remote reason' } };
    for (const json of [false, true]) {
      const result = run({ argv: ['company', 'probe', ...(json ? ['--json'] : [])], httpStatus: 400, body });
      expect(result.status).toBe(1);
      if (json) expect(JSON.parse(result.stdout)).toEqual(body);
      expect(result.stderr.split(body.error.message)).toHaveLength(2);
    }
  });

  test.each([
    ['MCP tool', { jsonrpc: '2.0', id: 1, result: toolResult }, 'safe reason'],
    ['JSON-RPC', { jsonrpc: '2.0', id: 1, error: { code: 300008, message: 'independent RPC failure' }, extra: { keep: null } }, 'independent RPC failure']
  ])('multiline SSE %s exits 1 with complete JSON and readable reasons in both modes', (_name, body, reason) => {
    for (const json of [false, true]) {
      const result = run({ argv: ['company', 'probe', ...(json ? ['--json'] : [])], body, sse: 'multiline' });
      expect(result.status).toBe(1);
      if (json) expect(JSON.parse(result.stdout)).toEqual(body.result || body);
      expect(result.stderr).toContain(reason);
      expect(result.stderr).toContain('300008');
      expect(result.stderr).toContain('充值到账后重新调用');
    }
  });

  test.each([
    ['MCP text', { jsonrpc: '2.0', result: { isError: true, content: [{ type: 'text', text: 'plain failure' }] } }],
    ['MCP structured', { jsonrpc: '2.0', result: { isError: true, structuredContent: { code: 300008 } } }],
    ['MCP empty', { jsonrpc: '2.0', result: { isError: true, content: [] } }],
    ['MCP multi text', { jsonrpc: '2.0', result: { isError: true, content: [{ type: 'text', text: 'first failure' }, { type: 'text', text: 'second failure' }] } }],
    ['JSON-RPC', { jsonrpc: '2.0', error: { code: 300008, message: 'safe failure' } }]
  ])('%s exits 1 in both modes and JSON/SSE commands', (_name, body) => {
    for (const sse of [false, true]) {
      for (const json of [false, true]) {
        const result = run({ argv: ['company', 'probe', ...(json ? ['--json'] : [])], body, sse });
        expect(result.status).toBe(1);
        expect(result.stderr).toMatch(/failure|充值|执行失败/);
        if (json) expect(JSON.parse(result.stdout)).toEqual(body.result || body);
      }
    }
  });

  test.each([
    ['document', 'parse_document', '--file_url', 'https://files.qcc.com/sample.pdf'],
    ['document', 'parse_document', '--file_path', '__local_pdf__'],
    ['document', 'get_parse_result', 'task-1']
  ])('document command %j writes a whole failed envelope and exits 1', (...argv) => {
    const result = run({ argv, body: failed });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('充值到账后重新调用');
    expect(JSON.parse(result.stdout)).toEqual(failed);
  });

  test.each(['processing', 'success'])('document %s remains exit0 and unchanged', (status) => {
    const body = { task_id: 'task-1', status, extension: { keep: null } };
    const result = run({ argv: ['document', 'get_parse_result', 'task-1'], body });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(body);
  });

  test('ordinary business error data remains success output', () => {
    const business = { error: { code: 300008, message: 'ordinary business data' } };
    for (const sse of [false, true, 'multiline']) {
      for (const json of [false, true]) {
        const result = run({ argv: ['company', 'probe', ...(json ? ['--json'] : [])], body: { jsonrpc: '2.0', result: { content: [{ type: 'text', text: JSON.stringify(business) }] } }, sse });
        expect(result.status).toBe(0);
        if (json) expect(JSON.parse(result.stdout)).toEqual(business);
        else expect(result.stdout).toContain('ordinary business data');
        expect(result.stderr).not.toContain('充值到账后重新调用');
      }
    }
  });

  test.each([100211, 987654])('historical/unknown document code %s preserves extension and exits1 without balance inference', (code) => {
    const body = { task_id: 'task-1', status: 'failed', message: '积分余额不足', error: { code, description: 'gateway description', details: { keep: null } }, extension: { keep: true } };
    const result = run({ argv: ['document', 'get_parse_result', 'task-1'], body });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual(body);
    expect(result.stderr).not.toContain('充值到账后重新调用');
  });
});
