# Skill: Add New API Endpoint

Use this skill when asked to add a new endpoint to the NexusAI backend.

## Step-by-Step

### Option A: Add to an Existing Module
If the endpoint belongs to an existing module (doctors, appointments, etc.):

1. Open the controller: `nexusai-backend/src/<module>/<module>.controller.ts`
2. Add the endpoint method
3. Open the service: `nexusai-backend/src/<module>/<module>.service.ts`
4. Add the service method

### Option B: Create a New Module
Follow this exact structure:

```
nexusai-backend/src/<new-feature>/
  <new-feature>.module.ts
  <new-feature>.controller.ts
  <new-feature>.service.ts
  dto/
    create-<new-feature>.dto.ts
    update-<new-feature>.dto.ts
```

Then register in `app.module.ts`.

### Module Template
```ts
// <feature>.module.ts
import { Module } from '@nestjs/common';
import { FeatureController } from './<feature>.controller';
import { FeatureService } from './<feature>.service';

@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### Controller Template
```ts
// <feature>.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeatureService } from './<feature>.service';
import { CreateFeatureDto } from './dto/create-<feature>.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List returned' })
  @Get('/')
  getAll() {
    return this.featureService.findAll();
  }

  @ApiOperation({ summary: 'Create item' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('/')
  create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }
}
```

### Service Template
```ts
// <feature>.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Feature } from '../../../.claude/context/types';
import { CreateFeatureDto } from './dto/create-<feature>.dto';

@Injectable()
export class FeatureService {
  private readonly dataFile = path.join(__dirname, '..', 'data', '<feature>.json');

  private readData(): Feature[] {
    if (!fs.existsSync(this.dataFile)) return [];
    return JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
  }

  private writeData(data: Feature[]): void {
    fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
  }

  findAll(): Feature[] {
    return this.readData();
  }

  create(dto: CreateFeatureDto): Feature {
    const items = this.readData();
    const newItem: Feature = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.writeData(items);
    return newItem;
  }
}
```

### Add Seed Data
Create `nexusai-backend/src/data/<feature>.json`:
```json
[]
```

### Wire Up Frontend API Client
Add to `nexusai-frontend/src/lib/api.ts`:
```ts
export const featureApi = {
  getAll: () => api.get<Feature[]>('/feature').then(r => r.data),
  getById: (id: string) => api.get<Feature>(`/feature/${id}`).then(r => r.data),
  create: (dto: CreateFeatureDto) => api.post<Feature>('/feature', dto).then(r => r.data),
  update: (id: string, dto: UpdateFeatureDto) => api.put<Feature>(`/feature/${id}`, dto).then(r => r.data),
  delete: (id: string) => api.delete(`/feature/${id}`).then(r => r.data),
};
```

## Verify
```bash
cd nexusai-backend && npm run build
# Then start and check Swagger at http://localhost:3001/api
```
