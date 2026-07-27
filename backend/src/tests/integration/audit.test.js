'use strict';

jest.mock('../../services/audit.service', () => ({
  auditPage: jest.fn(),
}));

const request = require('supertest');
const app = require('../../app');
const auditService = require('../../services/audit.service');

const createServiceError = (code, status, message) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

describe('POST /api/v1/audit', () => {
  beforeEach(() => {
    auditService.auditPage.mockReset();
  });

  test('returns the standardized success payload for a completed audit', async () => {
    auditService.auditPage.mockResolvedValue({
      status: 200,
      responseTime: '312ms',
      title: 'Example Domain',
      metaDescription: 'Example description',
      h1Count: 1,
      imagesWithoutAlt: 2,
      wordCount: 964,
    });

    const response = await request(app)
      .post('/api/v1/audit')
      .send({ url: 'https://8.8.8.8' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: 200,
        responseTime: '312ms',
        title: 'Example Domain',
        metaDescription: 'Example description',
        h1Count: 1,
        imagesWithoutAlt: 2,
        wordCount: 964,
      },
    });
    expect(auditService.auditPage).toHaveBeenCalledWith('https://8.8.8.8');
  });

  test('rejects an invalid URL before it reaches the audit service', async () => {
    const response = await request(app)
      .post('/api/v1/audit')
      .send({ url: 'ftp://example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      code: 'INVALID_URL',
      message: 'Please provide a valid HTTP or HTTPS URL.',
    });
    expect(auditService.auditPage).not.toHaveBeenCalled();
  });

  test.each([
    ['NOT_FOUND', 404, 'The requested webpage could not be found.'],
    ['UNSUPPORTED_CONTENT', 415, 'The provided URL does not return an HTML document.'],
    ['TIMEOUT', 504, 'The request to the target website timed out.'],
  ])('returns the standardized %s service failure', async (code, status, message) => {
    auditService.auditPage.mockRejectedValue(createServiceError(code, status, message));

    const response = await request(app)
      .post('/api/v1/audit')
      .send({ url: 'https://8.8.8.8' });

    expect(response.status).toBe(status);
    expect(response.body).toEqual({
      success: false,
      code,
      message,
    });
  });

  test('converts unexpected service failures to the internal-server-error contract', async () => {
    auditService.auditPage.mockRejectedValue(new Error('Unexpected dependency failure'));

    const response = await request(app)
      .post('/api/v1/audit')
      .send({ url: 'https://8.8.8.8' });

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
    });
    expect(response.body.stack).toBeUndefined();
  });
});
