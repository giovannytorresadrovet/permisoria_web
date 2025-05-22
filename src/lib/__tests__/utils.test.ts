import { cn } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should combine class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', undefined)).toBe('foo');
      expect(cn('foo', null)).toBe('foo');
      expect(cn('foo', true && 'bar')).toBe('foo bar');
      expect(cn('foo', false && 'bar')).toBe('foo');
    });

    it('should handle conditional classes', () => {
      const condition = true;
      expect(cn('foo', condition && 'bar')).toBe('foo bar');
      expect(cn('foo', !condition && 'bar')).toBe('foo');
    });

    it('should handle object notation', () => {
      expect(cn('foo', { bar: true })).toBe('foo bar');
      expect(cn('foo', { bar: false })).toBe('foo');
      expect(cn({ foo: true, bar: false })).toBe('foo');
      expect(cn({ foo: true, bar: true })).toBe('foo bar');
    });

    it('should merge Tailwind CSS classes correctly', () => {
      // Tailwind merges classes with the same utility
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
      expect(cn('p-4', 'p-8')).toBe('p-8');
      
      // Different utilities should remain
      expect(cn('p-4', 'm-4')).toBe('p-4 m-4');
      
      // Complex combinations
      expect(cn('p-4 m-2', 'p-8')).toBe('m-2 p-8');
      expect(cn('flex items-center', 'grid')).toBe('items-center grid');
    });
  });
}); 