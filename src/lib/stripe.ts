/** Default: Stripe Payment Link (no API — checkout hosted by Stripe). Override with VITE_STRIPE_PAYMENT_LINK in .env if the link changes. */
const DEFAULT_STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/9B6aEYc9rb0Y0DsdY2dfG05'

export function getStripePaymentUrl(): string {
  const fromEnv = import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined
  const candidate = (fromEnv?.trim() || DEFAULT_STRIPE_PAYMENT_LINK).trim()
  return candidate.startsWith('https://') && candidate.includes('stripe.com') ? candidate : ''
}
