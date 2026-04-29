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
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s var(--ease)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ padding: '16px 20px 0', display: 'inline-flex', alignSelf: 'flex-start' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(34,211,238,0.1)', color: 'var(--accent)', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Featured</span>
          </div>
          <div style={{ padding: '12px 20px 20px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 10 }}>{blog.title}</h3>
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
      <div
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.25s var(--ease)' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '16/9', background: 'var(--bg-secondary)', overflow: 'hidden', position: 'relative' }}>
          {blog.image ? (
            <>
              <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(5,7,13,0.5) 0%,transparent 60%)' }} />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          {/* Category tag */}
          {blog.category && (
            <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '3px 10px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 999, fontSize: 10, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {blog.category}
            </div>
          )}
        </div>
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{date}</span>
            <span style={{ color: 'var(--border)', fontSize: 14 }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{blog.readTime} min read</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8 }} className="line-clamp-2">{blog.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }} className="line-clamp-2">{blog.excerpt}</p>
          <span style={{ display: 'inline-block', marginTop: 12, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Read more →</span>
        </div>
      </div>
    </Link>
  );
}
