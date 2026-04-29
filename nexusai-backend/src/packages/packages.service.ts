import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/health-packages.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class PackagesService {
  findAll() { return readData().filter((p) => p.isActive); }
  findAllAdmin() { return readData(); }
  findOne(id: string) {
    const pkg = readData().find((p) => p.id === id);
    if (!pkg) throw new NotFoundException(`Package ${id} not found`);
    return pkg;
  }
  create(dto: any) {
    const pkgs = readData();
    const newPkg = { id: `pkg-${uuidv4().slice(0, 8)}`, ...dto, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    pkgs.push(newPkg);
    writeData(pkgs);
    return newPkg;
  }
  update(id: string, dto: any) {
    const pkgs = readData();
    const idx = pkgs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Package ${id} not found`);
    pkgs[idx] = { ...pkgs[idx], ...dto, updatedAt: new Date().toISOString() };
    writeData(pkgs);
    return pkgs[idx];
  }
  remove(id: string) {
    const pkgs = readData();
    const idx = pkgs.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Package ${id} not found`);
    pkgs.splice(idx, 1);
    writeData(pkgs);
  }
}
