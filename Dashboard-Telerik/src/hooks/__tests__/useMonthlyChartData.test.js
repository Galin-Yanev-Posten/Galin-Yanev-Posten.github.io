import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMonthlyChartData } from '../useMonthlyChartData';

// Mock the alphaVantage service
vi.mock('../../services/alphaVantage', () => ({
  fetchMonthlyData: vi.fn(),
}));

import { fetchMonthlyData } from '../../services/alphaVantage';

describe('useMonthlyChartData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty chartData and loading false when no symbol is selected', () => {
    const { result } = renderHook(() => useMonthlyChartData(null));
    expect(result.current.chartData).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('fetches and transforms data when a symbol is provided', async () => {
    const mockData = {
      '2024-01-31': { '4. close': '150.00', '2. high': '155.00', '3. low': '145.00' },
      '2024-02-29': { '4. close': '160.00', '2. high': '165.00', '3. low': '155.00' },
    };
    fetchMonthlyData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useMonthlyChartData('AAPL', 12));

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMonthlyData).toHaveBeenCalledWith('AAPL');
    expect(result.current.chartData).toEqual([
      { date: '2024-01-31', price: 150, high: 155, low: 145 },
      { date: '2024-02-29', price: 160, high: 165, low: 155 },
    ]);
  });

  it('handles fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMonthlyData.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useMonthlyChartData('AAPL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error loading chart data:', expect.any(Error));
    expect(result.current.chartData).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('returns empty chartData when fetchMonthlyData returns null', async () => {
    fetchMonthlyData.mockResolvedValue(null);

    const { result } = renderHook(() => useMonthlyChartData('AAPL'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.chartData).toEqual([]);
  });

  it('slices data to the specified monthsBack', async () => {
    const mockData = {
      '2024-01-31': { '4. close': '100.00', '2. high': '105.00', '3. low': '95.00' },
      '2024-02-29': { '4. close': '110.00', '2. high': '115.00', '3. low': '105.00' },
      '2024-03-31': { '4. close': '120.00', '2. high': '125.00', '3. low': '115.00' },
    };
    fetchMonthlyData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useMonthlyChartData('AAPL', 2));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only return the last 2 months
    expect(result.current.chartData).toHaveLength(2);
    expect(result.current.chartData[0].date).toBe('2024-02-29');
    expect(result.current.chartData[1].date).toBe('2024-03-31');
  });
});
