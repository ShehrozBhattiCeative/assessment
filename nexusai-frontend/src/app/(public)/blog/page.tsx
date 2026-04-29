'use client';

import { useEffect, useState } from 'react';
import { BlogCard } from '@/components/ui/BlogCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { blogsApi } from '@/lib/api';
import { BLOG_CATEGORIES } from '@/constants';
import toast from 'react-hot-toast';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    blogsApi.getAll({ status: 'published' }).then(setBlogs).finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || b.category === category;
    return matchSearch && matchCat;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! You\'ll receive our next issue.');
    setEmail('');
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        breadcrumb="Blog"
        heading="The Unity Journal."
        subtitle="Clinical insights, preventive guides and stories from the ward."
      />

      {/* Search + Categories */}
      <section style={{ background: 'var(--bg-nav)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', position: 'sticky', top: 68, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: 220, flex: 1 }}>
            <svg
              width="16" height="16" fill="none" stroke="rgba(255,255,255,0.45)"
              strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 14px 9px 38px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, fontSize: 14, color: '#fff', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategory('')}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                background: !category ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                color: '#fff', border: 'none', cursor: 'pointer',
              }}
            >
              All
            </button>
            {BLOG_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  background: category === cat ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + Grid */}
      <section style={{ padding: '64px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {!loading && filtered.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <SectionHeader label="Featured" heading="Editor's pick." align="left" />
              <BlogCard blog={filtered[0]} featured />
            </div>
          )}

          <SectionHeader label="Journal" heading="Insights from our clinicians." align="left"
            action={
              <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                All articles →
              </span>
            }
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {loading
              ? Array(6).fill(null).map((_, i) => (
                  <div key={i} style={{ height: 288, borderRadius: 'var(--radius)', background: 'var(--border)', opacity: 0.5 }} />
                ))
              : filtered.slice(1).length === 0 && filtered.length === 0
                ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>No articles found</p>
                  </div>
                )
                : filtered.slice(1).map((blog) => <BlogCard key={blog.id} blog={blog} />)
            }
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '64px 0', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'var(--bg-nav)', borderRadius: 'var(--radius)',
            padding: '56px 64px', textAlign: 'center',
          }}>
            <span className="section-label">Newsletter</span>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
              Get the Unity Journal.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Monthly health insights, clinical updates, and preventive care guides — delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, fontSize: 14, color: '#fff', outline: 'none',
                }}
              />
              <button type="submit" style={{
                background: 'var(--accent)', color: '#fff',
                padding: '12px 24px', borderRadius: 8,
                fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
