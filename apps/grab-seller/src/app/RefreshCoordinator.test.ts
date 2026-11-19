import { describe, expect, it, vi } from "vitest";
import { RefreshCoordinator } from "./RefreshCoordinator";

describe("RefreshCoordinator", () => {
  it("shares one in-flight promise across concurrent callers", async () => {
    const coordinator = new RefreshCoordinator();
    let resolveTask: (() => void) | undefined;
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveTask = resolve;
        }),
    );

    const first = coordinator.run(task);
    const second = coordinator.run(task);

    expect(first).toBe(second);
    expect(task).toHaveBeenCalledTimes(1);

    resolveTask?.();
    await Promise.all([first, second]);
  });

  it("starts a new task after the previous one settles", async () => {
    const coordinator = new RefreshCoordinator();
    const task = vi.fn().mockResolvedValue(undefined);

    await coordinator.run(task);
    await coordinator.run(task);

    expect(task).toHaveBeenCalledTimes(2);
  });

  it("resets after a rejected task so a retry can run", async () => {
    const coordinator = new RefreshCoordinator();
    const failing = vi.fn().mockRejectedValueOnce(new Error("refresh failed"));
    const succeeding = vi.fn().mockResolvedValue(undefined);

    await expect(coordinator.run(failing)).rejects.toThrow("refresh failed");
    await expect(coordinator.run(succeeding)).resolves.toBeUndefined();

    expect(succeeding).toHaveBeenCalledTimes(1);
  });
});
