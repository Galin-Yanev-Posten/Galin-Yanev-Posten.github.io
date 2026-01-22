import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileView from "../../components/Profile/ProfileView";

describe("ProfileView", () => {
  it("renders user info", () => {
    render(
      <ProfileView
        formData={{
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          avatar: ""
        }}
        onEdit={() => {}}
      />
    );
    expect(screen.getAllByText(/alice/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/smith/i)).toBeInTheDocument();
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
  });
});