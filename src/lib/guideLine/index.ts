import type { TrackBase } from '@/lib/circos'

export interface CurvePoint {
  x: number
  y: number
}

export function createCurveFromTrackAndElement(track: TrackBase, svgElement: SVGGraphicsElement, targetElement: Element) {
  const svgRect = svgElement.getBoundingClientRect()
  const targetRect = targetElement.getBoundingClientRect()
  const svgCtm = svgElement.getScreenCTM()!
  const cx = svgRect.x + svgRect.width / 2
  const cy = svgRect.y + svgRect.height / 2
  const r = ((track.r0 + track.r1) / 2) * svgCtm.a
  const tx = targetRect.x + targetRect.width / 2
  const ty = targetRect.y + targetRect.height / 2
  const dy = ty - cy
  const directionX = targetRect.x > svgRect.x ? 1 : -1
  const absX = Math.sqrt(r * r - dy * dy)
  const midX = cx + directionX * absX
  const midY = ty
  return [
    { x: cx, y: cy },
    { x: midX, y: midY },
    { x: tx, y: ty },
  ]
}
