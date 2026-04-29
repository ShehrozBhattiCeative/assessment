import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/testimonials.json');

@Injectable()
export class TestimonialsService {
  findAll() {
    try {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')).filter((t: any) => t.isActive);
    } catch { return []; }
  }
}
