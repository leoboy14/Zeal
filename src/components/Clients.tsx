import React from 'react'

/**
 * Client / partner logo strip.
 *
 * These are text wordmarks — swap each entry for a real logo
 * (an <img src="/clients/acme.svg" .../>) when you have the assets.
 */
const CLIENTS = [
  'Tattuds',
  'Bioblade',
  'Claymotion',
  'Balloon Boutique',
  'Smart Cities Network',
  'ABCTeachy',
  'Insider',
  'VRef',
]

const ClientLogo: React.FC<{ name: string }> = ({ name }) => (
  <span className="shrink-0 px-8 sm:px-12 font-montserrat font-bold text-xl sm:text-2xl tracking-tight text-[#9a978d] transition-colors duration-300 hover:text-[#111] whitespace-nowrap">
    {name}
  </span>
)

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
                {CLIENTS.map((name) => (
                  <ClientLogo key={`${track}-${name}`} name={name} />
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
