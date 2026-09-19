import React, { useEffect, useMemo, useState } from 'react'

/**
 * /rates — standalone, brand-neutral rate card with an interactive quote builder.
 *
 * Every figure here is a standing rate. The builder only adds up what the
 * visitor ticks; nothing is submitted anywhere.
 */

// ---------------------------------------------------------------------------
// Rate data
// ---------------------------------------------------------------------------

type Medium = 'realistic' | 'animated'
type Runtime = 60 | 90 | 120
type Tab = 'trailers' | 'websites'

const TRAILER: Record<Medium, { label: string; blurb: string; price: Record<Runtime, number> }> = {
  realistic: {
    label: 'Realistic',
    blurb: 'Photoreal AI footage, cinematic camera moves, cast voice.',
    price: { 60: 6000, 90: 9000, 120: 11000 },
  },
  animated: {
    label: 'Animated',
    blurb: 'Illustrated or stylised. Uses your existing artwork where it exists.',
    price: { 60: 4000, 90: 6000, 120: 7500 },
  },
}

const INCLUDED = [
  'Storyboard with three revision rounds',
  'Three revision rounds on the final video',
  'Voiceover cast to the brand and its audience',
  'Credits, end card and call to action',
  'Landscape 16:9 master, 1080p',
  'Fully AI-generated, no stock footage',
  'Two to three days per stage once feedback is in',
]

interface AddOn {
  id: string
  /** Index into STAGES: the point in production where this add-on can arise. */
  stage: number
  label: string
  price: number
  basis: string
  /** Quantity unit shown in the stepper; omit for a single yes/no line. */
  unit?: string
}

const ADD_ONS: AddOn[] = [
  { id: 'character', stage: 1, label: 'Extra character (third or more)', price: 500, basis: 'Per character, per video', unit: 'characters' },
  { id: 'scene', stage: 1, label: 'New scene after storyboard approval', price: 600, basis: 'Per scene', unit: 'scenes' },
  { id: 'revision', stage: 2, label: 'Extra revision round', price: 1000, basis: 'Per round', unit: 'rounds' },
  { id: 'vertical', stage: 3, label: 'Vertical 9:16 or square 1:1 version', price: 1000, basis: 'Per version', unit: 'versions' },
  { id: 'runtime', stage: 2, label: 'Extra 30 seconds of runtime', price: 2500, basis: 'Per 30 seconds', unit: '× 30s' },
  { id: 'rewrite', stage: 0, label: 'Script rewrite after approval', price: 1000, basis: 'Resets storyboard and voiceover' },
  { id: 'voice', stage: 0, label: 'Alternate voice or voice re-cast', price: 800, basis: 'After voice approval' },
  { id: 'captions', stage: 3, label: 'Second-language captions', price: 800, basis: 'Per language', unit: 'languages' },
  { id: 'avatar', stage: 2, label: 'Talking avatar or presenter', price: 1500, basis: 'Per video', unit: 'videos' },
]

const TERMS = [
  ['Rate holds for', 'Four or more videos a month, or a six-video batch'],
  ['Payment', '50% deposit per batch, balance on final delivery'],
  ['Feedback window', 'Three business days per delivery'],
  ['Revision rounds', 'One consolidated batch of requests per round'],
]

interface SitePackage {
  id: string
  label: string
  price: number
  from?: boolean
  days: number
  features: string[]
}

const SITES: SitePackage[] = [
  {
    id: 'landing',
    label: 'Landing',
    price: 15000,
    days: 7,
    features: ['Single-page site', 'Contact form and social links', 'Mobile-responsive', 'Domain and hosting setup'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 30000,
    days: 14,
    features: ['Everything in Landing', 'Multiple pages', 'Blog and newsletter signup', 'Analytics and social integration'],
  },
  {
    id: 'store',
    label: 'Business / Store',
    price: 55000,
    from: true,
    days: 21,
    features: ['All of Pro', 'Larger multi-page site', 'Online store with payments', 'Content management system', 'Handover training'],
  },
]

const PROCESS = [
  ['Sitemap & mockup', 'Homepage design and page map approved before any build. Two revision rounds.'],
  ['Build', 'Developed to the approved mockup. Two revision rounds on the built site.'],
  ['Launch', 'Domain connected, hosting live, handover notes. Domain and hosting billed at cost.'],
]

/** Production timeline. Add-ons reference the stage where they can arise. */
const STAGES = [
  { title: 'Script & voice', rounds: 0, included: ['Script from your brief', 'Voice cast to the brand'] },
  { title: 'Storyboard', rounds: 3, included: ['Scene list and visuals', 'Sign-off locks the script and scenes'] },
  { title: 'Video', rounds: 3, included: ['Fully AI-generated footage, no stock'] },
  { title: 'Delivery', rounds: 0, included: ['16:9 master, 1080p', 'Credits, end card, call to action'] },
]

const MAINTENANCE = 2500
const EXTRA_PAGE = 2500

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`font-mono text-[10px] uppercase tracking-[0.22em] text-[#999] ${className}`}>{children}</p>
)

const Check: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    aria-hidden
    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
      on ? 'border-[#f97316] bg-[#f97316] text-white' : 'border-[#cfcbc2] bg-white'
    }`}
  >
    {on && (
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M2 6.5 4.8 9 10 3.5" />
      </svg>
    )}
  </span>
)

const Stepper: React.FC<{ value: number; min?: number; onChange: (n: number) => void; label: string }> = ({
  value,
  min = 0,
  onChange,
  label,
}) => (
  <div className="inline-flex items-center rounded-md border border-[#dedbd2] bg-white" aria-label={label}>
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="h-6 w-6 text-[#555] hover:bg-[#f4f2ed]" aria-label={`Fewer ${label}`}>
      −
    </button>
    <span className="w-6 text-center text-xs font-medium tabular-nums">{value}</span>
    <button type="button" onClick={() => onChange(value + 1)} className="h-6 w-6 text-[#555] hover:bg-[#f4f2ed]" aria-label={`More ${label}`}>
      +
    </button>
  </div>
)

const Fold: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-t border-[#e7e4dc] py-2.5">
    <summary className="flex cursor-pointer list-none items-center justify-between text-xs text-[#333] [&::-webkit-details-marker]:hidden">
      {title}
      <span className="text-[#999] transition-transform group-open:rotate-45">+</span>
    </summary>
    <div className="pt-2 text-xs leading-relaxed text-[#666]">{children}</div>
  </details>
)

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Line {
  label: string
  detail?: string
  amount: number
}

const Rates: React.FC = () => {
  // Trailer
  const [medium, setMedium] = useState<Medium | null>(null)
  const [runtime, setRuntime] = useState<Runtime>(60)
  const [videos, setVideos] = useState(1)
  const [addOns, setAddOns] = useState<Record<string, number>>({})
  const [rush, setRush] = useState(false)

  // Website
  const [site, setSite] = useState<string | null>(null)
  const [extraPages, setExtraPages] = useState(0)
  const [maintenanceMonths, setMaintenanceMonths] = useState(0)

  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<Tab>('trailers')

  // Keep the tab title generic — this page carries no branding.
  useEffect(() => {
    const previous = document.title
    document.title = 'Zeal Rates'
    return () => {
      document.title = previous
    }
  }, [])

  const setAddOn = (id: string, qty: number) =>
    setAddOns((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })

  const quote = useMemo(() => {
    const lines: Line[] = []
    let packagePrice = 0

    if (medium) {
      const unit = TRAILER[medium].price[runtime]
      packagePrice = unit * videos
      lines.push({
        label: `${TRAILER[medium].label} video · ${runtime}s`,
        detail: `${videos} × ${peso(unit)}`,
        amount: packagePrice,
      })
    }

    for (const a of ADD_ONS) {
      const qty = addOns[a.id]
      if (!qty) continue
      lines.push({ label: a.label, detail: qty > 1 ? `${qty} × ${peso(a.price)}` : a.basis, amount: a.price * qty })
    }

    if (rush && packagePrice > 0) {
      lines.push({ label: 'Rush 24-hour turnaround', detail: '+50% on the package price', amount: packagePrice * 0.5 })
    }

    const pkg = SITES.find((s) => s.id === site)
    if (pkg) {
      lines.push({ label: `${pkg.label} website`, detail: pkg.from ? 'Starting price' : `${pkg.days} business days`, amount: pkg.price })
    }
    if (extraPages > 0) {
      lines.push({ label: 'Extra pages', detail: `${extraPages} × ${peso(EXTRA_PAGE)}`, amount: EXTRA_PAGE * extraPages })
    }
    if (maintenanceMonths > 0) {
      lines.push({ label: 'Maintenance', detail: `${maintenanceMonths} month${maintenanceMonths > 1 ? 's' : ''} × ${peso(MAINTENANCE)}`, amount: MAINTENANCE * maintenanceMonths })
    }

    const total = lines.reduce((s, l) => s + l.amount, 0)
    const hasFrom = Boolean(pkg?.from)
    return { lines, total, hasFrom }
  }, [medium, runtime, videos, addOns, rush, site, extraPages, maintenanceMonths])

  const reset = () => {
    setMedium(null)
    setRuntime(60)
    setVideos(1)
    setAddOns({})
    setRush(false)
    setSite(null)
    setExtraPages(0)
    setMaintenanceMonths(0)
  }

  const copySummary = async () => {
    const text = [
      'QUOTE SUMMARY',
      ...quote.lines.map((l) => `${l.label}${l.detail ? ` (${l.detail})` : ''}: ${peso(l.amount)}`),
      `TOTAL${quote.hasFrom ? ' (from)' : ''}: ${peso(quote.total)}`,
      '',
      'Rates in Philippine pesos. Website store package is a starting price.',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const today = new Date().toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Print: hide the interactive app and lay out the quote sheet instead. */}
      <style>{`
        @media print {
          @page { size: A4; margin: 18mm; }
          html, body { background: #fff !important; }
          .app-view { display: none !important; }
          .print-view { display: block !important; }
        }
      `}</style>

      {/* Quote sheet — print only */}
      <section className="print-view hidden text-[#111]">
        <header className="flex items-end justify-between border-b-2 border-[#111] pb-3">
          <div>
            <h1 className="font-display text-3xl tracking-[-0.02em]">Zeal Rates.</h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#666]">Quotation</p>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-[#666]">
            <p>{today}</p>
            <p>Philippine pesos</p>
            <p>Valid 90 days</p>
          </div>
        </header>

        {quote.lines.length === 0 ? (
          <p className="mt-6 text-sm text-[#666]">No items selected.</p>
        ) : (
          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ccc]">
                <th className="pb-2 text-[10px] font-normal uppercase tracking-[0.2em] text-[#888]">Item</th>
                <th className="pb-2 text-right text-[10px] font-normal uppercase tracking-[0.2em] text-[#888]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((l) => (
                <tr key={l.label} className="border-b border-[#eee]">
                  <td className="py-2.5 align-top text-sm">
                    {l.label}
                    {l.detail && <span className="block text-[11px] text-[#888]">{l.detail}</span>}
                  </td>
                  <td className="py-2.5 text-right align-top text-sm font-semibold tabular-nums">{peso(l.amount)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#111]">
                <td className="pt-3 text-[10px] uppercase tracking-[0.2em] text-[#666]">Total{quote.hasFrom ? ' · from' : ''}</td>
                <td className="pt-3 text-right font-display text-2xl tabular-nums">{peso(quote.total)}</td>
              </tr>
            </tbody>
          </table>
        )}

        {medium && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">Included in every video</p>
            <ul className="mt-2 columns-2 gap-8 text-[11px] leading-relaxed text-[#333]">
              {INCLUDED.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </div>
        )}

        {site && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">Website process</p>
            <ol className="mt-2 space-y-1 text-[11px] leading-relaxed text-[#333]">
              {PROCESS.map(([t, b], i) => (
                <li key={t}>
                  {i + 1}. <span className="font-semibold">{t}</span> — {b}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">Terms</p>
          <dl className="mt-2 text-[11px] leading-relaxed text-[#333]">
            {TERMS.map(([k, v]) => (
              <div key={k} className="flex gap-3 py-0.5">
                <dt className="w-40 shrink-0 text-[#888]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-8 border-t border-[#eee] pt-3 text-[10px] leading-relaxed text-[#888]">
          All figures are standing rates in Philippine pesos, not estimates. Add-ons are confirmed in writing before production
          continues. Website store packages are quoted from a starting price.
        </p>
      </section>

    <main className="app-view min-h-screen bg-[#f4f2ed] text-[#111] lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
        {/* Header */}
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div className="flex items-baseline gap-4">
            <h1 className="font-display text-2xl tracking-[-0.02em]">
              Zeal Rates<span className="text-[#f97316]">.</span>
            </h1>
          </div>
          <Label>PHP · valid 90 days</Label>
        </header>

        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Left: tabbed content */}
          <div className="flex min-h-0 flex-col rounded-xl border border-[#e7e4dc] bg-white">
            <div className="flex items-center gap-1 border-b border-[#e7e4dc] px-3 pt-2">
              {(['trailers', 'websites'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 px-2 pb-2 text-xs capitalize transition-colors ${
                    tab === t ? 'border-[#f97316] text-[#111]' : 'border-transparent text-[#999] hover:text-[#111]'
                  }`}
                >
                  {t === 'trailers' ? 'Videos' : 'Websites'}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {tab === 'trailers' ? (
                <>
                  {/* Medium */}
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(TRAILER) as Medium[]).map((m) => {
                      const on = medium === m
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMedium(on ? null : m)}
                          aria-pressed={on}
                          className={`rounded-lg border p-3 text-left transition-colors ${
                            on ? 'border-[#f97316] bg-[#fff6ee]' : 'border-[#e7e4dc] hover:border-[#999]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{TRAILER[m].label}</span>
                            <span className="text-sm font-semibold tabular-nums">{peso(TRAILER[m].price[runtime])}</span>
                          </div>
                          <p className={`mt-1 text-[11px] leading-snug text-[#777]`}>{TRAILER[m].blurb}</p>
                        </button>
                      )
                    })}
                  </div>

                  {/* Runtime + qty */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {([60, 90, 120] as Runtime[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRuntime(r)}
                          aria-pressed={runtime === r}
                          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                            runtime === r ? 'border-[#f97316] bg-[#fff6ee] text-[#111]' : 'border-[#e7e4dc] text-[#666] hover:border-[#999]'
                          }`}
                        >
                          {r}s
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Videos</Label>
                      <Stepper value={videos} min={1} onChange={setVideos} label="videos" />
                    </div>
                  </div>

                  {/* Add-ons */}
                  <Label className="mt-4">Add-ons · confirmed in writing before production continues</Label>
                  <ul className="mt-1.5 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                    {ADD_ONS.map((a) => {
                      const qty = addOns[a.id] ?? 0
                      const on = qty > 0
                      return (
                        <li key={a.id} className="flex items-center gap-2 border-t border-[#f0ede6] py-1.5">
                          <button type="button" onClick={() => setAddOn(a.id, on ? 0 : 1)} aria-pressed={on} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                            <Check on={on} />
                            <span className="min-w-0">
                              <span className="block truncate text-xs text-[#222]">{a.label}</span>
                              <span className="block text-[10px] text-[#999]">{a.basis}</span>
                            </span>
                          </button>
                          {a.unit && on && <Stepper value={qty} onChange={(n) => setAddOn(a.id, n)} label={a.unit} />}
                          <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums">{peso(a.price)}</span>
                        </li>
                      )
                    })}
                    <li className="flex items-center gap-2 border-t border-[#f0ede6] py-1.5">
                      <button type="button" onClick={() => setRush((r) => !r)} aria-pressed={rush} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                        <Check on={rush} />
                        <span className="min-w-0">
                          <span className="block text-xs text-[#222]">Rush 24-hour turnaround</span>
                          <span className="block text-[10px] text-[#999]">On the package price</span>
                        </span>
                      </button>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums">+50%</span>
                    </li>
                  </ul>

                  {/* Fine print */}
                  <div className="mt-4">
                    <Fold title="Included in every video">
                      <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                        {INCLUDED.map((i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check on />
                            {i}
                          </li>
                        ))}
                      </ul>
                    </Fold>
                    <Fold title="Terms">
                      <dl className="grid grid-cols-[130px_1fr] gap-y-1">
                        {TERMS.map(([k, v]) => (
                          <React.Fragment key={k}>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">{k}</dt>
                            <dd>{v}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </Fold>
                    <Fold title="How it works">
                      {/* Vertical rail timeline */}
                      <ol className="relative pl-7">
                        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-[#f97316]/30" />
                        {STAGES.map((st, i) => {
                          const extras = ADD_ONS.filter((a) => a.stage === i)
                          return (
                            <li key={st.title} className="relative pb-4 last:pb-0">
                              <span
                                className={`absolute -left-7 top-0.5 h-4 w-4 rounded-full border-2 border-white ${
                                  i === STAGES.length - 1 ? 'bg-[#f97316]' : 'bg-[#f97316]/40'
                                }`}
                              />
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                <span className="text-xs font-medium text-[#111]">{st.title}</span>
                                {st.rounds > 0 && <span className="text-[11px] text-[#999]">{st.rounds} revision rounds included</span>}
                              </div>
                              <p className="mt-0.5 text-[11px] text-[#666]">{st.included.join(' · ')}</p>
                              {extras.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {extras.map((a) => (
                                    <span key={a.id} className="rounded-full border border-[#e7e4dc] bg-white px-2 py-0.5 text-[10px] text-[#777]">
                                      {a.label} <span className="font-medium text-[#555]">{peso(a.price)}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ol>
                      <p className="mt-3 border-t border-[#f0ede6] pt-2">
                        Two to three days per stage once feedback is in. Requests come in one batch per round, due within three business days. A round covers trims, reorders, music swaps, caption fixes, minor voiceover wording, colour and branding. Anything after sign-off that changes the concept, performer, message or scene list is quoted from the chips above.
                      </p>
                    </Fold>
                  </div>
                </>
              ) : (
                <>
                  <Label>Mockup approved before any build</Label>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {SITES.map((s) => {
                      const on = site === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSite(on ? null : s.id)}
                          aria-pressed={on}
                          className={`rounded-lg border p-3 text-left transition-colors ${
                            on ? 'border-[#f97316] bg-[#fff6ee]' : 'border-[#e7e4dc] hover:border-[#999]'
                          }`}
                        >
                          <span className="block text-xs font-medium">{s.label}</span>
                          <span className="mt-1 block text-sm font-semibold tabular-nums">
                            {s.from && <span className={`mr-1 text-[10px] text-[#999]`}>from</span>}
                            {peso(s.price)}
                          </span>
                          <span className={`block text-[10px] text-[#999]`}>{s.days} business days</span>
                          <ul className={`mt-2 space-y-0.5 text-[11px] leading-snug text-[#666]`}>
                            {s.features.map((f) => (
                              <li key={f}>· {f}</li>
                            ))}
                          </ul>
                        </button>
                      )
                    })}
                  </div>

                  <Label className="mt-4">Optional</Label>
                  <ul className="mt-1.5">
                    <li className="flex items-center justify-between gap-3 border-t border-[#f0ede6] py-1.5">
                      <span>
                        <span className="block text-xs text-[#222]">Maintenance · {peso(MAINTENANCE)} a month</span>
                        <span className="block text-[10px] text-[#999]">Updates, backups, small content changes</span>
                      </span>
                      <Stepper value={maintenanceMonths} onChange={setMaintenanceMonths} label="months" />
                    </li>
                    <li className="flex items-center justify-between gap-3 border-t border-[#f0ede6] py-1.5">
                      <span>
                        <span className="block text-xs text-[#222]">Extra page · {peso(EXTRA_PAGE)} per page</span>
                        <span className="block text-[10px] text-[#999]">Beyond the package</span>
                      </span>
                      <Stepper value={extraPages} onChange={setExtraPages} label="pages" />
                    </li>
                    <li className="border-t border-[#f0ede6] py-1.5">
                      <span className="block text-xs text-[#222]">Domain &amp; hosting</span>
                      <span className="block text-[10px] text-[#999]">Billed at cost, no markup</span>
                    </li>
                  </ul>

                  <Label className="mt-4">Process</Label>
                  <ol className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {PROCESS.map(([title, body], i) => (
                      <li key={title} className="border-t border-[#f0ede6] pt-2">
                        <span className="text-[10px] font-semibold text-[#f97316]">0{i + 1}</span>
                        <span className="ml-2 text-xs font-medium text-[#222]">{title}</span>
                        <p className="mt-0.5 text-[11px] leading-snug text-[#666]">{body}</p>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>

          {/* Right: quote */}
          <aside id="quote" className="flex min-h-0 flex-col rounded-xl border border-[#e7e4dc] bg-white p-4">
            <div className="flex items-baseline justify-between">
              <Label>Your quote</Label>
              {quote.lines.length > 0 && (
                <button type="button" onClick={reset} className="text-[11px] text-[#999] hover:text-[#111]">
                  Clear
                </button>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {quote.lines.length === 0 ? (
                <p className="mt-3 text-xs leading-relaxed text-[#999]">Nothing selected yet. Pick a video style, tick add-ons, or choose a website package.</p>
              ) : (
                <ul className="mt-2">
                  {quote.lines.map((l) => (
                    <li key={l.label} className="flex items-start justify-between gap-3 border-t border-[#f0ede6] py-2">
                      <div className="min-w-0">
                        <p className="text-xs text-[#222]">{l.label}</p>
                        {l.detail && <p className="text-[10px] text-[#999]">{l.detail}</p>}
                      </div>
                      <span className="shrink-0 text-xs font-semibold tabular-nums">{peso(l.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-3 border-t border-[#e7e4dc] pt-3">
              <div className="flex items-baseline justify-between">
                <Label className="text-[#666]">Total{quote.hasFrom ? ' · from' : ''}</Label>
                <p className="font-display text-2xl tabular-nums">{peso(quote.total)}</p>
              </div>
              {medium && <p className="mt-1.5 text-[10px] leading-snug text-[#999]">Rate holds for four or more videos a month, or a six-video batch. 50% deposit per batch.</p>}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copySummary}
                  disabled={quote.lines.length === 0}
                  className="rounded-md bg-[#f97316] px-3 py-2 text-xs text-white transition-colors hover:bg-[#ea6a0f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? 'Copied' : 'Copy summary'}
                </button>
                <button type="button" onClick={() => window.print()} className="rounded-md border border-[#dedbd2] px-3 py-2 text-xs text-[#333] transition-colors hover:border-[#111]">
                  Print
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile running total — the quote panel sits below the content on small screens. */}
      {quote.lines.length > 0 && (
        <a href="#quote" className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between rounded-lg border border-[#e7e4dc] bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur lg:hidden">
          <Label className="text-[#666]">Total{quote.hasFrom ? ' · from' : ''}</Label>
          <span className="flex items-center gap-3">
            <span className="font-display text-lg tabular-nums">{peso(quote.total)}</span>
            <span className="text-[11px] text-[#f97316]">View ↓</span>
          </span>
        </a>
      )}
    </main>
    </>
  )
}

export default Rates
