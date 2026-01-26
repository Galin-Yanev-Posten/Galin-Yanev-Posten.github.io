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
  signIn: vi.fn(),
  getUserProfile: vi.fn(),
}));

import { getUserProfile, signIn } from '../../firebase/auth';
import Login from '../Login';

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Enter your login details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('allows typing in email and password fields', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your e-mail');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ user: { uid: '123', email: 'test@example.com' } });
    getUserProfile.mockResolvedValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      avatar: '',
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    signIn.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('navigates to signup page when Sign Up button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('stores user data in localStorage when profile exists', async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ user: { uid: '123', email: 'test@example.com' } });
    getUserProfile.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: 'avatar-url',
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      expect(storedData.firstName).toBe('John');
      expect(storedData.lastName).toBe('Doe');
    });
  });

  it('stores fallback user data when profile does not exist', async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ user: { uid: '123', email: 'test@example.com' } });
    getUserProfile.mockResolvedValue(null);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Enter your e-mail'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      expect(storedData.email).toBe('test@example.com');
      expect(storedData.firstName).toBe('');
    });
  });
});
