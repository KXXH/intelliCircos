import { schemeTableau10 } from 'd3'

export function* generateCategorialPalette(palette?: readonly string[], infinite = false) {
  if (!palette || palette.length === 0)
    palette = schemeTableau10
  let i = 0
  // eslint-disable-next-line no-unmodified-loop-condition
  while (infinite || i < palette.length) {
    yield palette[i % palette.length]
    i++
  }
}
