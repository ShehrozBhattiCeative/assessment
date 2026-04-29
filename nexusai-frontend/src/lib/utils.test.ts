import { cn, formatPrice, formatDate, truncate, slugify, getInitials } from './utils';

describe('cn - class merging', () => {
  it('merges simple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'skip', 'include')).toBe('base include');
  });
  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
  });
  it('handles undefined/null gracefully', () => {
    expect(cn(undefined, null as any, 'valid')).toBe('valid');
  });
});

describe('formatPrice', () => {
  it('formats a round number', () => {
    expect(formatPrice(1500)).toBe('₹1,500');
  });
  it('formats a large number with commas', () => {
    expect(formatPrice(8000)).toBe('₹8,000');
  });
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
});

describe('truncate', () => {
  it('returns full string when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates with ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });
  it('returns exact-length string without ellipsis', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('replaces special characters', () => {
    expect(slugify('How to maintain bone & joint health')).toBe('how-to-maintain-bone-joint-health');
  });
  it('removes leading/trailing dashes', () => {
    expect(slugify(' test ')).toBe('test');
  });
});

describe('getInitials', () => {
  it('gets initials from full name', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
  });
  it('handles single name', () => {
    expect(getInitials('Admin')).toBe('AD');
  });
  it('handles long name - takes first two words only', () => {
    expect(getInitials('Dr. Harshil Patel Singh')).toBe('DH');
  });
});
