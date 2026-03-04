import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type {
  CaseStudy, Service, TeamMember, Testimonial, ContactLead, AnalysisRequest
} from '../lib/supabase'

// ─── Design tokens ────────────────────────────────────────────
const T = {
  bg: '#080808',
  surface: '#0f0f0f',
  card: '#141414',
  border: '#1e1e1e',
  borderHover: '#2e2e2e',
  accent: '#f97316',
  accentDim: '#f9731620',
  text: '#f2ede8',
  muted: '#5a5550',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#eab308',
  info: '#6366f1',
}

// ─── Section config ───────────────────────────────────────────
type FieldType = 'text' | 'textarea' | 'url' | 'email' | 'number' | 'checkbox' | 'select'
interface Field {
  name: string; label: string; type: FieldType
  required?: boolean; options?: string[]; readOnly?: boolean
}
interface Section {
  key: string; label: string; icon: string; color: string
  readOnly?: boolean; fields: Field[]
}

const SECTIONS: Section[] = [
  {
    key: 'case_studies', label: 'Case Studies', icon: '🎯', color: T.accent,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'text', required: true },
      { name: 'industry', label: 'Industry', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'results', label: 'Results / Outcome', type: 'textarea' },
      { name: 'image_url', label: 'Cover Image URL', type: 'url' },
      { name: 'tags', label: 'Tags (comma-separated)', type: 'text' },
      { name: 'featured', label: 'Mark as Featured', type: 'checkbox' },
      { name: 'published', label: 'Published (visible)', type: 'checkbox' },
    ],
  },
  {
    key: 'services', label: 'Services', icon: '⚡', color: '#818cf8',
    fields: [
      { name: 'title', label: 'Service Title', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon (emoji or URL)', type: 'text' },
      { name: 'price_range', label: 'Price Range', type: 'text' },
      { name: 'deliverables', label: 'Deliverables (one/line)', type: 'textarea' },
      { name: 'sort_order', label: 'Sort Order (0 = first)', type: 'number' },
      { name: 'active', label: 'Active (visible)', type: 'checkbox' },
    ],
  },
  {
    key: 'team_members', label: 'Team', icon: '👥', color: '#34d399',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'role', label: 'Role / Title', type: 'text', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'photo_url', label: 'Photo URL', type: 'url' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
      { name: 'active', label: 'Active', type: 'checkbox' },
    ],
  },
  {
    key: 'testimonials', label: 'Testimonials', icon: '💬', color: '#fbbf24',
    fields: [
      { name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'role', label: 'Role / Title', type: 'text' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number' },
      { name: 'photo_url', label: 'Photo URL', type: 'url' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  {
    key: 'contact_leads', label: 'Leads', icon: '📥', color: '#f472b6',
    readOnly: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      {
        name: 'status', label: 'Status', type: 'select',
        options: ['new', 'contacted', 'converted', 'archived']
      },
      { name: 'created_at', label: 'Received', type: 'text', readOnly: true },
    ],
  },
  {
    key: 'analysis_requests', label: 'Analyse Logs', icon: '🔍', color: '#22d3ee',
    readOnly: true,
    fields: [
      { name: 'project_description', label: 'Project Description', type: 'textarea', readOnly: true },
      { name: 'created_at', label: 'Submitted', type: 'text', readOnly: true },
    ],
  },
]

// ─── Utility components ───────────────────────────────────────
const s = (obj: Record<string, unknown>) => obj as React.CSSProperties

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={s({
      background: color + '22', color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: '2px 7px', fontSize: 10,
      fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    })}>{label}</span>
  )
}

function Spinner() {
  return (
    <div style={s({ display: 'flex', justifyContent: 'center', padding: 64 })}>
      <div style={s({
        width: 28, height: 28,
        border: `2px solid ${T.border}`,
        borderTop: `2px solid ${T.accent}`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      })} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Login screen ─────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Enter email and password'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    else onLogin()
    setLoading(false)
  }

  const inputStyle = s({
    width: '100%', background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.text, padding: '12px 14px', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    marginBottom: 12,
  })

  return (
    <div style={s({
      minHeight: '100vh', background: T.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter','Segoe UI',sans-serif",
    })}>
      <div style={s({
        width: '100%', maxWidth: 380,
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: 40,
      })}>
        {/* Logo */}
        <div style={s({ textAlign: 'center', marginBottom: 32 })}>
          <div style={s({
            width: 44, height: 44, background: T.accent, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 auto 12px',
          })}>O</div>
          <h1 style={s({ margin: 0, color: T.text, fontSize: 18, fontWeight: 700 })}>
            October Adverts
          </h1>
          <p style={s({ margin: '4px 0 0', color: T.muted, fontSize: 13 })}>Admin Dashboard</p>
        </div>

        {error && (
          <div style={s({
            background: T.danger + '18', border: `1px solid ${T.danger}44`,
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            color: T.danger, fontSize: 13,
          })}>{error}</div>
        )}

        <input
          type="email" placeholder="Admin email"
          value={email} onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <input
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          style={inputStyle}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={s({
            width: '100%', background: T.accent, color: '#fff', border: 'none',
            borderRadius: 8, padding: '12px', cursor: 'pointer',
            fontWeight: 700, fontSize: 15, opacity: loading ? 0.6 : 1,
            marginTop: 4,
          })}
        >
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        <p style={s({ margin: '20px 0 0', color: T.muted, fontSize: 12, textAlign: 'center' })}>
          Create your admin account in<br />
          Supabase → Authentication → Users
        </p>
      </div>
    </div>
  )
}

// ─── Field renderer ───────────────────────────────────────────
function FieldInput({ field, value, onChange }: {
  field: Field
  value: unknown
  onChange: (v: unknown) => void
}) {
  const base = s({
    width: '100%', background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 6, color: T.text, padding: '10px 12px', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    resize: field.type === 'textarea' ? 'vertical' : 'none',
  })

  if (field.readOnly) {
    return <p style={s({ margin: 0, color: T.muted, fontSize: 13, padding: '8px 0' })}>
      {String(value ?? '—')}
    </p>
  }
  if (field.type === 'checkbox') return (
    <label style={s({ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' })}>
      <input
        type="checkbox" checked={!!value}
        onChange={e => onChange(e.target.checked)}
        style={s({ width: 16, height: 16, accentColor: T.accent })}
      />
      <span style={s({ color: T.text, fontSize: 14 })}>Yes</span>
    </label>
  )
  if (field.type === 'select') return (
    <select value={String(value ?? '')} onChange={e => onChange(e.target.value)} style={base}>
      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  if (field.type === 'textarea') return (
    <textarea
      value={String(value ?? '')} rows={4}
      onChange={e => onChange(e.target.value)}
      placeholder={field.label}
      style={base}
    />
  )
  return (
    <input
      type={field.type} value={String(value ?? '')}
      onChange={e => onChange(e.target.value)}
      placeholder={field.label}
      style={base}
    />
  )
}

// ─── Record modal ─────────────────────────────────────────────
function RecordModal({
  section, record, onClose, onRefresh,
}: {
  section: Section
  record: Record<string, unknown> | null   // null = new
  onClose: () => void
  onRefresh: () => void
}) {
  const isNew = record === null
  const [data, setData] = useState<Record<string, unknown>>(record ?? {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const setField = (name: string, val: unknown) =>
    setData(prev => ({ ...prev, [name]: val }))

  const handleSave = async () => {
    for (const f of section.fields) {
      if (f.required && !data[f.name]) {
        setError(`"${f.label}" is required`)
        return
      }
    }
    setSaving(true); setError('')
    try {
      if (isNew) {
        const { error: err } = await supabase.from(section.key).insert([data] as never)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from(section.key)
          .update(data as never)
          .eq('id', data.id as string)
        if (err) throw err
      }
      onRefresh(); onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={s({
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      })}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={s({
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
        width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto',
      })}>
        <div style={s({
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 22px', borderBottom: `1px solid ${T.border}`,
          position: 'sticky', top: 0, background: T.card, zIndex: 1,
        })}>
          <h3 style={s({ margin: 0, color: T.text, fontSize: 15, fontWeight: 700 })}>
            {isNew ? `New ${section.label.replace(/s$/, '')}` : `Edit ${section.label.replace(/s$/, '')}`}
          </h3>
          <button onClick={onClose} style={s({
            background: 'none', border: 'none', color: T.muted,
            cursor: 'pointer', fontSize: 18, padding: '0 4px',
          })}>✕</button>
        </div>

        <div style={s({ padding: 22 })}>
          {error && (
            <div style={s({
              background: T.danger + '18', border: `1px solid ${T.danger}44`,
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              color: T.danger, fontSize: 13,
            })}>{error}</div>
          )}

          {section.fields.map(f => (
            <div key={f.name} style={s({ marginBottom: 16 })}>
              <label style={s({
                display: 'block', color: T.muted, fontSize: 11, marginBottom: 6,
                fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              })}>
                {f.label}{f.required && <span style={s({ color: T.accent })}> *</span>}
              </label>
              <FieldInput
                field={f}
                value={data[f.name]}
                onChange={v => setField(f.name, v)}
              />
            </div>
          ))}

          {!section.readOnly && (
            <div style={s({ display: 'flex', gap: 10, marginTop: 24 })}>
              <button onClick={handleSave} disabled={saving} style={s({
                flex: 1, background: T.accent, color: '#fff', border: 'none',
                borderRadius: 8, padding: '11px', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1,
              })}>
                {saving ? 'Saving…' : isNew ? 'Create' : 'Save Changes'}
              </button>
              <button onClick={onClose} style={s({
                background: 'none', color: T.muted,
                border: `1px solid ${T.border}`, borderRadius: 8,
                padding: '11px 18px', cursor: 'pointer', fontSize: 14,
              })}>Cancel</button>
            </div>
          )}
          {section.readOnly && (
            <button onClick={onClose} style={s({
              width: '100%', background: T.accent, color: '#fff', border: 'none',
              borderRadius: 8, padding: '11px', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, marginTop: 16,
            })}>Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Section view ─────────────────────────────────────────────
function SectionView({ section }: { section: Section }) {
  const [records, setRecords] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'new' | Record<string, unknown> | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('')
    const { data, error: err } = await supabase
      .from(section.key)
      .select('*')
    if (err) setError(err.message)
    else setRecords((data as Record<string, unknown>[]) ?? [])
    setLoading(false)
  }, [section.key])

  useEffect(() => { void fetchAll() }, [fetchAll])

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this record? This cannot be undone.')) return
    const { error: err } = await supabase
      .from(section.key)
      .delete()
      .eq('id', id as string)
    if (err) alert(err.message)
    else setRecords(prev => prev.filter(r => r.id !== id))
  }

  const primaryField = section.fields[0].name
  const secondaryField = section.fields[1]?.name
  const statusColors: Record<string, string> = {
    new: '#fbbf24', contacted: '#818cf8', converted: T.success, archived: T.muted,
  }

  const filtered = records.filter(r => {
    if (!search) return true
    return Object.values(r).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div>
      {/* Header */}
      <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 })}>
        <div>
          <h2 style={s({ margin: 0, color: T.text, fontSize: 20, fontWeight: 800 })}>
            <span style={s({ marginRight: 8 })}>{section.icon}</span>{section.label}
          </h2>
          <p style={s({ margin: '4px 0 0', color: T.muted, fontSize: 12 })}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!section.readOnly && (
          <button onClick={() => setModal('new')} style={s({
            background: section.color, color: '#000', border: 'none',
            borderRadius: 8, padding: '9px 16px', cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
          })}>
            + New
          </button>
        )}
      </div>

      {/* Search */}
      <input
        placeholder={`Search ${section.label.toLowerCase()}…`}
        value={search} onChange={e => setSearch(e.target.value)}
        style={s({
          width: '100%', background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 8, color: T.text, padding: '10px 14px', fontSize: 14,
          outline: 'none', marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit',
        })}
      />

      {/* Error */}
      {error && (
        <div style={s({
          background: T.danger + '18', border: `1px solid ${T.danger}44`,
          borderRadius: 8, padding: '12px 14px', marginBottom: 16,
          color: T.danger, fontSize: 13,
        })}>⚠ {error}</div>
      )}

      {/* Content */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div style={s({
          textAlign: 'center', color: T.muted, padding: '64px 0',
          border: `2px dashed ${T.border}`, borderRadius: 12,
        })}>
          <div style={s({ fontSize: 36, marginBottom: 8 })}>{section.icon}</div>
          <p style={s({ margin: '0 0 16px', fontSize: 14 })}>
            {search ? 'No results found' : `No ${section.label.toLowerCase()} yet`}
          </p>
          {!section.readOnly && !search && (
            <button onClick={() => setModal('new')} style={s({
              background: section.color, color: '#000', border: 'none',
              borderRadius: 7, padding: '8px 16px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
            })}>Add your first one</button>
          )}
        </div>
      ) : (
        <div style={s({ display: 'flex', flexDirection: 'column', gap: 6 })}>
          {filtered.map(record => (
            <div
              key={String(record.id)}
              style={s({
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: '13px 15px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'border-color 0.15s',
              })}
            >
              {/* Colour indicator */}
              <div style={s({
                width: 8, height: 8, borderRadius: '50%',
                background: section.color, flexShrink: 0,
                opacity: (record.published === false || record.active === false) ? 0.25 : 1,
              })} />

              {/* Text */}
              <div style={s({ flex: 1, minWidth: 0 })}>
                <p style={s({
                  margin: 0, color: T.text, fontSize: 14, fontWeight: 600,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                })}>
                  {String(record[primaryField] ?? '(empty)')}
                </p>
                {secondaryField && !!record[secondaryField] && (
                  <p style={s({
                    margin: '2px 0 0', color: T.muted, fontSize: 12,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  })}>
                    {String(record[secondaryField])}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div style={s({ display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' })}>
                {!!record.featured && <Pill label="Featured" color={T.accent} />}
                {record.published === false && <Pill label="Draft" color={T.muted} />}
                {record.active === false && <Pill label="Inactive" color={T.muted} />}
                {record.status && <Pill label={String(record.status)} color={statusColors[String(record.status)] ?? T.muted} />}
                {record.rating && <Pill label={'★'.repeat(Number(record.rating))} color={T.warning} />}
              </div>

              {/* Actions */}
              <div style={s({ display: 'flex', gap: 6, flexShrink: 0 })}>
                <button
                  onClick={() => setModal(record)}
                  style={s({
                    background: 'none', border: `1px solid ${T.border}`, color: T.muted,
                    borderRadius: 6, padding: '6px 11px', cursor: 'pointer', fontSize: 12,
                  })}
                >
                  {section.readOnly ? 'View' : 'Edit'}
                </button>
                {!section.readOnly && (
                  <button
                    onClick={() => handleDelete(record.id as string)}
                    style={s({
                      background: 'none', border: `1px solid ${T.danger}44`, color: T.danger,
                      borderRadius: 6, padding: '6px 11px', cursor: 'pointer', fontSize: 12,
                    })}
                  >Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <RecordModal
          section={section}
          record={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onRefresh={fetchAll}
        />
      )}
    </div>
  )
}

// ─── Root app ─────────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [active, setActive] = useState(SECTIONS[0].key)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthed(false)
  }

  if (checking) return (
    <div style={s({ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      <Spinner />
    </div>
  )

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const activeSection = SECTIONS.find(s => s.key === active)!

  return (
    <div style={s({
      display: 'flex', height: '100vh', background: T.bg, overflow: 'hidden',
      fontFamily: "'Inter','Segoe UI',sans-serif", color: T.text,
    })}>
      {/* ── Sidebar ── */}
      <aside style={s({
        width: collapsed ? 56 : 210, flexShrink: 0,
        background: T.surface, borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.22s ease',
        overflow: 'hidden',
      })}>
        {/* Brand */}
        <div style={s({
          padding: collapsed ? '18px 0' : '18px 16px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        })}>
          <div style={s({
            width: 30, height: 30, background: T.accent, borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0,
          })}>O</div>
          {!collapsed && (
            <div>
              <p style={s({ margin: 0, fontSize: 12, fontWeight: 800, color: T.text, lineHeight: 1.2 })}>October</p>
              <p style={s({ margin: 0, fontSize: 10, color: T.muted })}>Admin</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={s({ flex: 1, padding: '10px 0', overflowY: 'auto' })}>
          {SECTIONS.map(sec => {
            const isActive = active === sec.key
            return (
              <button key={sec.key} onClick={() => setActive(sec.key)} style={s({
                width: '100%', background: isActive ? sec.color + '1a' : 'none',
                border: 'none', borderLeft: isActive ? `3px solid ${sec.color}` : '3px solid transparent',
                color: isActive ? sec.color : T.muted, cursor: 'pointer',
                padding: collapsed ? '10px 0' : '10px 16px',
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                transition: 'all 0.12s',
              })}>
                <span style={s({ fontSize: 15 })}>{sec.icon}</span>
                {!collapsed && sec.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={s({ borderTop: `1px solid ${T.border}`, padding: '8px 0' })}>
          <button onClick={() => setCollapsed(!collapsed)} style={s({
            width: '100%', background: 'none', border: 'none', color: T.muted,
            cursor: 'pointer', padding: collapsed ? '8px 0' : '8px 16px',
            display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontSize: 12,
          })}>
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && 'Collapse'}
          </button>
          <button onClick={handleLogout} style={s({
            width: '100%', background: 'none', border: 'none', color: T.danger,
            cursor: 'pointer', padding: collapsed ? '8px 0' : '8px 16px',
            display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontSize: 12,
          })}>
            <span>⏏</span>
            {!collapsed && 'Log out'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={s({ flex: 1, overflow: 'auto', padding: '32px 36px' })}>
        <SectionView key={active} section={activeSection} />
      </main>
    </div>
  )
}
