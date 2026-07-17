import { deriveClayType } from './deriveClayType';

describe('deriveClayType', () => {
  it('strips a trailing " - Kids" audience suffix', () => {
    expect(deriveClayType('Air-Dry Clay - Kids')).toBe('Air-Dry Clay');
  });

  it('strips a trailing " - Adults" audience suffix', () => {
    expect(deriveClayType('Ceramic Clay - Adults')).toBe('Ceramic Clay');
  });

  it('is case-insensitive for the audience suffix', () => {
    expect(deriveClayType('Ceramic Clay - adults')).toBe('Ceramic Clay');
    expect(deriveClayType('Air-Dry Clay - KIDS')).toBe('Air-Dry Clay');
  });

  it('keeps the title unchanged when there is no audience suffix', () => {
    expect(deriveClayType('Ceramic Clay')).toBe('Ceramic Clay');
  });

  it('only strips the suffix at the end, not internal hyphens', () => {
    expect(deriveClayType('Air-Dry Clay - Adults')).toBe('Air-Dry Clay');
  });

  it('returns an empty string for undefined/null/empty input', () => {
    expect(deriveClayType(undefined)).toBe('');
    expect(deriveClayType(null)).toBe('');
    expect(deriveClayType('')).toBe('');
  });
});
