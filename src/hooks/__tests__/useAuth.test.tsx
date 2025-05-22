import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user-id' } } }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockImplementation((callback) => {
        callback('SIGNED_IN', { user: { id: 'test-user-id' } });
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      })
    }
  })
}));

// Mock auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    session: { user: { id: 'test-user-id' } },
    isLoading: false,
    error: null,
    setUserSession: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
    clearUser: jest.fn()
  })
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('useAuth Hook', () => {
  it('provides user information', () => {
    const { result } = renderHook(() => useAuth());
    
    // User should be available from the store
    expect(result.current.user).toEqual({ id: 'test-user-id', email: 'test@example.com' });
    expect(result.current.session).toBeTruthy();
  });

  it('provides signInWithPassword method that works correctly', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Call signInWithPassword method
    await act(async () => {
      const signInResult = await result.current.signInWithPassword('test@example.com', 'password');
      expect(signInResult.error).toBeNull();
      expect(signInResult.data).toBeTruthy();
    });
  });

  it('provides signOut method that works correctly', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Call signOut method
    await act(async () => {
      const signOutResult = await result.current.signOut();
      expect(signOutResult.error).toBeNull();
    });
  });

  it('provides signUp method', async () => {
    const { result } = renderHook(() => useAuth());
    
    // SignUp method should be available
    expect(typeof result.current.signUp).toBe('function');
  });

  it('exposes loading state', () => {
    // Mock the loading state
    jest.spyOn(require('@/stores/authStore'), 'useAuthStore').mockReturnValueOnce({
      user: null,
      session: null,
      isLoading: true,
      error: null,
      setUserSession: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearUser: jest.fn()
    });
    
    const { result } = renderHook(() => useAuth());
    
    // Loading state should be exposed
    expect(result.current.isLoading).toBe(true);
  });

  it('exposes error state', () => {
    // Mock the error state
    jest.spyOn(require('@/stores/authStore'), 'useAuthStore').mockReturnValueOnce({
      user: null,
      session: null,
      isLoading: false,
      error: new Error('Auth error'),
      setUserSession: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      clearUser: jest.fn()
    });
    
    const { result } = renderHook(() => useAuth());
    
    // Error state should be exposed
    expect(result.current.error).toEqual(new Error('Auth error'));
  });
}); 