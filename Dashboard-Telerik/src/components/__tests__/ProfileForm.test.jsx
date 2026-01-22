import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileForm from "../Profile/ProfileForm";

describe("ProfileForm", () => {
  it("renders form fields and calls onSave", () => {
    const onSave = vi.fn();
    render(
      <ProfileForm
        formData={{
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          avatar: ""
        }}
        onChange={() => {}}
        onSave={onSave}
        onCancel={() => {}}
        loading={false}
      />
    );
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Alice");
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalled();
  });

  it("renders avatar initials when no avatar and handles avatar change", () => {
    const onAvatarChange = vi.fn();
    render(
      <ProfileForm
        formData={{
          firstName: "Bob",
          lastName: "Brown",
          email: "bob@example.com",
          avatar: ""
        }}
        onChange={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onAvatarChange={onAvatarChange}
        loading={false}
      />
    );
    expect(screen.getByText("BB")).toBeInTheDocument();
    const fileInput = screen.getByLabelText(/avatar/i);
    fireEvent.change(fileInput, { target: { files: [new File(["avatar"], "avatar.png", { type: "image/png" })] } });
    expect(onAvatarChange).toHaveBeenCalled();
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <ProfileForm
        formData={{
          firstName: "Carol",
          lastName: "Clark",
          email: "carol@example.com",
          avatar: ""
        }}
        onChange={() => {}}
        onSave={() => {}}
        onCancel={onCancel}
        loading={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("disables Save button and shows loading text when loading", () => {
    render(
      <ProfileForm
        formData={{
          firstName: "Dan",
          lastName: "Davis",
          email: "dan@example.com",
          avatar: ""
        }}
        onChange={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        loading={true}
      />
    );
    const saveButton = screen.getByRole("button", { name: /saving/i });
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent("Saving...");
  });

  it("calls onChange when input fields are changed", () => {
    const onChange = vi.fn();
    render(
      <ProfileForm
        formData={{
          firstName: "Eve",
          lastName: "Evans",
          email: "eve@example.com",
          avatar: ""
        }}
        onChange={onChange}
        onSave={() => {}}
        onCancel={() => {}}
        loading={false}
      />
    );
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Eva" } });
    expect(onChange).toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Evanson" } });
    expect(onChange).toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "eva@new.com" } });
    expect(onChange).toHaveBeenCalled();
  });
});