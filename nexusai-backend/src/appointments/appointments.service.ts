import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/appointments.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

@Injectable()
export class AppointmentsService {
  findAll(user: any, query?: { status?: string; patientId?: string; doctorId?: string }): any[] {
    let appointments = readData();
    if (user.role === 'patient') {
      appointments = appointments.filter((a) => a.patientId === user.id);
    }
    if (query?.status) appointments = appointments.filter((a) => a.status === query.status);
    if (query?.patientId && user.role === 'admin') appointments = appointments.filter((a) => a.patientId === query.patientId);
    if (query?.doctorId) appointments = appointments.filter((a) => a.doctorId === query.doctorId);
    return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findOne(id: string, user: any): any {
    const apt = readData().find((a) => a.id === id);
    if (!apt) throw new NotFoundException(`Appointment ${id} not found`);
    if (user.role === 'patient' && apt.patientId !== user.id) throw new ForbiddenException();
    return apt;
  }

  create(dto: any, user: any): any {
    const appointments = readData();
    const newApt = {
      id: `apt-${uuidv4().slice(0, 8)}`,
      patientId: user.role === 'patient' ? user.id : dto.patientId,
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appointments.push(newApt);
    writeData(appointments);
    return newApt;
  }

  updateStatus(id: string, status: string, user: any): any {
    const appointments = readData();
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Appointment ${id} not found`);
    if (user.role === 'patient') {
      if (appointments[idx].patientId !== user.id) throw new ForbiddenException();
      if (!['cancelled'].includes(status)) throw new ForbiddenException('Patients can only cancel appointments');
    }
    appointments[idx] = { ...appointments[idx], status, updatedAt: new Date().toISOString() };
    writeData(appointments);
    return appointments[idx];
  }

  remove(id: string, user: any): void {
    const appointments = readData();
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException(`Appointment ${id} not found`);
    if (user.role !== 'admin') throw new ForbiddenException();
    appointments.splice(idx, 1);
    writeData(appointments);
  }

  getStats(): any {
    const appointments = readData();
    const today = new Date().toISOString().split('T')[0];
    return {
      total: appointments.length,
      today: appointments.filter((a) => a.date === today).length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };
  }
}
