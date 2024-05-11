import { cloneDeep } from 'lodash-es'
import type { ITrackConfig } from '.'

export function fixConfig(config: Partial<ITrackConfig>): Partial<ITrackConfig> {
  const newConfig = cloneDeep(config)
  if (newConfig.logScale && newConfig.min === 0)
    newConfig.min = 0.0001

  return newConfig
}
