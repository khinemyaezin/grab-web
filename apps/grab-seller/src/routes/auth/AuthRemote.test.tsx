import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthRemote, LoginRedirectPage } from "./AuthRemote";
import * as AuthContextModule from "../../app/AuthContext";

describe("LoginRedirectPage / AuthRemote", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      login: mockLogin,
    } as unknown as ReturnType<typeof AuthContextModule.useAuth>);
  });

  it("calls login() from auth context on mount and displays redirect status", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(<LoginRedirectPage />);

    expect(screen.getByRole("status")).toHaveTextContent("Redirecting to login…");

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  it("displays an error message when login rejects", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Login failed"));

    render(<AuthRemote />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to initiate login redirect.");
    });
  });
});
