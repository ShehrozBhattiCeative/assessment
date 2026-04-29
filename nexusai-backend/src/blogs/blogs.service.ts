import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../src/data/blogs.json');

function readData(): any[] {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); } catch { return []; }
}
function writeData(data: any[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

@Injectable()
export class BlogsService {
  findAll(query?: { status?: string; category?: string; search?: string }): any[] {
    let blogs = readData();
    if (query?.status) blogs = blogs.filter((b) => b.status === query.status);
    if (query?.category) blogs = blogs.filter((b) => b.category.toLowerCase() === query.category!.toLowerCase());
    if (query?.search) {
      const s = query.search.toLowerCase();
      blogs = blogs.filter((b) => b.title.toLowerCase().includes(s) || b.excerpt.toLowerCase().includes(s));
    }
    return blogs.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  findBySlug(slug: string): any {
    const blog = readData().find((b) => b.slug === slug);
    if (!blog) throw new NotFoundException(`Blog with slug "${slug}" not found`);
    return blog;
  }

  findOne(id: string): any {
    const blog = readData().find((b) => b.id === id);
    if (!blog) throw new NotFoundException(`Blog ${id} not found`);
    return blog;
  }

  create(dto: any): any {
    const blogs = readData();
    const newBlog = {
      id: `blog-${uuidv4().slice(0, 8)}`,
      slug: slugify(dto.title),
      ...dto,
      status: dto.status || 'draft',
      publishedAt: dto.status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    writeData(blogs);
    return newBlog;
  }

  update(id: string, dto: any): any {
    const blogs = readData();
    const idx = blogs.findIndex((b) => b.id === id);
    if (idx === -1) throw new NotFoundException(`Blog ${id} not found`);
    const updated = {
      ...blogs[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    if (dto.status === 'published' && !blogs[idx].publishedAt) {
      updated.publishedAt = new Date().toISOString();
    }
    if (dto.title) updated.slug = slugify(dto.title);
    blogs[idx] = updated;
    writeData(blogs);
    return blogs[idx];
  }

  remove(id: string): void {
    const blogs = readData();
    const idx = blogs.findIndex((b) => b.id === id);
    if (idx === -1) throw new NotFoundException(`Blog ${id} not found`);
    blogs.splice(idx, 1);
    writeData(blogs);
  }
}
