/** Composite lifestyle grid (2×2) — `/public/bymelty-lifestyle-grid.png` */
export const LIFESTYLE_GRID_SRC = '/bymelty-lifestyle-grid.png'

export type LifestyleQuadrant = 'tl' | 'tr' | 'bl' | 'br'

export const quadrantBackgroundPosition: Record<LifestyleQuadrant, string> = {
  tl: '0% 0%',
  tr: '100% 0%',
  bl: '0% 100%',
  br: '100% 100%',
}
