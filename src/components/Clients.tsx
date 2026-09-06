import React, { useState } from 'react'

/**
 * Client / partner logo strip.
 *
 * Logos come from the Zeal Highlights asset sheet, knocked out to
 * transparent PNGs and flattened to one ink colour so the strip reads as a
 * set. Career365, Bioblade, Gainium and Isla Capital are the clients'
 * official marks; the rest are frame crops from the delivered footage
 * (screen-resolution — worth replacing with vector files before launch).
 * Anything without a logo file falls back to its wordmark.
 */
export type Client = { name: string; logo?: string }

export const CLIENTS: Client[] = [
  { name: 'Career365', logo: '/clients/career365.png' },
  { name: 'Bioblade', logo: '/clients/bioblade.png' },
  { name: 'Gainium', logo: '/clients/gainium.png' },
  { name: 'Isla Capital', logo: '/clients/isla-capital.png' },
  { name: 'onedash', logo: '/clients/onedash.png' },
  { name: 'Astute Choice Packaging', logo: '/clients/astute-choice-packaging.png' },
  { name: 'Neuro Vital', logo: '/clients/neuro-vital.png' },
  { name: 'DermaPaws', logo: '/clients/dermapaws.png' },
  // No usable logo file for these two yet — they render as wordmarks.
  { name: 'The Modern Resume Lens' },
  { name: 'Motion Podcast' },
]

const Wordmark: React.FC<{ name: string }> = ({ name }) => (
  <span className="font-montserrat text-xl font-bold tracking-tight text-[#9a978d] transition-colors duration-300 group-hover:text-[#111] sm:text-2xl">
    {name}
  </span>
)

export const ClientLogo: React.FC<{ client: Client }> = ({ client }) => {
  const [failed, setFailed] = useState(false)

  return (
    <span className="group flex shrink-0 items-center justify-center whitespace-nowrap px-8 sm:px-12">
      {client.logo && !failed ? (
        <img
          src={client.logo}
          alt={client.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-7 w-auto max-w-[150px] object-contain opacity-45 transition duration-300 group-hover:opacity-100 sm:h-8 sm:max-w-[170px]"
        />
      ) : (
        <Wordmark name={client.name} />
      )}
    </span>
  )
}

const Clients: React.FC = () => {
  return (
    <section className="relative w-full bg-[#f4f2ed] py-14 sm:py-16 border-t border-[#e7e4dc]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#777] font-mono uppercase mb-10">
          Trusted by brands &amp; founders shipping every week
        </p>

        {/* Edge-faded infinite marquee */}
        <div
          className="marquee-pause relative overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div className="flex w-max animate-marquee">
            {/* two identical tracks for a seamless loop */}
            {[0, 1].map((track) => (
              <div key={track} className="flex items-center" aria-hidden={track === 1}>
                {CLIENTS.map((client) => (
                  <ClientLogo key={`${track}-${client.name}`} client={client} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clients
