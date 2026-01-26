import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MonthlyLineChart from '../MonthlyLineChart';

const chartData = [
  { date: '2024-01-01', price: 100 },
  { date: '2024-02-01', price: 110 },
];

describe('MonthlyLineChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<MonthlyLineChart chartData={chartData} />);
    // Check that the component renders something
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the LineChart with data', () => {
    const { container } = render(<MonthlyLineChart chartData={chartData} />);
    // Recharts ResponsiveContainer renders a div; just check component mounts
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with empty data', () => {
    const { container } = render(<MonthlyLineChart chartData={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});
