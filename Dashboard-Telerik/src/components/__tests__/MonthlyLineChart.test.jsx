
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MonthlyLineChart from '../MonthlyChart/MonthlyLineChart';

// Mock ResponsiveContainer from recharts for Vitest
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

describe('MonthlyLineChart', () => {
  it('renders without crashing with empty data', () => {
    const { container } = render(<MonthlyLineChart chartData={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders a line chart with data', () => {
    const chartData = [
      { date: '2025-01', price: 100 },
      { date: '2025-02', price: 110 },
    ];
    const { container } = render(<MonthlyLineChart chartData={chartData} />);
    expect(container).toBeInTheDocument();
  });
});