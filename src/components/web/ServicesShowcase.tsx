import React from 'react'
import { motion } from 'framer-motion'
import { SERVICES } from './content'

const EASE = [0.22, 1, 0.36, 1] as const

/** Line icons, one per service (keyed by SERVICES[].id). */
const ICONS: Record<string, React.ReactNode> = {
  // browser window
  websites: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.8" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M7 13h6M7 16h4" />
    </>
  ),
  // funnel
  funnels: <path d="M3.5 4.5h17l-6.5 8v6l-4 1.5v-7.5l-6.5-8Z" />,
  // lightning bolt
  automation: <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8Z" />,
}

/** What we build: three open columns split by hairlines — no card boxes. */
const ServicesShowcase: React.FC = () => (
  <div className="mt-14 grid grid-cols-1 divide-y divide-black/[0.08] border-y border-black/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0">
    {SERVICES.map((svc, i) => (
      <motion.article
        key={svc.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
        className="group flex flex-col py-10 md:px-8 md:py-12 md:first:pl-0 md:last:pr-0 lg:px-10"
      >
        <span
          aria-hidden
          className="block w-fit text-[#f97316] transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            {ICONS[svc.id]}
          </svg>
        </span>

        <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#111]">{svc.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[#666]">{svc.blurb}</p>

        <ul className="mt-6 space-y-2">
          {svc.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#444]">
              <svg viewBox="0 0 16 16" fill="none" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#f97316]" aria-hidden>
                <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </motion.article>
    ))}
  </div>
)

export default ServicesShowcase
