export class Timer {

  private start = new Date();
  private end: Date | undefined;

  public stop(): Timer {
    if (!this.end) {
      this.end = new Date();
    }
    return this;
  }

  public duration(): number {
    return (this.end || new Date()).getTime() - this.start.getTime();
  }

  public time(): string {
    const duration = this.duration();
    if (duration > 1000) {
      return `${duration / 1000} s`;
    }
    return `${duration} ms`;
  }

  public toString(): string {
    return this.time();
  }

}
