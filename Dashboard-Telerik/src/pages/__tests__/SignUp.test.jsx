import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
vi.mock('../../firebase/auth', () => ({
  signUp: vi.fn(),
  getUserProfile: vi.fn(),
}));

import { getUserProfile, signUp } from '../../firebase/auth';
import SignUp from '../SignUp';

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders signup form', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('allows filling in form fields', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');

    expect(screen.getByPlaceholderText('First Name')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('Doe');
  });

  it('shows error when emails do not match', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'different@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Emails do not match')).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'differentpassword');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), '12345');
    await user.type(screen.getByPlaceholderText('Confirm your password'), '12345');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('submits form and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValue({ uid: '123', email: 'john@example.com' });
    getUserProfile.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: '',
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('displays error message on signup failure', async () => {
    const user = userEvent.setup();
    signUp.mockRejectedValue(new Error('Email already in use'));

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('navigates to login page when Sign In button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('stores fallback user data when profile does not exist', async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValue({ uid: '123', email: 'john@example.com' });
    getUserProfile.mockResolvedValue(null);

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Confirm your email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      expect(storedData.firstName).toBe('John');
      expect(storedData.lastName).toBe('Doe');
    });
  });
});
