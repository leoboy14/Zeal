/**
 * Copy + data for the Zeal Dev landing page (web.zealhighlights.com).
 *
 * Package names, timelines and features mirror SITES / PROCESS in
 * src/pages/Rates.tsx — prices are deliberately left off this public page.
 */

export const CONTACT_URL = 'https://zealhighlights.com/contact'
export const MAIN_SITE_URL = 'https://zealhighlights.com'
export const EMAIL = 'info@zealhighlights.com'

export type Site = {
  id: string
  name: string
  domain: string
  industry: string
  description: string
}

export const SITES: Site[] = [
  {
    id: 'smartcitiesnetwork',
    name: 'Smart Cities Network',
    domain: 'smartcitiesnetwork.net',
    industry: 'Civic · Nonprofit',
    description:
      'A regional platform connecting thought leaders, innovators and governments to build sustainable smart cities across Southeast Asia.',
  },
  {
    id: 'abcteachy',
    name: 'ABC Teachy',
    domain: 'abcteachy.com',
    industry: 'Education',
    description:
      'A playful, parent-friendly home for 1-on-1 English lessons, from meeting the tutors to booking a free trial.',
  },
  {
    id: 'aaronkeel',
    name: 'Aaron Keel Ministries',
    domain: 'aaronkeel.com',
    industry: 'Ministry',
    description:
      'A speaker’s story told with warmth and restraint, with clear paths to book him for an event or give.',
  },
  {
    id: 'adxconstruction',
    name: 'ADX Construction',
    domain: 'adxconstruction.org',
    industry: 'Construction',
    description:
      'A bold, no-nonsense site for a local construction crew: seven trades, a gallery of real jobs, and free quotes a tap away.',
  },
  {
    id: 'zealhighlights',
    name: 'Zeal Highlights',
    domain: 'zealhighlights.com',
    industry: 'Creative agency',
    description:
      'Our own studio site: motion-first, reel-led, and built to show video work at its best.',
  },
]

export const siteHero = (id: string) => `/web/sites/${id}-hero.webp`
export const siteFull = (id: string) => `/web/sites/${id}-full.webp`

export type Package = {
  id: string
  name: string
  days: number
  summary: string
  features: string[]
  featured?: boolean
}

export const PACKAGES: Package[] = [
  {
    id: 'landing',
    name: 'Landing',
    days: 7,
    summary: 'One focused page that tells people who you are and how to reach you.',
    features: ['Single-page site', 'Contact form and social links', 'Mobile-responsive', 'Domain and hosting setup'],
  },
  {
    id: 'pro',
    name: 'Pro',
    days: 14,
    summary: 'Room to grow: several pages, fresh content and a way to keep people coming back.',
    features: ['Everything in Landing', 'Multiple pages', 'Blog and newsletter signup', 'Analytics and social integration'],
    featured: true,
  },
  {
    id: 'store',
    name: 'Business / Store',
    days: 21,
    summary: 'A larger site that sells, with the tools and training to run it yourself.',
    features: ['All of Pro', 'Larger multi-page site', 'Online store with payments', 'Content management system', 'Handover training'],
  },
]

/** Longest package — used to scale the timeline bars. */
export const MAX_DAYS = 21

export const PROCESS = [
  {
    title: 'Sitemap & mockup',
    body: 'We map your pages and design the homepage in your look. Nothing gets built until you approve it.',
    rounds: 2,
  },
  {
    title: 'Build',
    body: 'Our developers build to the approved mockup, then you review the real, working site.',
    rounds: 2,
  },
  {
    title: 'Launch',
    body: 'Domain connected, hosting live, handover notes in your inbox. Domain and hosting are billed at cost.',
    rounds: 0,
  },
]

export const FAQ = [
  {
    q: 'Who actually designs and builds my site?',
    a: 'Real designers and developers on the Zeal team. We use AI tools to move faster on the busywork, but every layout, line of copy and page is directed, reviewed and shipped by people.',
  },
  {
    q: 'We’re not in any of those industries. Can you still help?',
    a: 'Yes. The five sites above are deliberately different. We start from your brand, your audience and what you need visitors to do, not from a template.',
  },
  {
    q: 'Do I need my own domain and hosting?',
    a: 'No. We set both up for you as part of every package. Both are billed at cost.',
  },
  {
    q: 'How much does it cost?',
    a: 'It depends on the package and anything extra you need, like more pages or ongoing maintenance. Tell us about your project and we’ll send a clear quote.',
  },
]

/** "How we work": what people own vs what AI speeds up. No stats, no claims of automation. */
export const HUMAN_AI = [
  {
    title: 'People do the thinking',
    human: true,
    items: [
      'Get to know your brand, your audience and what visitors need to do',
      'Design every layout and choose the look with you',
      'Write, review and test the code behind every page',
      'Launch the site and walk you through the handover',
    ],
  },
  {
    title: 'AI speeds up the busywork',
    human: false,
    items: [
      'First drafts of copy and page structure, for our team to refine',
      'Preparing and resizing images and other assets',
      'Repetitive, boilerplate parts of the build',
      'Quicker turnarounds on your revision rounds',
    ],
  },
]
