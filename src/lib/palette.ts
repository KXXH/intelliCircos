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

export const gieStainColor = {
  gpos100: 'rgb(0,0,0)',
  gpos: 'rgb(0,0,0)',
  gpos75: 'rgb(130,130,130)',
  gpos66: 'rgb(160,160,160)',
  gpos50: 'rgb(200,200,200)',
  gpos33: 'rgb(210,210,210)',
  gpos25: 'rgb(200,200,200)',
  gvar: 'rgb(220,220,220)',
  gneg: 'rgb(255,255,255)',
  acen: 'rgb(217,47,39)',
  stalk: 'rgb(100,127,164)',
  select: 'rgb(135,177,255)'
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

export function testColor() {
  return CategoryPalettes.schemeCategory10
}