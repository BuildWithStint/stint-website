'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Save,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Minus,
  ExternalLink,
  Upload,
} from 'lucide-react'
import {
  blogAPI,
  type AdminBlogPost,
  type BlogInput,
} from '../../services/api'

const EMPTY: BlogInput = {
  title: '',
  slug: '',
  description: '',
  body: '',
  coverImage: '',
  tags: [],
  keywords: [],
  author: 'STINT',
  readingTime: '5 min read',
  isPublished: true,
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function estimateReadingTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 220))
  return `${minutes} min read`
}

interface ToolbarButtonProps {
  onClick: () => void
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </button>
  )
}

export function ManageBlog() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminBlogPost | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<BlogInput>(EMPTY)
  const [tagsInput, setTagsInput] = useState('')
  const [keywordsInput, setKeywordsInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const bodyImageInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<null | 'cover' | 'body'>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await blogAPI.list()
      if (res.success) setPosts(res.posts)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setIsNew(true)
    setForm(EMPTY)
    setTagsInput('')
    setKeywordsInput('')
    setSlugTouched(false)
    setError(null)
    setShowPreview(false)
  }

  const openEdit = (p: AdminBlogPost) => {
    setEditing(p)
    setIsNew(false)
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      body: p.body,
      coverImage: p.coverImage || '',
      tags: p.tags || [],
      keywords: p.keywords || [],
      author: p.author,
      readingTime: p.readingTime,
      isPublished: p.isPublished,
      publishedAt: p.publishedAt,
    })
    setTagsInput((p.tags || []).join(', '))
    setKeywordsInput((p.keywords || []).join(', '))
    setSlugTouched(true)
    setError(null)
    setShowPreview(false)
  }

  const closeEditor = () => {
    setEditing(null)
    setIsNew(false)
    setForm(EMPTY)
    setError(null)
  }

  const onTitleChange = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugTouched ? f.slug : slugify(v),
    }))
  }

  const save = async () => {
    setError(null)
    if (!form.title.trim() || !form.description.trim() || !form.body.trim()) {
      setError('Title, description, and body are required.')
      return
    }
    setSaving(true)
    try {
      const payload: BlogInput = {
        ...form,
        tags: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
        keywords: keywordsInput.split(',').map((s) => s.trim()).filter(Boolean),
        readingTime: form.readingTime || estimateReadingTime(form.body),
      }
      const res = editing
        ? await blogAPI.update(editing._id, payload)
        : await blogAPI.create(payload)
      if (!res.success) {
        setError(res.error || 'Save failed')
      } else {
        await load()
        closeEditor()
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p: AdminBlogPost) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      await blogAPI.remove(p._id)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  const togglePublish = async (p: AdminBlogPost) => {
    try {
      await blogAPI.update(p._id, { isPublished: !p.isPublished })
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  // Toolbar inserts HTML at cursor
  const wrap = (before: string, after = '') => {
    const ta = bodyRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const value = form.body
    const selected = value.slice(start, end)
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end)
    setForm((f) => ({ ...f, body: next }))
    requestAnimationFrame(() => {
      ta.focus()
      const cursor = start + before.length + selected.length + after.length
      ta.setSelectionRange(cursor, cursor)
    })
  }

  const insertLink = () => {
    const url = prompt('URL', 'https://')
    if (!url) return
    const ta = bodyRef.current
    const sel =
      ta && ta.selectionEnd > ta.selectionStart
        ? form.body.slice(ta.selectionStart, ta.selectionEnd)
        : prompt('Link text', 'click here') || ''
    if (ta && ta.selectionEnd > ta.selectionStart) {
      wrap(`<a href="${url}">`, '</a>')
    } else {
      wrap(`<a href="${url}">${sel}</a>`)
    }
  }

  const insertImage = () => {
    const url = prompt('Image URL or paste a data URI')
    if (!url) return
    const alt = prompt('Alt text (for accessibility + SEO)', '') || ''
    wrap(`\n<figure>\n  <img src="${url}" alt="${alt}" />\n  <figcaption>${alt}</figcaption>\n</figure>\n`)
  }

  const uploadFile = async (file: File, target: 'cover' | 'body') => {
    setError(null)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image exceeds 10MB. Pick a smaller file.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.')
      return
    }
    setUploading(target)
    try {
      const res = await blogAPI.upload(file)
      if (!res.success || !res.url) {
        setError(res.error || 'Upload failed')
        return
      }
      if (target === 'cover') {
        setForm((f) => ({ ...f, coverImage: res.url! }))
      } else {
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
        wrap(
          `\n<figure>\n  <img src="${res.url}" alt="${alt}" />\n  <figcaption>${alt}</figcaption>\n</figure>\n`
        )
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const onCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) uploadFile(file, 'cover')
  }

  const onBodyFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) uploadFile(file, 'body')
  }

  const previewHtml = useMemo(() => form.body, [form.body])

  const isEditorOpen = isNew || editing !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, and publish articles. Live within 5 minutes of saving.
          </p>
        </div>
        {!isEditorOpen && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New post
          </button>
        )}
      </div>

      {isEditorOpen ? (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {isNew ? 'New post' : `Editing: ${editing?.title}`}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded hover:bg-accent/10"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide preview' : 'Preview'}
              </button>
              <button
                onClick={closeEditor}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded hover:bg-accent/10"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-background rounded hover:opacity-90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                placeholder="How to hire freelance Next.js developers"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Slug
              </label>
              <input
                value={form.slug || ''}
                onChange={(e) => {
                  setSlugTouched(true)
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground font-mono text-sm"
                placeholder="how-to-hire-freelance-nextjs-developers"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description * (shown on listing + meta description)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              maxLength={400}
              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
              placeholder="A practical guide for founders…"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.description.length}/400
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Cover image (shown at top of post + on listing)
              </label>
              <div className="flex gap-2">
                <input
                  value={form.coverImage || ''}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground"
                  placeholder="Paste URL or click Upload →"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploading === 'cover'}
                  className="inline-flex items-center gap-2 px-3 text-sm border border-border rounded hover:bg-accent/10 disabled:opacity-50"
                  title="Upload to Cloudinary"
                >
                  <Upload className="w-4 h-4" />
                  {uploading === 'cover' ? 'Uploading…' : 'Upload'}
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onCoverFile}
                  className="hidden"
                />
              </div>
              {form.coverImage ? (
                <img
                  src={form.coverImage}
                  alt=""
                  className="mt-2 w-full max-h-40 object-cover rounded border border-border"
                />
              ) : null}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tags (comma-separated, shown on post)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  placeholder="Hiring, Next.js, Freelance"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  SEO keywords (comma-separated, hidden meta)
                </label>
                <input
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  placeholder="hire freelance developers, next.js, react"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Author
              </label>
              <input
                value={form.author || ''}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Reading time
              </label>
              <div className="flex gap-2">
                <input
                  value={form.readingTime || ''}
                  onChange={(e) => setForm((f) => ({ ...f, readingTime: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, readingTime: estimateReadingTime(f.body) }))
                  }
                  className="px-3 text-xs border border-border rounded hover:bg-accent/10"
                  title="Auto-calc from body"
                >
                  Auto
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Publish date
              </label>
              <input
                type="date"
                value={form.publishedAt ? form.publishedAt.slice(0, 10) : ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    publishedAt: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  }))
                }
                className="date-input-light w-full px-3 py-2 bg-background border border-border rounded text-foreground"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished !== false}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm text-foreground">Published</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Body (HTML) *
            </label>

            <div className="flex flex-wrap items-center gap-1 p-2 bg-background border border-border border-b-0 rounded-t">
              <ToolbarButton onClick={() => wrap('<h2>', '</h2>\n')} title="Heading 2">
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => wrap('<h3>', '</h3>\n')} title="Heading 3">
                <Heading3 className="w-4 h-4" />
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton onClick={() => wrap('<strong>', '</strong>')} title="Bold">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => wrap('<em>', '</em>')} title="Italic">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={insertLink} title="Link">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton
                onClick={() => wrap('\n<ul>\n  <li>', '</li>\n</ul>\n')}
                title="Bulleted list"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => wrap('\n<ol>\n  <li>', '</li>\n</ol>\n')}
                title="Numbered list"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => wrap('\n<blockquote>', '</blockquote>\n')}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => wrap('<code>', '</code>')} title="Inline code">
                <Code className="w-4 h-4" />
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton onClick={insertImage} title="Image by URL">
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => bodyImageInputRef.current?.click()}
                title="Upload image (stored in DB)"
              >
                {uploading === 'body' ? (
                  <span className="text-[10px] px-1">…</span>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </ToolbarButton>
              <input
                ref={bodyImageInputRef}
                type="file"
                accept="image/*"
                onChange={onBodyFile}
                className="hidden"
              />
              <ToolbarButton onClick={() => wrap('\n<hr />\n')} title="Divider">
                <Minus className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => wrap('<p>', '</p>\n')} title="Paragraph">
                <span className="text-xs font-bold px-1">P</span>
              </ToolbarButton>
            </div>

            <textarea
              ref={bodyRef}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={20}
              className="w-full px-3 py-3 bg-background border border-border rounded-b text-foreground font-mono text-sm leading-relaxed"
              placeholder="<p>Write HTML here. Use the toolbar above for formatting.</p>"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: select text first, then click a toolbar button to wrap it.
            </p>
          </div>

          {showPreview && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Preview
              </h4>
              <div
                className="prose-stint p-6 bg-background border border-border rounded"
                style={{ color: 'rgba(242,237,228,0.78)' }}
              >
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
              <style>{`
                .prose-stint { line-height: 1.75; font-size: 16px; }
                .prose-stint p { margin: 1.2em 0; }
                .prose-stint h2 { font-family: 'Playfair Display', serif; font-weight: 900; color: #F2EDE4; font-size: 1.75rem; margin: 1.8em 0 0.6em; }
                .prose-stint h3 { font-family: 'Playfair Display', serif; font-weight: 700; color: #F2EDE4; font-size: 1.35rem; margin: 1.5em 0 0.5em; }
                .prose-stint a { color: #C8973D; text-decoration: underline; }
                .prose-stint ul, .prose-stint ol { margin: 1em 0; padding-left: 1.4em; }
                .prose-stint ul li { list-style: disc; }
                .prose-stint ol li { list-style: decimal; }
                .prose-stint strong { color: #F2EDE4; }
                .prose-stint blockquote { border-left: 2px solid #C8973D; padding-left: 1.2em; font-style: italic; margin: 1.5em 0; }
                .prose-stint code { background: rgba(242,237,228,0.07); padding: 2px 6px; border-radius: 3px; font-size: 0.92em; }
                .prose-stint figure { margin: 1.6em 0; }
                .prose-stint figure img { width: 100%; border-radius: 4px; }
                .prose-stint figcaption { font-size: 0.85em; color: rgba(242,237,228,0.5); text-align: center; margin-top: 0.5em; }
                .prose-stint hr { border: none; border-top: 1px solid rgba(242,237,228,0.1); margin: 2em 0; }
              `}</style>
            </div>
          )}
        </div>
      ) : null}

      {/* List */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">No posts yet. Click “New post” to create one.</p>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {posts.map((p) => (
            <div
              key={p._id}
              className="p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt=""
                  className="w-full md:w-24 h-24 object-cover rounded border border-border shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/blog-default.png'
                  }}
                />
              ) : (
                <img
                  src="/blog-default.png"
                  alt=""
                  className="w-full md:w-24 h-24 object-cover rounded border border-border shrink-0 opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-base font-semibold text-foreground truncate">{p.title}</h3>
                  {p.isPublished ? (
                    <span className="px-2 py-0.5 text-[10px] bg-green-500/15 text-green-400 rounded uppercase tracking-wider">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] bg-yellow-500/15 text-yellow-400 rounded uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-1">/blog/{p.slug}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                {p.tags?.length ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] bg-accent/10 text-accent rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                  title="View live"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => togglePublish(p)}
                  className="p-2 rounded hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                  title={p.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {p.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(p)}
                  className="p-2 rounded hover:bg-red-500/10 text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
