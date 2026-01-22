import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

// Mock Firebase auth
vi.mock("../../firebase/auth", () => ({
  auth: {},
  onAuthStateChanged: (auth, callback) => {
    setTimeout(() => callback({ uid: "123" }), 0); // Simulate authenticated user
    return () => {};
  },
}));

import ProtectedRoute from "../ProtectedRoute";

describe("ProtectedRoute", () => {
  it("renders children if authenticated", async () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    // Wait for loading to finish and children to appear
    await waitFor(() =>
      expect(screen.getByText(/protected content/i)).toBeInTheDocument()
    );
  });
});