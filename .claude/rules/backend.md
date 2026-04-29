# Backend Coding Rules

These rules apply to all files in `nexusai-backend/src/`.

## MANDATORY — Breaking These Will Break the App

### 1. Module Registration
Every new module MUST be registered in `app.module.ts`:
```ts
@Module({
  imports: [AuthModule, DoctorsModule, /* add new module here */],
})
export class AppModule {}
```

### 2. Auth Guards — Apply Correctly
```ts
// Public endpoint — no guard needed
@Get('/')
getAll() { ... }

// Any authenticated user
@UseGuards(JwtAuthGuard)
@Get('/my')
getMine() { ... }

// Admin only
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete('/:id')
delete(@Param('id') id: string) { ... }
```

### 3. Swagger Annotations — Required on Every Endpoint
```ts
@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  @ApiOperation({ summary: 'Get all active doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  @Get('/')
  getAll() { ... }
}
```

### 4. Data File Pattern — Read/Write JSON
```ts
import * as fs from 'fs';
import * as path from 'path';

private readonly dataFile = path.join(__dirname, '..', 'data', 'doctors.json');

private readData(): Doctor[] {
  if (!fs.existsSync(this.dataFile)) return [];
  return JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
}

private writeData(data: Doctor[]): void {
  fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
}
```

### 5. ID Generation
```ts
// CORRECT
const newItem = { id: crypto.randomUUID(), ...dto };

// WRONG
const newItem = { id: Math.random().toString(), ...dto };
```

## DTOs Pattern
```ts
// create-doctor.dto.ts
import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}

// update-doctor.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
```

## Error Handling
```ts
// Throw NestJS exceptions — not plain Error
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
```

## Naming
- Services: `DoctorsService` in `doctors.service.ts`
- Controllers: `DoctorsController` in `doctors.controller.ts`
- Modules: `DoctorsModule` in `doctors.module.ts`
- DTOs: `CreateDoctorDto` in `create-doctor.dto.ts`
