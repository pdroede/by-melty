/** Imperative segment loop for HTMLVideoElement (not React state). */
export function attachVideoSegmentLoop(
  video: HTMLVideoElement,
  clip: { startSec: number; endSec: number },
): () => void {
  const { startSec, endSec } = clip

  const clampEnd = () => {
    const dur = video.duration
    if (!Number.isFinite(dur) || dur <= 0) return endSec
    return Math.min(endSec, Math.max(startSec + 0.1, dur - 0.05))
  }

  const onTime = () => {
    const loopEnd = clampEnd()
    if (video.currentTime >= loopEnd) {
      video.currentTime = startSec
      void video.play().catch(() => {})
    }
  }

  const onMeta = () => {
    const loopEnd = clampEnd()
    if (video.currentTime < startSec || video.currentTime > loopEnd) {
      video.currentTime = startSec
    }
  }

  video.addEventListener('timeupdate', onTime)
  video.addEventListener('loadedmetadata', onMeta)
  onMeta()

  return () => {
    video.removeEventListener('timeupdate', onTime)
    video.removeEventListener('loadedmetadata', onMeta)
  }
}
