export class RefreshCoordinator {
  private inFlight: Promise<void> | null = null;

  run(task: () => Promise<void>): Promise<void> {
    if (!this.inFlight) {
      this.inFlight = task().finally(() => {
        this.inFlight = null;
      });
    }

    return this.inFlight;
  }
}
