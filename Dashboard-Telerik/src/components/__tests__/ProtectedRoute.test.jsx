import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted to create a mutable mock user state
const mockUser = vi.hoisted(() => ({ value: { uid: "123" } }));

// Mock Firebase auth
vi.mock("../../firebase/auth", () => ({
  auth: {},
  onAuthStateChanged: (auth, callback) => {
    setTimeout(() => callback(mockUser.value), 0);
    return () => {};
  },
}));

import ProtectedRoute from "../ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUser.value = { uid: "123" }; // Reset to authenticated
  });

  it("renders children if authenticated", async () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText(/protected content/i)).toBeInTheDocument()
    );
  });

  it("redirects to /login if not authenticated", async () => {
    mockUser.value = null; // Simulate no user
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    await waitFor(() => {
      // Should not find the protected content
      expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });
  });
});