import * as fs from 'fs';
import * as path from 'path';

export class TestDataLoader {
  private static readonly dataDir = path.resolve(__dirname, '../data');

  static loadJson<T>(filename: string): T {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) throw new Error(`Test data not found: ${filePath}`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  }

  static uniqueSuffix(): string { return Date.now().toString(36).toUpperCase(); }
}