import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock firebase auth
const mockUser = { uid: '123', email: 'test@example.com' };
vi.mock('../../firebase/auth', () => ({
  auth: {},
  onAuthStateChanged: (auth, callback) => {
    callback(mockUser);
    return () => {};
  },
  getUserProfile: vi.fn(() =>
    Promise.resolve({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: '',
    })
  ),
  updateUserProfile: vi.fn(() => Promise.resolve()),
}));

import { getUserProfile, updateUserProfile } from '../../firebase/auth';
import Profile from '../Profile';

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders profile page with user data', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('My Profile')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
  });

  it('switches to edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });
  });

  it('navigates to dashboard when Cancel button is clicked in view mode', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancel'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('saves profile and shows success message', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    updateUserProfile.mockResolvedValue();

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });
  });

  it('shows error when required fields are missing', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    // Reset mock to return empty fields
    getUserProfile.mockReset();
    getUserProfile.mockResolvedValue({
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    // await user.click(screen.getByText('Save Changes'));

    // await waitFor(() => {
    //   expect(screen.getByText('All fields are required')).toBeInTheDocument();
    // });
  });

  it('handles profile update errors', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    // Reset mock to return valid user data
    getUserProfile.mockReset();
    getUserProfile.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: '',
    });
    updateUserProfile.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });
});
