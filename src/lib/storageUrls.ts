/** Public Storage URLs for the `VITE_SUPABASE_TEAM_BUCKET` bucket (default: `team`). */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') ?? ''
const teamBucket = import.meta.env.VITE_SUPABASE_TEAM_BUCKET ?? 'team'

function encodedPathSegments(pathInBucket: string): string {
  return pathInBucket
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/**
 * Returns a public object URL for a file in the team portraits bucket.
 * Path is relative to bucket root (e.g. `Harhley Ponce.png`).
 * With `VITE_SUPABASE_URL` set, uses Storage public URLs for bucket `{VITE_SUPABASE_TEAM_BUCKET}` (default `team`).
 * In dev, if the URL is unset, falls back to `/team/...` alongside `public/team/`.
 */
export function teamPortraitStorageUrl(pathInBucket: string): string {
  const path = encodedPathSegments(pathInBucket)
  if (!supabaseUrl) {
    if (import.meta.env.DEV) {
      return `/team/${path}`
    }
    throw new Error('Missing VITE_SUPABASE_URL')
  }
  return `${supabaseUrl}/storage/v1/object/public/${teamBucket}/${path}`
}
