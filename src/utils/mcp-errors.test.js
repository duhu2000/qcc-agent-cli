/* eslint-env jest */
const { McpService } = require('../services/mcpService');
const { createHttpClient, parseSSEResponse, QccError } = require('./httpClient');

describe('QMCP-4539 protocol errors', () => {
  const service = new McpService();
  const balance = { code: 300008, status: 402, message: 'balance rejected', data: { recharge_entry: 'https://agent.qcc.com/', retry_allowed: false } };

  test.each([
    { content: [{ type: 'text', text: JSON.stringify(balance) }] },
    { content: [{ type: 'text', text: 'first reason' }, { type: 'text', text: 'second reason' }] },
    { content: [] },
    { structuredContent: balance }
  ])('keeps a failed CallToolResult before JSON/SSE unwrapping: %j', (content) => {
    const result = { ...content, isError: true };
    const response = { jsonrpc: '2.0', id: 1, result };
    for (const data of [JSON.stringify(response), `data: ${JSON.stringify(response)}\n\n`, JSON.stringify(response, null, 2).split('\n').map(line => `data: ${line}`).join('\n') + '\n\n']) {
      let caught;
      try { service.parseResponse(data); } catch (error) { caught = error; }
      expect(caught).toBeInstanceOf(QccError);
      expect(caught.rawResponse).toEqual(result);
      if (content.structuredContent || content.content?.[0]?.text === JSON.stringify(balance)) {
        expect(caught).toMatchObject({ serverCode: 300008, recoverable: false });
        expect(caught.suggestion).toContain('充值到账后重新调用');
        expect(caught.suggestion).toContain('https://agent.qcc.com/');
      }
      if (content.content?.length === 2) expect(caught.message).toContain('second reason');
    }
  });

  test.each([undefined, false])('preserves success with ordinary business error and nested code, isError=%s', (isError) => {
    const business = { error: { message: 'ordinary data', nested: { code: 300008 } } };
    expect(service.parseResponse(JSON.stringify({ jsonrpc: '2.0', result: { isError, content: [{ type: 'text', text: JSON.stringify(business) }] } }))).toEqual(business);
  });

  test('JSON-RPC error keeps the entire original response in both transports', () => {
    const response = { jsonrpc: '2.0', id: 1, error: { code: '300008', message: 'balance rejected' }, extension: { keep: null } };
    for (const data of [JSON.stringify(response), `data: ${JSON.stringify(response)}\n\n`, JSON.stringify(response, null, 2).split('\n').map(line => `data: ${line}`).join('\n') + '\n\n']) {
      expect(() => service.parseResponse(data)).toThrow(QccError);
      try { service.parseResponse(data); } catch (error) {
        expect(error.rawResponse).toEqual(response);
        expect(error.suggestion).toContain('充值到账后重新调用');
        expect(error.suggestion).not.toContain('https://');
      }
    }
  });

  test.each(['\n', '\r\n', '\r'])('SSE keeps the last valid event and success unwrapping with line ending %j', (newline) => {
    const business = { error: { code: 300008, message: 'ordinary business data' }, keep: null };
    const response = { jsonrpc: '2.0', result: { content: [{ type: 'text', text: JSON.stringify(business) }] } };
    const data = [
      'data: {"earlier":true}', '', ': keep-alive', 'event: message', 'id: 2', 'retry: 1000',
      ...JSON.stringify(response, null, 2).split('\n').map(line => `data: ${line}`),
      '', 'data: invalid trailing event'
    ].join(newline);
    expect(parseSSEResponse(data)).toEqual(response);
    expect(service.parseResponse(data)).toEqual(business);
  });

  test('SSE parses a multiline final event without a terminating blank line', () => {
    const response = { jsonrpc: '2.0', result: { content: [{ type: 'text', text: 'success' }] } };
    const data = JSON.stringify(response, null, 2).split('\n').map(line => `data: ${line}`).join('\n');
    expect(parseSSEResponse(data)).toEqual(response);
    expect(service.parseResponse(data)).toBe('success');
  });

  test('invalid SSE remains raw data without inferring a balance error', () => {
    const data = 'data: {"code":\n\ndata: 300008}\n\n';
    expect(parseSSEResponse(data)).toBeNull();
    expect(service.parseResponse(data)).toBe(data);
  });

  test.each([402, 429])('HTTP %s retains body/actions and balance diagnostic through aggregation', (status) => {
    const body = { task_id: 'task-1', status: 'failed', error: { code: 300008, description: '积分余额不足', explanation: 'safe reason', details: balance.data } };
    let caught;
    try { createHttpClient().interceptors.response.handlers[0].rejected({ response: { status, data: JSON.stringify(body) } }); } catch (error) { caught = error; }
    expect(caught.rawResponse).toEqual(body);
    expect(caught).toMatchObject({ httpStatus: status, serverCode: 300008, details: balance.data, recoverable: false });
    const summary = service.getFailureSummaryFromError(caught);
    expect(summary).toMatchObject({ httpStatus: status, serverCode: 300008, details: balance.data });
    expect(summary.message).toContain('充值到账后重新调用');
    expect(summary.message).not.toContain('稍后重试');
  });

  test.each([300009, 300006, undefined, '300008x'])('other HTTP402 codes are not balance: %s', (code) => {
    try { createHttpClient().interceptors.response.handlers[0].rejected({ response: { status: 402, data: { code, message: '积分不足' } } }); } catch (error) {
      expect(error.serverCode).toBe(code);
      expect(error.suggestion).not.toContain('充值');
    }
  });
});
