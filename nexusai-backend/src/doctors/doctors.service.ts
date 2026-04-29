import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/doctors.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class DoctorsService {
  findAll(query?: { specialty?: string; search?: string; departmentId?: string }): any[] {
    let doctors = readData();
    if (query?.specialty) {
      doctors = doctors.filter((d) => d.specialty.toLowerCase().includes(query.specialty!.toLowerCase()));
    }
    if (query?.departmentId) {
      doctors = doctors.filter((d) => d.departmentId === query.departmentId);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      doctors = doctors.filter(
        (d) => d.name.toLowerCase().includes(s) || d.specialty.toLowerCase().includes(s) || d.qualification.toLowerCase().includes(s),
      );
    }
    return doctors;
  }

  findOne(id: string): any {
    const doctor = readData().find((d) => d.id === id);
    if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
    return doctor;
  }

  create(dto: any): any {
    const doctors = readData();
    const newDoctor = {
      id: `doc-${uuidv4().slice(0, 8)}`,
      ...dto,
      isActive: true,
      rating: 5.0,
      totalPatients: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    doctors.push(newDoctor);
    writeData(doctors);
    return newDoctor;
  }

  update(id: string, dto: any): any {
    const doctors = readData();
    const idx = doctors.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException(`Doctor ${id} not found`);
    doctors[idx] = { ...doctors[idx], ...dto, updatedAt: new Date().toISOString() };
    writeData(doctors);
    return doctors[idx];
  }

  remove(id: string): void {
    const doctors = readData();
    const idx = doctors.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException(`Doctor ${id} not found`);
    doctors.splice(idx, 1);
    writeData(doctors);
  }
}
