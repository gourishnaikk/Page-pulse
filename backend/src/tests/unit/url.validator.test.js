'use strict';

jest.mock('dns', () => ({
  promises: {
    lookup: jest.fn(),
  },
}));

const dns = require('dns').promises;
const { isPrivateOrLoopbackIp, validateUrl } = require('../../validators/url.validator');

const runValidation = async (body) => {
  const next = jest.fn();

  await validateUrl({ body }, {}, next);

  return next;
};

describe('isPrivateOrLoopbackIp', () => {
  test.each([
    ['IPv6 loopback', '::1', true],
    ['expanded IPv6 loopback', '0:0:0:0:0:0:0:1', true],
    ['IPv4-mapped loopback', '::ffff:127.0.0.1', true],
    ['IPv4 loopback range', '127.12.0.1', true],
    ['zero range', '0.1.2.3', true],
    ['10 private range', '10.1.2.3', true],
    ['172 private range', '172.16.0.1', true],
    ['192 private range', '192.168.1.1', true],
    ['link-local range', '169.254.1.1', true],
    ['public IPv4 address', '8.8.8.8', false],
    ['public IPv6 address', '2001:4860:4860::8888', false],
  ])('returns %s result', (_name, address, expected) => {
    expect(isPrivateOrLoopbackIp(address)).toBe(expected);
  });
});

describe('validateUrl', () => {
  beforeEach(() => {
    dns.lookup.mockReset();
  });

  test.each([
    undefined,
    {},
    { url: '' },
    { url: '  ' },
    { url: 123 },
    { url: 'not-a-url' },
    { url: 'ftp://example.com' },
    { url: 'http://localhost' },
    { url: 'http://127.0.0.1' },
    { url: 'http://10.0.0.1' },
    { url: 'http://172.20.0.1' },
    { url: 'http://192.168.1.1' },
    { url: 'http://169.254.1.1' },
  ])('forwards invalid and unsafe URLs to centralized error handling', async (body) => {
    const next = await runValidation(body);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toMatchObject({
      code: 'INVALID_URL',
      message: 'Please provide a valid HTTP or HTTPS URL.',
    });
  });

  test('forwards hostnames resolving to private addresses as invalid URLs', async () => {
    dns.lookup.mockResolvedValue([{ address: '192.168.1.20', family: 4 }]);

    const next = await runValidation({ url: 'https://internal.example' });

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_URL' }));
  });

  test('allows a public hostname through after DNS validation', async () => {
    dns.lookup.mockResolvedValue([{ address: '8.8.8.8', family: 4 }]);

    const next = await runValidation({ url: '  https://example.com/path  ' });

    expect(dns.lookup).toHaveBeenCalledWith('example.com', { all: true });
    expect(next).toHaveBeenCalledWith();
  });

  test('allows a public direct IP address through without DNS resolution', async () => {
    const next = await runValidation({ url: 'https://8.8.8.8' });

    expect(dns.lookup).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test('allows DNS lookup failures to be handled by the audit service', async () => {
    dns.lookup.mockRejectedValue(new Error('DNS lookup failed'));

    const next = await runValidation({ url: 'https://missing.example' });

    expect(next).toHaveBeenCalledWith();
  });
});
