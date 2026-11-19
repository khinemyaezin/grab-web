import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "./UserMenu";
import type { User } from "@khinemyaezin/seller-contracts";

describe("UserMenu", () => {
  const mockUser: User = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://avatar.test/pic.png",
    accessContexts: [],
  };

  it("renders trigger and displays user details and logout option when opened", () => {
    const handleLogout = vi.fn();
    render(
      <UserMenu
        user={mockUser}
        onLogout={handleLogout}
        trigger={<button>User Profile</button>}
      />,
    );

    const trigger = screen.getByRole("button", { name: "User Profile" });
    expect(trigger).toBeInTheDocument();

    fireEvent.pointerDown(trigger);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    const logoutItem = screen.getByRole("menuitem", { name: /log out/i });
    expect(logoutItem).toBeInTheDocument();

    fireEvent.click(logoutItem);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
