/* eslint-env jest */

const idpService = require('../services/idpService');
const { ErrorType, QccError } = require('../utils/httpClient');
const { getParseResult, parseDocument } = require('./idp');

jest.mock('../services/idpService', () => ({
  getParseResult: jest.fn(),
  parseDocument: jest.fn()
}));

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, reject, resolve };
}

describe('document parse command progress notice', () => {
  let stdoutSpy;
  let stderrSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    stdoutSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    stderrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    idpService.parseDocument.mockReset();
    idpService.getParseResult.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('prints submitting notice to stderr without contaminating JSON stdout', async () => {
    const deferred = createDeferred();
    const result = {
      task_id: 'qcc_idp_1',
      status: 'processing',
      message: '任务已提交，解析处理中，请调用 get_parse_result 工具获取状态和结果。',
      next_action: 'get_parse_result'
    };
    idpService.parseDocument.mockReturnValueOnce(deferred.promise);

    const commandPromise = parseDocument({
      file_url: 'https://files.qcc.com/sample.pdf'
    });

    expect(stderrSpy).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('正在提交文档解析任务，请稍候...'));

    deferred.resolve(result);
    await commandPromise;

    expect(stdoutSpy).toHaveBeenCalledWith(JSON.stringify(result, null, 2));
    expect(stdoutSpy).not.toHaveBeenCalledWith(expect.stringContaining('正在提交文档解析任务，请稍候...'));
  });

  test('prints wait-mode notice to stderr without contaminating JSON stdout', async () => {
    const deferred = createDeferred();
    const result = {
      task_id: 'qcc_idp_1',
      status: 'success',
      message: '任务处理成功。'
    };
    idpService.parseDocument.mockReturnValueOnce(deferred.promise);

    const commandPromise = parseDocument({
      file_url: 'https://files.qcc.com/sample.pdf',
      wait: true
    });

    jest.runOnlyPendingTimers();

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('正在提交文档解析任务并等待文档解析结果，请稍候...'));

    deferred.resolve(result);
    await commandPromise;

    expect(stdoutSpy).toHaveBeenCalledWith(JSON.stringify(result, null, 2));
    expect(stdoutSpy).not.toHaveBeenCalledWith(expect.stringContaining('正在提交文档解析任务并等待文档解析结果，请稍候...'));
  });

  test('rejects unsafe URL before service call and progress timer', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined);

    await parseDocument({
      file_url: 'http://127.0.0.1/private.pdf?token=secret'
    });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(idpService.parseDocument).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining('URL 文件不可获取、不可识别或不满足解析限制，请检查 URL 后重试。')
    );
    expect(JSON.stringify(stderrSpy.mock.calls)).not.toMatch(/127\.0\.0\.1|token=secret/u);
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  test('prints a valid failed business envelope unchanged and keeps exit code successful', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    const canonicalResult = {
      task_id: 'qcc-task-canonical-1',
      status: 'failed',
      message: '解析服务不可用，解析服务暂不可用，请稍后重试。',
      error: {
        code: 400205,
        description: '解析服务不可用',
        explanation: '解析服务暂不可用，请稍后重试。',
        details: { safe_context: { retryable: true, source: 'gateway' } }
      },
      extension: { contract_version: 'idp-error-v1', tags: ['canonical', null] }
    };
    const cleanedResult = {
      task_id: 'qcc-task-cleaned-1',
      status: 'failed',
      message: '文档解析失败，文档解析任务失败，请查看文件内容或稍后重新提交。',
      error: {
        code: 100213,
        description: '文档解析失败',
        explanation: '文档解析任务失败，请查看文件内容或稍后重新提交。'
      }
    };
    const processingResult = {
      task_id: 'qcc-task-processing-1',
      status: 'processing',
      message: '任务已提交，解析处理中，请调用 get_parse_result 工具获取状态和结果。',
      next_action: 'get_parse_result',
      extension: { contract_version: 'idp-error-v1', sequence: 1 }
    };
    idpService.parseDocument
      .mockResolvedValueOnce(canonicalResult)
      .mockResolvedValueOnce(cleanedResult)
      .mockResolvedValueOnce(processingResult);

    await parseDocument({ file_url: 'https://files.qcc.com/sample.pdf' });
    await parseDocument({ file_url: 'https://files.qcc.com/sample.pdf' });
    await parseDocument({ file_url: 'https://files.qcc.com/sample.pdf' });

    expect(stdoutSpy).toHaveBeenNthCalledWith(1, JSON.stringify(canonicalResult, null, 2));
    expect(stdoutSpy).toHaveBeenNthCalledWith(2, JSON.stringify(cleanedResult, null, 2));
    expect(stdoutSpy).toHaveBeenNthCalledWith(3, JSON.stringify(processingResult, null, 2));
    expect(exitSpy).not.toHaveBeenCalled();
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  test('prints a valid get_parse_result business envelope unchanged', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    const result = {
      task_id: null,
      status: 'failed',
      message: 'safe failure',
      error: { code: 987654, description: 'gateway extension code' },
      extension: { keep: true }
    };
    idpService.getParseResult.mockResolvedValue(result);

    await getParseResult('qcc_idp_1');

    expect(stdoutSpy).toHaveBeenCalledWith(JSON.stringify(result, null, 2));
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('keeps non-standard responses and 200215 on the existing error exit path', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    idpService.parseDocument.mockRejectedValueOnce(new Error('文档解析服务返回内容异常。'));

    await parseDocument({ file_url: 'https://files.qcc.com/sample.pdf' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('文档解析服务返回内容异常。'));
    expect(stdoutSpy).not.toHaveBeenCalled();

    stderrSpy.mockClear();
    exitSpy.mockClear();
    idpService.getParseResult.mockRejectedValueOnce(
      new QccError(ErrorType.AUTH_FAILED, '身份认证失败', {
        code: 200215,
        suggestion: '身份凭证错误，请检查 Authorization 是否正确，或运行 qcc init 更新配置'
      })
    );

    await getParseResult('qcc_idp_1');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('身份认证失败'));
    expect(stdoutSpy).not.toHaveBeenCalled();
  });
});
