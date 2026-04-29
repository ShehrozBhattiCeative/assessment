import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const DATA_PATH = path.join(__dirname, '../../src/data/users.json');

function readUsers(): any[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeUsers(users: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

// In-memory refresh token blacklist
const tokenBlacklist = new Set<string>();
// In-memory refresh token store: userId -> refreshToken
const refreshTokenStore = new Map<string, string>();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const users = readUsers();
    const user = users.find((u) => u.email === email && u.isActive);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, res: any) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'nexusai-jwt-secret-dev',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'nexusai-refresh-secret-dev',
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    refreshTokenStore.set(user.id, hashedRefresh);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { accessToken, user };
  }

  async register(registerDto: RegisterDto) {
    const users = readUsers();
    const exists = users.find((u) => u.email === registerDto.email);
    if (exists) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      id: `usr-${uuidv4().slice(0, 8)}`,
      ...registerDto,
      password: hashedPassword,
      role: 'patient',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...result } = newUser;
    return result;
  }

  async refresh(req: any, res: any) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException('No refresh token');
    if (tokenBlacklist.has(token)) throw new UnauthorizedException('Token revoked');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'nexusai-refresh-secret-dev',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedHash = refreshTokenStore.get(payload.sub);
    if (!storedHash) throw new UnauthorizedException('Token not found');

    const isValid = await bcrypt.compare(token, storedHash);
    if (!isValid) throw new UnauthorizedException('Token mismatch');

    tokenBlacklist.add(token);

    const newPayload = { sub: payload.sub, email: payload.email, role: payload.role };
    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_SECRET || 'nexusai-jwt-secret-dev',
      expiresIn: '15m',
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_REFRESH_SECRET || 'nexusai-refresh-secret-dev',
      expiresIn: '7d',
    });

    const hashedNew = await bcrypt.hash(newRefreshToken, 10);
    refreshTokenStore.set(payload.sub, hashedNew);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { accessToken: newAccessToken };
  }

  async logout(req: any, res: any) {
    const token = req.cookies?.refresh_token;
    if (token) {
      tokenBlacklist.add(token);
      const payload: any = (() => {
        try {
          return this.jwtService.decode(token);
        } catch {
          return null;
        }
      })();
      if (payload?.sub) refreshTokenStore.delete(payload.sub);
    }
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  getProfile(userId: string) {
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException('User not found');
    const { password: _, ...result } = user;
    return result;
  }
}
