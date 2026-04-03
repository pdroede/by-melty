import type { LifestyleQuadrant } from '@/lib/lifestyle-image'

export type FeatureImage =
  | { kind: 'quadrant'; quadrant: LifestyleQuadrant }
  | {
      kind: 'cover'
      src: string
      /** `contain` shows the full photo (no crop) — use for wide / multi-panel shots */
      fit?: 'cover' | 'contain'
    }
