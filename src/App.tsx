import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { PlausibleAnalytics } from '@/components/plausible-analytics'
import { BuyButton3D } from '@/components/ui/buy-button-3d'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { MugGalleryVideo } from '@/components/ui/mug-gallery-video'
import { ParallaxScrollFeatureSection } from '@/components/ui/parallax-scroll-feature-section'
import { ParallaxScrolling } from '@/components/ui/parallax-scrolling'
import { PhotoCards3D } from '@/components/ui/photo-cards-3d'
import { ScrollParallaxSection } from '@/components/ui/scroll-parallax-section'
import { getStripePaymentUrl } from '@/lib/stripe'
import { cn } from '@/lib/utils'

const stripeUrl = getStripePaymentUrl()

function trackCta(location: string) {
  const w = window as unknown as { plausible?: (e: string, o?: object) => void }
  if (typeof w.plausible === 'function') {
    w.plausible('CTA Click', { props: { location } })
  }
}

function BuyLink({
  children,
  className,
  location,
}: {
  children: ReactNode
  className?: string
  location: string
}) {
  const href = stripeUrl || '#buy'
  const valid = Boolean(stripeUrl)

  return (
    <a
      href={href}
      target={valid ? '_blank' : undefined}
      rel={valid ? 'noopener noreferrer' : undefined}
      className={className}
      data-location={location}
      onClick={() => trackCta(location)}
    >
      {children}
    </a>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
    <>
      <PlausibleAnalytics />
      <a
        href="#content"
        className="focus:bg-marshmallow focus:text-chocolate-900 sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-melty-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-melty-white/65">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#" className="font-display text-2xl text-chocolate-900">
            ByMelty
          </a>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <nav className="flex items-center gap-3 text-sm font-semibold text-chocolate-700 sm:gap-5">
              <a href="#features-intro" className="transition hover:text-chocolate-900">
                Discover
              </a>
              <a href="#how-it-works" className="transition hover:text-chocolate-900">
                How it works
              </a>
              <a href="#ready" className="transition hover:text-chocolate-900">
                Ready
              </a>
              <a href="#gallery-3d" className="transition hover:text-chocolate-900">
                Gallery
              </a>
            </nav>
            <BuyLink
              location="header-buy"
              className={cn(
                'rounded-full bg-marshmallow px-5 py-3 text-sm font-semibold text-chocolate-900 shadow-md transition hover:bg-melty-white sm:px-6 sm:py-4',
              )}
            >
              Buy now
            </BuyLink>
          </div>
        </div>
      </header>

      <main id="content">
        <ParallaxScrolling videoClip={{ startSec: 0, endSec: 6 }} />

        <ScrollParallaxSection backgroundClassName="bg-marshmallow" parallaxRange={48}>
          <ParallaxScrollFeatureSection />
        </ScrollParallaxSection>

        <ScrollParallaxSection
          id="scroll-showcase"
          className="overflow-hidden border-t border-black/[0.06]"
          backgroundClassName="bg-marshmallow"
          parallaxRange={52}
        >
          <ContainerScroll
            titleComponent={
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chocolate-600">
                  Discover
                </p>
                <h2 className="mt-2 font-display text-4xl text-chocolate-900 md:text-6xl">
                  Scroll into the ritual
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-chocolate-700">
                  Warm moments — the mug comes forward as you move down the page.
                </p>
              </>
            }
          >
            <img
              src="/bymelty-lifestyle-trio.png"
              alt="ByMelty fondue mug in three cozy settings"
              className="mx-auto h-full w-full rounded-2xl object-cover object-center"
              draggable={false}
            />
          </ContainerScroll>
        </ScrollParallaxSection>

        <ScrollParallaxSection
          id="ready"
          className="border-t border-black/[0.06] px-4 py-20 sm:px-6"
          backgroundClassName="bg-gradient-to-b from-marshmallow via-marshmallow-deep/40 to-marshmallow"
          parallaxRange={56}
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.h2
              className="font-display text-5xl text-chocolate-900 sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to melt?
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-chocolate-700"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              Drag the cards — then scroll on to see the mug clip and checkout.
            </motion.p>
            <PhotoCards3D
              className="mt-12"
              cards={[
                {
                  src: '/bymelty-chocolat-dip.png',
                  alt: 'Chocolat fondue mug — dip and share',
                  rotation: -9,
                  caption: 'Hygge & heat',
                },
                {
                  src: '/bymelty-studio-hero.png',
                  alt: 'ByMelty Chocolat mug — studio',
                  rotation: 13,
                  caption: 'Pour. Dip. Melt.',
                },
              ]}
            />
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <a
                href="#gallery-3d"
                className="text-sm font-semibold uppercase tracking-[0.15em] text-chocolate-600 underline-offset-4 hover:text-chocolate-800 hover:underline"
              >
                Next: gallery
              </a>
            </motion.div>
          </div>
        </ScrollParallaxSection>

        <ScrollParallaxSection
          id="gallery-3d"
          className="border-t border-black/[0.06]"
          backgroundClassName="bg-mug-gallery-bg"
          parallaxRange={72}
        >
          <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16">
            <h2 className="text-center font-display text-4xl text-chocolate-900 sm:text-5xl">
              The mug in 3D
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-chocolate-700">
              One surface with the footage — scroll, no frame around the clip.
            </p>
          </div>
          <MugGalleryVideo src="/caneca-girando.mp4" className="w-full" />
        </ScrollParallaxSection>

        <ScrollParallaxSection
          id="buy"
          className="border-t border-black/[0.06] px-4 py-24 text-center sm:px-6"
          backgroundClassName="bg-gradient-to-b from-mug-gallery-bg via-marshmallow to-marshmallow-deep"
          parallaxRange={64}
        >
          <div className="mx-auto max-w-lg">
            <motion.h2
              className="font-display text-4xl text-chocolate-900 sm:text-5xl"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Get your ByMelty
            </motion.h2>
            <p className="mt-4 text-lg text-chocolate-700">
              Secure checkout powered by Stripe. You will receive a confirmation email after purchase.
            </p>
            <div className="mt-10 flex justify-center">
              {stripeUrl ? (
                <BuyButton3D href={stripeUrl} onClick={() => trackCta('stripe-checkout-3d')}>
                  Buy now
                </BuyButton3D>
              ) : (
                <BuyButton3D disabled>Buy now</BuyButton3D>
              )}
            </div>
            {!stripeUrl && (
              <p className="mt-6 text-sm text-chocolate-600">
                Add <code className="rounded bg-black/[0.06] px-1.5 py-0.5">VITE_STRIPE_PAYMENT_LINK</code> in{' '}
                <code className="rounded bg-black/[0.06] px-1.5 py-0.5">.env</code> for live checkout.
              </p>
            )}
          </div>
        </ScrollParallaxSection>
      </main>

      <footer className="border-t border-black/[0.06] bg-melty-white px-4 py-12 text-center text-sm text-chocolate-700 sm:px-6">
        <p className="font-display text-xl text-chocolate-900">ByMelty</p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} ByMelty. All rights reserved.
        </p>
        <p className="mt-2">
          Contact:{' '}
          <a
            href="mailto:bymelty.fondue@gmail.com"
            className="text-chocolate-800 underline-offset-2 hover:underline"
          >
            bymelty.fondue@gmail.com
          </a>
        </p>
      </footer>
    </>
    </SmoothScrollProvider>
  )
}
