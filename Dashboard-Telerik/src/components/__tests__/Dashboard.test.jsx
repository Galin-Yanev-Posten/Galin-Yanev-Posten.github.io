import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../../pages/Dashboard";

// Mock StocksTable if needed
vi.mock("../../components/StocksList/StocksTable", () => ({
  default: () => <div>StocksTable</div>,
}));

describe("Dashboard", () => {
  it("renders the dashboard header", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard app/i)).toBeInTheDocument();
  });

  it("renders the StocksTable component", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/StocksTable/i)).toBeInTheDocument();
  });
});