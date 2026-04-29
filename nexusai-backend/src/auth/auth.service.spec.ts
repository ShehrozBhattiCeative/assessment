import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

jest.mock('fs');
jest.mock('bcrypt');

const hashedPassword = '$2b$10$mockedHashedPassword';

const mockUsers = [
  {
    id: 'usr-001',
    name: 'Admin User',
    email: 'admin@nexusai.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-002',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: hashedPassword,
    role: 'patient',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const readFileSyncMock = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
  const writeFileSyncMock = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
  const bcryptCompareMock = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
  const bcryptHashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ sub: 'usr-001', email: 'admin@nexusai.com', role: 'admin' }),
            decode: jest.fn().mockReturnValue({ sub: 'usr-001' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    readFileSyncMock.mockReturnValue(JSON.stringify(mockUsers) as any);
    writeFileSyncMock.mockImplementation(() => undefined);
    (bcryptCompareMock as any).mockResolvedValue(true);
    (bcryptHashMock as any).mockResolvedValue('$2b$10$newHashedValue');
  });

  afterEach(() => jest.clearAllMocks());

  describe('validateUser', () => {
    it('returns user without password on valid credentials', async () => {
      const result = await service.validateUser('admin@nexusai.com', 'password123');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('admin@nexusai.com');
    });

    it('throws UnauthorizedException for unknown email', async () => {
      await expect(service.validateUser('unknown@test.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      (bcryptCompareMock as any).mockResolvedValueOnce(false);
      await expect(service.validateUser('admin@nexusai.com', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for inactive user', async () => {
      readFileSyncMock.mockReturnValueOnce(JSON.stringify([{ ...mockUsers[0], isActive: false }]) as any);
      await expect(service.validateUser('admin@nexusai.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('creates a new user and writes to file', async () => {
      const dto = { name: 'New User', email: 'new@test.com', password: 'password123' };
      const result = await service.register(dto);
      expect(result.email).toBe('new@test.com');
      expect(result).not.toHaveProperty('password');
      expect(result.role).toBe('patient');
      expect(result.isActive).toBe(true);
      expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
    });

    it('throws ConflictException when email already exists', async () => {
      const dto = { name: 'Admin', email: 'admin@nexusai.com', password: 'password123' };
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns accessToken and user on valid login', async () => {
      const mockRes = { cookie: jest.fn() };
      const result = await service.login({ email: 'admin@nexusai.com', password: 'password123' } as any, mockRes);
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', expect.any(String), expect.any(Object));
    });
  });

  describe('logout', () => {
    it('clears the refresh token cookie', async () => {
      const mockReq = { cookies: { refresh_token: 'some-refresh-token' } };
      const mockRes = { clearCookie: jest.fn() };
      const result = await service.logout(mockReq, mockRes);
      expect(result.message).toBe('Logged out successfully');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token', { path: '/' });
    });

    it('handles logout when no refresh token cookie exists', async () => {
      const mockReq = { cookies: {} };
      const mockRes = { clearCookie: jest.fn() };
      const result = await service.logout(mockReq, mockRes);
      expect(result.message).toBe('Logged out successfully');
    });
  });

  describe('getProfile', () => {
    it('returns user profile without password', () => {
      const result = service.getProfile('usr-001');
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('usr-001');
    });

    it('throws UnauthorizedException for unknown user id', () => {
      expect(() => service.getProfile('usr-999')).toThrow(UnauthorizedException);
    });
  });
});
