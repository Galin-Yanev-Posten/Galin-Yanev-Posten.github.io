import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingMessage from '../LoadingMessage';

describe('LoadingMessage', () => {
  it('renders with default message', () => {
    render(<LoadingMessage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingMessage message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
