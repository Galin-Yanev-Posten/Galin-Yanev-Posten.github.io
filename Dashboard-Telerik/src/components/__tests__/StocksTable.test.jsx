import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import stocksReducer from '../../store/stocksSlice';
import StocksTable from '../StocksList/StocksTable';

// Mock react-redux before importing StocksTable
// Do not mock react-redux globally; only mock for specific tests if needed.

// Mock MonthlyChart to avoid rendering the real chart
vi.mock('../MonthlyChart/MonthlyChart', () => ({
  default: () => <div>MonthlyChartMock</div>,
}));

describe('StocksTable', () => {
  function renderWithStore(ui) {
    const store = configureStore({ reducer: { stocks: stocksReducer } });
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it('renders table headers and stocks', () => {
    renderWithStore(<StocksTable />);
    expect(screen.getByText('Symbol')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('sorts by Symbol, Price, and Volume when headers are clicked', async () => {
    renderWithStore(<StocksTable />);

    // Symbol sort
    const symbolHeader = screen.getByText('Symbol');
    await userEvent.click(symbolHeader);
    let rows = screen.getAllByRole('row');
    // First data row after header
    expect(rows[1]).toHaveTextContent('AAPL');
    await userEvent.click(symbolHeader); // Descending
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('TSLA');

    // Price sort
    const priceHeader = screen.getByText('Price');
    await userEvent.click(priceHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('NVDA'); // lowest price
    await userEvent.click(priceHeader); // Descending
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('MSFT'); // highest price

    // Volume sort
    const volumeHeader = screen.getByText('Volume');
    await userEvent.click(volumeHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('MSFT'); // lowest volume
    await userEvent.click(volumeHeader); // Descending
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('NVDA'); // highest volume
  });

  it('filters stocks by symbol using a real Redux store', async () => {
    const store = configureStore({
      reducer: { stocks: stocksReducer }
    });

    render(
      <Provider store={store}>
        <StocksTable />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Filter by symbol or name...');
    await userEvent.type(input, 'GOOGL');
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
    expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
    expect(screen.queryByText('NVDA')).not.toBeInTheDocument();
  });
});