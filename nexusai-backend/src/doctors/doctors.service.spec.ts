import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import * as fs from 'fs';

jest.mock('fs');

const mockDoctors = [
  {
    id: 'doc-001',
    name: 'Dr. Harshil Patel',
    specialty: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    departmentId: 'dept-001',
    experience: 18,
    isActive: true,
    rating: 4.8,
    totalPatients: 3200,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'doc-002',
    name: 'Dr. Riya Sharma',
    specialty: 'Neurology',
    qualification: 'MBBS, MD, DM (Neurology)',
    departmentId: 'dept-002',
    experience: 14,
    isActive: true,
    rating: 4.9,
    totalPatients: 2800,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('DoctorsService', () => {
  let service: DoctorsService;
  const readFileSyncMock = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
  const writeFileSyncMock = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorsService],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockDoctors) as any);
    writeFileSyncMock.mockImplementation(() => undefined);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('returns all doctors when no filters', () => {
      const result = service.findAll();
      expect(result).toHaveLength(2);
    });

    it('filters by specialty (case-insensitive)', () => {
      const result = service.findAll({ specialty: 'cardiology' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('doc-001');
    });

    it('filters by departmentId', () => {
      const result = service.findAll({ departmentId: 'dept-002' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('doc-002');
    });

    it('filters by search term matching name', () => {
      const result = service.findAll({ search: 'Riya' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('doc-002');
    });

    it('filters by search term matching specialty', () => {
      const result = service.findAll({ search: 'neuro' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('doc-002');
    });

    it('returns empty array when no match', () => {
      const result = service.findAll({ search: 'nonexistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('returns a doctor by id', () => {
      const result = service.findOne('doc-001');
      expect(result.name).toBe('Dr. Harshil Patel');
    });

    it('throws NotFoundException for missing id', () => {
      expect(() => service.findOne('doc-999')).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a new doctor with defaults', () => {
      const dto = {
        name: 'Dr. New Doctor',
        specialty: 'Dermatology',
        qualification: 'MBBS, MD',
        departmentId: 'dept-003',
      };
      const result = service.create(dto);
      expect(result.id).toMatch(/^doc-/);
      expect(result.isActive).toBe(true);
      expect(result.rating).toBe(5.0);
      expect(result.totalPatients).toBe(0);
      expect(result.name).toBe('Dr. New Doctor');
      expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('updates an existing doctor', () => {
      const result = service.update('doc-001', { experience: 20 });
      expect(result.experience).toBe(20);
      expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
    });

    it('throws NotFoundException for missing id', () => {
      expect(() => service.update('doc-999', {})).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes a doctor by id', () => {
      service.remove('doc-001');
      expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
      const written = JSON.parse((writeFileSyncMock.mock.calls[0][1] as string));
      expect(written.find((d: any) => d.id === 'doc-001')).toBeUndefined();
    });

    it('throws NotFoundException for missing id', () => {
      expect(() => service.remove('doc-999')).toThrow(NotFoundException);
    });
  });
});
