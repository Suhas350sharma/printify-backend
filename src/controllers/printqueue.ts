import { printFile } from "./cups";
type PrintJob = {
  filePath: string;
  options: {
    copies: number;
    colorMode: string;
    duplex: string;
    paperSize: number;
  };
};

class PrintQueue {
  private queue: PrintJob[] = [];
  private isProcessing = false;

  public enqueue(job: PrintJob): void {
    this.queue.push(job);
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift()!;

    try {
      await printFile(job.filePath, job.options);
    } catch (error) {
      console.error('Failed job:', job.filePath, error);
    } finally {
      this.isProcessing = false;
      this.processNext(); // Process next job
    }
  }
}

export const printQueue = new PrintQueue();