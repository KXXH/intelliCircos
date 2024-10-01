import { add, cloneDeep } from 'lodash-es'
import type { ITrack } from '../circos'
import { useSmartMerge } from '../circos/smartMerge'
import { useFigureStore } from '@/stores/figure'

const tokenizeRe = /(?:<(\w+)>)/g

function trackConfig2CTML(tracks: ITrack[]): string {
  const skeleton = tracks.map(t => ({
    type: t.type,
    innerRadius: t.config.innerRadius,
    outerRadius: t.config.outerRadius,
  })).sort((a, b) => a.innerRadius - b.innerRadius)

  const CTMLTracks = []
  let lastOuterRadius = 0
  let tempTracks = ['']
  for (const token of skeleton) {
    if (token.innerRadius >= lastOuterRadius) {
      CTMLTracks.push(tempTracks)
      tempTracks = []
    }
    tempTracks.push(`<${token.type.replace('layout', 'ideogram')}>`)
    lastOuterRadius = token.outerRadius
  }
  CTMLTracks.push(tempTracks)
  CTMLTracks.push([''])
  return `<START>${CTMLTracks.slice(1, -1).reverse().map(t => t.join('')).join('<split>')}<END>`
}

function isCompatible(current: Array<Array<string>>, recommendation: Array<Array<string>>): boolean {
  const currentCTML = current.map(t => t.join('')).join('<split>')
  const recommendationCTML = recommendation.map(t => t.join('')).join('<split>')
  return recommendationCTML.startsWith(currentCTML)
}

export function applyRecommendation(currentCTML: string, recommendation: string) {
  // const currentCTML = trackConfig2CTML(ctx)
  // console.log('currentCTML: ' + currentCTML)
  // console.log('recommendation: ' + recommendation)
  const { addPartialTrack, addMultiplePartialTracks } = useSmartMerge()
  const figureStore = useFigureStore()
  // TODO【BUG 比较逻辑问题】当使用合成轨道时，例如推荐使用了两个，而当前只有一个轨道，则会不能推荐
  const currentTokens = currentCTML
    .split('<split>')
    .map(
      sub => Array.from(sub.matchAll(tokenizeRe))
        .map(match => match[1])
        .filter(token => token.toUpperCase() !== 'START' && token.toUpperCase() !== 'END')
        .sort(),
    )
  const trackTokens = recommendation
    .split('<split>')
    .map(
      sub => Array.from(sub.matchAll(tokenizeRe))
        .map(match => match[1])
        .filter(token => token.toUpperCase() !== 'START' && token.toUpperCase() !== 'END')
        .sort(),
    )
  // console.log('currentTokens: ' + currentTokens)
  // console.log('trackTokens: ' + trackTokens)
  // 二维字符串数组，每个元素是一个字符串数组，表示一个track中的轨道类型
  const newTokens = trackTokens.slice(currentTokens.length)

  // console.log(currentTokens, trackTokens, isCompatible(currentTokens, trackTokens), newTokens)
  if (!isCompatible(currentTokens, trackTokens))
    throw new Error('This Recommendation is not compatible with the current configuration')
  for (const track of newTokens) {
    // console.log(`Adding track: ${track}`)
    if (track.length > 1) {
      const tracks = addMultiplePartialTracks(track.map(t => ({
        config: {},
        type: t,
      })), figureStore.tracks, 'in', {
        innerRadius: figureStore.layout?.config.innerRadius ?? figureStore.width,
        outerRadius: figureStore.layout?.config.outerRadius ?? figureStore.width,
      })
      figureStore.tracks = tracks
    }
    else {
      const tracks = addPartialTrack({
        config: {},
        type: track[0],
      }, figureStore.tracks, 'in', {
        innerRadius: figureStore.layout?.config.innerRadius ?? figureStore.width,
        outerRadius: figureStore.layout?.config.outerRadius ?? figureStore.width,
      })
      figureStore.tracks = tracks
    }
  }
  // const newCtx = cloneDeep(ctx)

  // return newCtx
}
