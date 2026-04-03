'use client'

/**
 * Product mug video with chroma-key: removes a solid background so only the mug shows
 * on the page (transparent WebGL canvas). The backdrop must be **one even colour** across
 * the frame. Tune `keyColor` / `threshold` / `feather` — e.g. black/grey `#1a1a1a`, green `#00ff00`,
 * white `#ffffff`. Gradients or busy rooms will not key cleanly; re-export with a flat or green screen.
 */
import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, useVideoTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

import { attachVideoSegmentLoop } from '@/lib/video-segment-loop'
import { cn } from '@/lib/utils'

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D map;
uniform vec3 keyColor;
uniform float threshold;
uniform float feather;
varying vec2 vUv;

void main() {
  vec4 c = texture2D(map, vUv);
  float mask = distance(c.rgb, keyColor);
  float a = smoothstep(threshold, threshold + feather, mask);
  if (a < 0.001) discard;
  gl_FragColor = vec4(c.rgb, a);
}
`

export interface RotatingMugProps {
  width?: number
  height?: number
  className?: string
  /** Video under `public/` */
  src?: string
  /**
   * Loop only this segment (seconds). Use to skip the start/end where the backdrop is still visible.
   * Omit for full-file loop.
   */
  videoClip?: { startSec: number; endSec: number }
  /**
   * Background colour to remove (hex). Match your footage:
   * green screen → #00ff00, white → #ffffff, black → #000000.
   */
  keyColor?: string
  /** How close to `keyColor` counts as background (0–1-ish; lower = stricter) */
  threshold?: number
  /** Edge softness between key and subject */
  feather?: number
}

function ChromaVideoPlane({
  src,
  keyColor,
  threshold,
  feather,
  videoClip,
}: Required<Pick<RotatingMugProps, 'src' | 'keyColor' | 'threshold' | 'feather'>> & {
  videoClip?: RotatingMugProps['videoClip']
}) {
  const texture = useVideoTexture(src, {
    muted: true,
    loop: !videoClip,
    start: true,
  })
  const [aspect, setAspect] = useState(16 / 9)

  useEffect(() => {
    const video = texture.image as HTMLVideoElement
    const syncAspect = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspect(video.videoWidth / video.videoHeight)
      }
    }
    syncAspect()
    video.addEventListener('loadedmetadata', syncAspect)
    return () => video.removeEventListener('loadedmetadata', syncAspect)
  }, [texture, src])

  useEffect(() => {
    if (!videoClip || videoClip.endSec <= videoClip.startSec) return
    const video = texture.image as HTMLVideoElement
    return attachVideoSegmentLoop(video, videoClip)
  }, [texture, src, videoClip])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        keyColor: { value: new THREE.Color(keyColor) },
        threshold: { value: threshold },
        feather: { value: feather },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [texture, keyColor, threshold, feather])

  useEffect(() => {
    return () => material.dispose()
  }, [material])

  const w = 2 * aspect
  const h = 2

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 2]} left={-aspect} right={aspect} top={1} bottom={-1} near={0.1} far={10} />
      <mesh renderOrder={1}>
        <planeGeometry args={[w, h]} />
        <primitive object={material} attach="material" />
      </mesh>
    </>
  )
}

export default function RotatingMug({
  width = 800,
  height = 420,
  className,
  src = '/spinning-mug-alpha.mp4',
  videoClip,
  keyColor = '#00ff00',
  threshold = 0.28,
  feather = 0.1,
}: RotatingMugProps) {
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ maxWidth: width, maxHeight: height }}
    >
      <div className="h-[min(420px,55vh)] w-full min-h-[260px] overflow-hidden rounded-2xl bg-transparent">
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
          }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          onCreated={({ gl, scene }) => {
            scene.background = null
            gl.setClearColor(0x000000, 0)
          }}
        >
          <Suspense fallback={null}>
            <ChromaVideoPlane
              src={src}
              keyColor={keyColor}
              threshold={threshold}
              feather={feather}
              videoClip={videoClip}
            />
          </Suspense>
        </Canvas>
      </div>
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-chocolate-950/75 px-2 py-1 text-[11px] text-marshmallow-muted backdrop-blur-sm">
        Keyed clip · adjust start/end or colour if edges look off
      </p>
    </div>
  )
}

export const RotatingEarth = RotatingMug
