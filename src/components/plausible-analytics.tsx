import { useEffect } from 'react'

const DOMAIN = 'www.bymelty.shop'

export function PlausibleAnalytics() {
  useEffect(() => {
    const existing = document.querySelector(
      `script[data-domain="${DOMAIN}"][src*="plausible.io"]`,
    )
    if (existing) return

    const s = document.createElement('script')
    s.defer = true
    s.setAttribute('data-domain', DOMAIN)
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)

    return () => {
      s.remove()
    }
  }, [])

  return null
}
