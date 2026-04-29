'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { blogsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi.getBySlug(slug).then(setBlog).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-2 border-[#0f4c81] border-t-transparent rounded-full" /></div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold">Article not found</p>
        <Link href="/blog"><Button>Back to Journal</Button></Link>
      </div>
    );
  }

  const paragraphs = blog.content.split('\n\n');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="bg-gradient-to-br from-[#0a3560] to-[#0f4c81] text-white py-20">
        <div className="max-w-[900px] mx-auto px-6">
          <Link href="/blog" className="text-white/60 text-sm hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Journal
          </Link>
          <Badge variant="primary" className="mb-4 bg-white/20 text-white border-white/30">{blog.category}</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-[var(--font-heading)] leading-tight mb-6">{blog.title}</h1>
          <div className="flex items-center gap-4">
            <Avatar src={blog.authorImage} name={blog.author} size="md" />
            <div>
              <p className="font-semibold">{blog.author}</p>
              <p className="text-white/60 text-sm">
                {blog.publishedAt ? formatDate(blog.publishedAt) : ''} · {blog.readTime} min read
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-6 py-16">
        <article className="bg-white rounded-2xl border border-[#e2e8f0] p-8 md:p-12 shadow-sm">
          <p className="text-xl text-[#374151] leading-relaxed mb-8 font-medium">{blog.excerpt}</p>
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((para: string, i: number) => {
              if (para.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mt-8 mb-4">{para.replace('## ', '')}</h2>;
              }
              if (para.startsWith('**') && para.endsWith('**')) {
                return <h3 key={i} className="text-lg font-bold text-[#1a1a2e] mt-6 mb-2">{para.replace(/\*\*/g, '')}</h3>;
              }
              if (para.startsWith('- ')) {
                const items = para.split('\n').filter((l) => l.startsWith('- '));
                return <ul key={i} className="list-disc list-inside space-y-2 my-4 text-[#374151]">{items.map((item, j) => <li key={j}>{item.replace('- ', '')}</li>)}</ul>;
              }
              return <p key={i} className="text-[#374151] leading-relaxed mb-4">{para}</p>;
            })}
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#e2e8f0]">
              <p className="text-sm font-medium text-[#6b7280] mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-[#f0f7ff] text-[#0f4c81] text-xs rounded-full border border-[#bfdbfe] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="mt-8 text-center">
          <Link href="/blog"><Button variant="outline">← Read More Articles</Button></Link>
        </div>
      </div>
    </div>
  );
}
