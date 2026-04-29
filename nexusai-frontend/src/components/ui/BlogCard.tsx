'use client';

import Link from 'next/link';
import { Avatar } from './Avatar';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorImage?: string;
  category: string;
  image?: string;
  readTime: number;
  publishedAt?: string;
}

interface BlogCardProps {
  blog: Blog;
  className?: string;
  featured?: boolean;
}

export function BlogCard({ blog, className = '', featured = false }: BlogCardProps) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', display: 'block' }} className={className}>
        <div className="card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--accent)', padding: '6px 14px', display: 'inline-flex', alignSelf: 'flex-start', margin: '16px 16px 0' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Featured</span>
          </div>
          <div style={{ padding: '12px 20px 20px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 10 }}>{blog.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.65, marginBottom: 16 }} className="line-clamp-3">{blog.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar src={blog.authorImage} name={blog.author} size="sm" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{blog.author}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{date} · {blog.readTime} min read</p>
              </div>
            </div>
            <span style={{ display: 'inline-block', marginTop: 16, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Read article →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', display: 'block' }} className={className}>
      <div className="card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{ aspectRatio: '16/9', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {blog.image ? (
            <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <svg width="36" height="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{blog.author}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{date}</span>
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8 }} className="line-clamp-2">{blog.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }} className="line-clamp-2">{blog.excerpt}</p>
          <span style={{ display: 'inline-block', marginTop: 12, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Read more →</span>
        </div>
      </div>
    </Link>
  );
}
