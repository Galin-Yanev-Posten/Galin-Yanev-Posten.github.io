import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock firebase/auth
const mockSignOut = vi.fn(() => Promise.resolve());
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: (auth, callback) => {
    callback({ uid: '123' });
    return () => {};
  },
}));

// Mock firebase auth module
vi.mock('../../firebase/auth', () => ({
  getUserProfile: vi.fn(() =>
    Promise.resolve({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: '',
    })
  ),
}));

// Mock StocksTable
vi.mock('../../components/StocksList/StocksTable', () => ({
  default: () => <div data-testid="stocks-table">StocksTable</div>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders Dashboard with header and StocksTable', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard app')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
    expect(screen.getByTestId('stocks-table')).toBeInTheDocument();
  });

  it('displays user initials when no avatar is present', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('navigates to profile when Profile button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('falls back to localStorage when profile fetch fails', async () => {
    const { getUserProfile } = await import('../../firebase/auth');
    getUserProfile.mockRejectedValueOnce(new Error('Fetch failed'));
    
    localStorage.setItem('userData', JSON.stringify({
      firstName: 'Local',
      lastName: 'User',
      avatar: '',
    }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('LU')).toBeInTheDocument();
    });
  });
});
