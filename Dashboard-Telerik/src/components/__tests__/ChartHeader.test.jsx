import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChartHeader from '../MonthlyChart/ChartHeader';

describe('ChartHeader', () => {
  it('renders the selected symbol and subtitle', () => {
    render(
      <ChartHeader selectedSymbol="AAPL" monthsBack={6} setMonthsBack={() => {}} />
    );
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Monthly Price Movement')).toBeInTheDocument();
  });

  it('renders all month buttons and highlights the selected one', () => {
    render(
      <ChartHeader selectedSymbol="AAPL" monthsBack={12} setMonthsBack={() => {}} />
    );
    [3, 6, 12, 24].forEach((months) => {
      expect(screen.getByText(`${months}M`)).toBeInTheDocument();
    });
    const selectedButton = screen.getByText('12M');
    expect(selectedButton).toHaveClass('bg-black');
  });

  it('calls setMonthsBack when a button is clicked', () => {
    const setMonthsBack = vi.fn();
    render(
      <ChartHeader selectedSymbol="AAPL" monthsBack={3} setMonthsBack={setMonthsBack} />
    );
    const button = screen.getByText('6M');
    fireEvent.click(button);
    expect(setMonthsBack).toHaveBeenCalledWith(6);
  });
});
