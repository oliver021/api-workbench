import chokidar from 'chokidar';
import { EventEmitter } from 'events';

export class SpecWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly debounceMs: number;

  constructor(debounceMs = 300) {
    super();
    this.debounceMs = debounceMs;
  }

  watch(filePath: string): void {
    this.unwatch();

    this.watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: true,
    });

    this.watcher.on('change', () => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.emit('change', filePath);
      }, this.debounceMs);
    });

    this.watcher.on('error', (err) => {
      this.emit('error', err);
    });
  }

  unwatch(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
