import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MonthlyChart from '../MonthlyChart/MonthlyChart';
import * as useMonthlyChartDataModule from '../../hooks/useMonthlyChartData';

vi.mock('../../hooks/useMonthlyChartData', () => ({
  useMonthlyChartData: () => ({ chartData: [{ date: '2025-01', price: 100 }], loading: false })
}));

vi.mock('../common/EmptyState', () => ({
  default: ({ message }) => <div>{message}</div>
}));

vi.mock('../common/LoadingMessage', () => ({
  default: ({ message }) => <div>{message}</div>
}));

vi.mock('./MonthlyLineChart', () => ({
  default: ({ chartData }) => <div>Chart: {Array.isArray(chartData) ? chartData.length : 0} points</div>
}));

describe('MonthlyChart', () => {
  it('shows EmptyState if no symbol is selected', () => {
    render(<MonthlyChart selectedSymbol={null} />);
    expect(screen.getByText('Select a stock to view monthly chart')).toBeInTheDocument();
  });

  it('shows LoadingMessage if loading', () => {
    const spy = vi.spyOn(useMonthlyChartDataModule, 'useMonthlyChartData').mockReturnValue({ chartData: [], loading: true });
    render(<MonthlyChart selectedSymbol="AAPL" />);
    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders chart header and month buttons when data is loaded', () => {
    render(<MonthlyChart selectedSymbol="AAPL" />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Monthly Price Movement')).toBeInTheDocument();
    [3, 6, 12, 24].forEach((months) => {
      expect(screen.getByText(`${months}M`)).toBeInTheDocument();
    });
  });
});
