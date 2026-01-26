import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders with default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('Select a stock to view data')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<EmptyState message="No data available" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
