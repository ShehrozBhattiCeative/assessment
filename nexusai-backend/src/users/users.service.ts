import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/users.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class UsersService {
  findAll(query?: { role?: string; search?: string }) {
    let users = readData().map(({ password: _, ...u }) => u);
    if (query?.role) users = users.filter((u) => u.role === query.role);
    if (query?.search) {
      const s = query.search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    return users;
  }

  findOne(id: string) {
    const user = readData().find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const { password: _, ...result } = user;
    return result;
  }

  update(id: string, dto: any) {
    const users = readData();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException(`User ${id} not found`);
    users[idx] = { ...users[idx], ...dto, updatedAt: new Date().toISOString() };
    writeData(users);
    const { password: _, ...result } = users[idx];
    return result;
  }

  remove(id: string) {
    const users = readData();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException(`User ${id} not found`);
    users.splice(idx, 1);
    writeData(users);
  }

  getDashboardStats() {
    const users = readData();
    const patients = users.filter((u) => u.role === 'patient');
    let apts: any[] = [];
    try {
      const aptsPath = path.join(__dirname, '../../src/data/appointments.json');
      apts = JSON.parse(fs.readFileSync(aptsPath, 'utf-8'));
    } catch {}
    const today = new Date().toISOString().split('T')[0];
    const totalRevenue = apts.filter((a) => a.status === 'completed').reduce((sum, a) => sum + (a.fee || 0), 0);
    return {
      totalPatients: patients.length,
      appointmentsToday: apts.filter((a) => a.date === today).length,
      totalDoctors: 10,
      totalRevenue,
      recentAppointments: apts.slice(0, 5),
    };
  }
}
