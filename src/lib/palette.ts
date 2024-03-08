import { schemeAccent, schemeCategory10, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10 } from 'd3'
import { sample } from 'lodash-es'

export const CategoryPalettes = {
  schemeTableau10,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
}

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

export function generateRandomCategoryPalette() {
  return generateCategorialPalette(sample(Object.values(CategoryPalettes)))
}
