import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/departments.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2)); }

@Injectable()
export class DepartmentsService {
  findAll() { return readData().filter((d) => d.isActive); }
  findOne(id: string) {
    const dept = readData().find((d) => d.id === id);
    if (!dept) throw new NotFoundException(`Department ${id} not found`);
    return dept;
  }
  create(dto: any) {
    const depts = readData();
    const newDept = { id: `dept-${uuidv4().slice(0, 8)}`, ...dto, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    depts.push(newDept);
    writeData(depts);
    return newDept;
  }
  update(id: string, dto: any) {
    const depts = readData();
    const idx = depts.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException(`Department ${id} not found`);
    depts[idx] = { ...depts[idx], ...dto, updatedAt: new Date().toISOString() };
    writeData(depts);
    return depts[idx];
  }
  remove(id: string) {
    const depts = readData();
    const idx = depts.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException(`Department ${id} not found`);
    depts.splice(idx, 1);
    writeData(depts);
  }
}
