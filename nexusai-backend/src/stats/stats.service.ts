import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/stats.json');

@Injectable()
export class StatsService {
  getStats() {
    try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return {}; }
  }
}
