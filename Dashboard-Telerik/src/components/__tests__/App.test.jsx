import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Use vi.hoisted to create a mutable mock state
const mockAuth = vi.hoisted(() => ({ isAuthenticated: false }));

vi.mock('../../hooks/useAuth', () => ({
  default: () => mockAuth
}));

import App from '../../App';

describe('App', () => {
  beforeEach(() => {
    mockAuth.isAuthenticated = false;
    // Reset hash location before each test
    window.location.hash = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('renders login page if not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/enter your login details/i)).toBeInTheDocument();
  });

  it('redirects to dashboard if authenticated and visiting /login', () => {
    mockAuth.isAuthenticated = true;
    render(<App />);
    // App uses HashRouter internally, so it will render based on isAuthenticated
    // When authenticated, login route redirects to dashboard
    // Check that login form is NOT present (user was redirected)
    expect(screen.queryByText(/enter your login details/i)).not.toBeInTheDocument();
  });

  it('redirects / to /login', () => {
    render(<App />);
    expect(screen.getByText(/enter your login details/i)).toBeInTheDocument();
  });
});