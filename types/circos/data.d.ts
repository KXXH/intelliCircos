export interface KaryotypeData {
  id: string
  label: string
  len: number
  color: string
  [key: string]: any
}

export interface GenomeData {
  chromosome: string
  start: number
  end: number
  value: number
  [key: string]: any
}

interface EndpointData {
  id: string
  start: number
  end: number
  [key: string]: any
}

export interface ChordData {
  start: EndpointData
  end: EndpointData
  [key: string]: any
}
