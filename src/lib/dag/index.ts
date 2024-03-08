import { Graph, alg, json } from '@dagrejs/graphlib'
import { chain, intersection, uniq } from 'lodash-es'
import dot from '@dagrejs/graphlib-dot'
import { set, string } from 'zod'
import { color, interpolateBlues, interpolateGreens, interpolateGreys, interpolateRgb, scaleOrdinal, scaleSequential, schemeTableau10 } from 'd3'

const tracks = [
  '<ideogram><split><chord>',
  '<ideogram><split><highlight><split><highlight><split><highlight><split><highlight><split><line><split><line>',
  '<ideogram><split><highlight><split><highlight><split><highlight><split><highlight><split><highlight><split><line><split><line>',
  '<scatter><split><ideogram><split><line><split><line>',
  '<ideogram><split><heatmap><split><heatmap><split><chord>',
  '<ideogram><split><highlight><split><line><split><highlight><split><scatter>',
  '<ideogram><split><heatmap><split><heatmap><split><chord>',
  '<ideogram><split><histogram><split><histogram><split><histogram><split><histogram><split><chord>',
  '<ideogram><split><highlight><split><chord>',
  '<ideogram><split><chord>',
  '<ideogram><split><chord>',
]

export function buildNetwork(seqs: string[][]): Graph {
  const G = new Graph({ directed: true })
  // const step = 0
  const vSeqs = seqs.map(seq => ['START', ...seq, 'END'])
  let id = 1
  const maxStep = Math.max(...vSeqs.map(seq => seq.length))
  let lastStepMemo: { [key: string]: string } = {
    START: '0',
  }
  G.setNode('0', { label: 'START' })
  G.setNode('999', { label: 'END' })
  for (let step = 1; step <= maxStep; step++) {
    const stepMemo: any = {}
    for (const seq of vSeqs) {
      if (step >= seq.length)
        continue

      const v = seq[step]
      if (v === 'END') {
        stepMemo[v] = 999
      }
      else if (!(v in stepMemo)) {
        stepMemo[v] = (id).toString()
        id++
        G.setNode(stepMemo[v], { label: v })
      }
      G.setEdge(lastStepMemo[seq[step - 1]], stepMemo[v])
    }
    lastStepMemo = stepMemo
  }
  return G
}

export function splitTracks(tracks: string[]) {
  const re = /<\w+>/g
  return tracks.map(track => track.match(re)).filter(Boolean).map(i => [...i!])
}

export function tracks2graph(tracks: string[]) {
  const splitedTracks = splitTracks(tracks)
  return buildNetwork(splitedTracks)
}

function _copy(G: Graph) {
  return json.read(json.write(G))
}

function _merge(G: Graph, node_1: string, node_2: string) {
  const preds = G.predecessors(node_2) ?? []
  const succs = G.successors(node_2) ?? []
  for (const pred of preds)
    G.setEdge(pred, node_1)

  for (const succ of succs)
    G.setEdge(node_1, succ)

  G.removeNode(node_2)
}

export function simplifyGraph(G: Graph, root: string = '0', depth: number = 1) {
  const _parents: { [key: string]: Set<string> } = {}
  const _layers = []
  let _queue = [root]
  const _visited = new Set()
  if (alg.findCycles(G).length > 0) {
    console.log('Graph is acyclic', alg.findCycles(G))
    throw new Error('Graph is not acyclic')
  }

  while (_queue.length) {
    const layer = []
    const next_queue = []
    for (const v of _queue) {
      _visited.add(v)
      layer.push(v)
      next_queue.push(...G.successors(v) ?? [])
    }
    _layers.push(uniq(layer))
    _queue = next_queue
  }

  function dfs(node: string, parents: string[] = []) {
    if (!_parents[node])
      _parents[node] = new Set()

    parents.forEach(p => _parents[node].add(p))
    const children = G.successors(node)
    if (!children)
      return
    for (const child of children)
      dfs(child, [...parents, node])
  }
  dfs(root, [])

  _queue = [root]
  let _layer = 0
  const _removed = new Set()
  let _step = 1
  while (_queue.length) {
    const next_queue = []
    for (const node of _queue) {
      if (_removed.has(node))
        continue
      const label: string = G.node(node).label
      let _break = false
      const _roots = new Set<string>()
      for (let li = _layer + 1; li < _layers.length; li++) {
        let bestG = G
        let bestEdgeCount = G.edges().length
        let nodeToMerge = ''
        for (const n of _layers[li]) {
          if (_removed.has(n))
            continue
          if (G.node(n).label === label && !(intersection([..._parents[n]], [..._roots]).length) && node !== n) {
            const _tG = _copy(G)
            _merge(_tG, node, n)
            if (alg.findCycles(_tG).length === 0) {
              if (_tG.edges().length < bestEdgeCount) {
                bestEdgeCount = _tG.edges().length
                bestG = _tG
                nodeToMerge = n
              }
              // G = _tG
              // _removed.add(n)
              // _roots.add(n)
              // _step++
              // _break = true
              // break
            }
          }
        }
        if (bestG !== G) {
          G = bestG
          _removed.add(nodeToMerge)
          _roots.add(nodeToMerge)
          _step++
          _break = true
          break
        }
      }
      if (_break)
        return simplifyGraph(G, root, depth + 1)
      next_queue.push(...G.successors(node) ?? [])
    }
    _queue = uniq(next_queue)
    _layer++
  }
  return G
}

export function updateGraphWeight(g: Graph, paths: string[][], commendPaths: string[][], currentPath: string[][], root = '0'): Graph {
  const gCopy = _copy(g)
  const prefixDict: Record<string, number[]> = {}

  const mergePaths = [...paths, ...commendPaths, ...currentPath]
  for (let i = 0; i < mergePaths.length; i++) {
    const _path = ['START', ...mergePaths[i], 'END']
    for (let j = 0; j < _path.length; j++) {
      const prefix = _path.slice(0, j + 1)
      const prefixKey = prefix.join(',')
      if (!(prefixKey in prefixDict))
        prefixDict[prefixKey] = []

      prefixDict[prefixKey].push(i)
    }
  }

  // console.log('prefixDict', prefixDict)

  function dfs(node: string, prefix: string[]): void {
    prefix = [...prefix, node]
    if (node !== root) {
      const lastNode = prefix[prefix.length - 2]
      const edge = gCopy.edge(lastNode, node)
      const prefixKey = prefix.map(x => gCopy.node(x).label).join(',')
      const weight = prefixDict[prefixKey]?.length || 0
      const isEdgeCommend: boolean = gCopy.edge(lastNode, node)?.isCommend ?? false
      const isEdgeCurrent: boolean = gCopy.edge(lastNode, node)?.isCurrent ?? false
      const isCommend = prefixDict[prefixKey]?.some(value => value >= paths.length && value < paths.length + commendPaths.length) || isEdgeCommend
      const isCurrent = prefixDict[prefixKey]?.some(value => value >= paths.length + commendPaths.length) || isEdgeCurrent
      let className = ''

      if (weight)
        className += prefixDict[prefixKey].map(id => `path-${id}`).join(' ')

      const nodeClass: string = gCopy.node(node).class ?? ''
      const edgeClass: string = gCopy.edge(lastNode, node)?.class ?? ''
      gCopy.node(node).class = `${nodeClass.trim()} ${className}`
      gCopy.setEdge(
        lastNode,
        node,
        {
          weight: (edge ? edge.weight : 0) + weight,
          class: `${edgeClass.trim()} ${className}`,
          isCommend,
          isCurrent,
        },
      )
    }
    for (const child of gCopy.successors(node) ?? [])
      dfs(child, prefix)
  }
  dfs(root, [])
  // let allEdges = gCopy.edges(); // 获取所有边
  // for (let edge of allEdges) {
  //   let attrs = gCopy.edge(edge.v, edge.w); // 获取边的属性
  //   console.log(`Edge from ${edge.v} to ${edge.w}:`, attrs);
  // }
  return gCopy
}

function _mixColorWithWhite(fromColor: string, weight: number) {
  // const from = color(fromColor)
  // const to = color('white')
  return color(interpolateRgb(fromColor, 'white')(weight))
}

export function updateVisualAttributes(G: Graph, root: string = '0') {
  const _G = _copy(G)
  _G.node(root).class = 'root'
  const labelTypes = chain(_G.nodes()).map(node => _G.node(node).label).uniq().value()
  const categoryColorScale = scaleOrdinal(schemeTableau10).domain(labelTypes)
  for (const node of _G.nodes()) {
    const label = _G.node(node).label
    _G.node(node).fillcolor = _mixColorWithWhite(categoryColorScale(label), 0.6)!.formatHex()
    _G.node(node).color = color(categoryColorScale(label))?.copy({ opacity: 1 }).formatHex()
    _G.node(node).style = 'filled,rounded'
    _G.node(node).shape = 'box'
    _G.node(node).fontname = 'Helvetica'
    if (!(label === 'START' || label === 'END'))
      _G.node(node).label = label.slice(1, -1)
  }
  const edge_weights = chain(_G.edges()).map(edge => _G.edge(edge).weight).uniq().value()
  const max_weight = Math.max(...edge_weights)
  const min_weight = Math.min(...edge_weights) - 2
  const linearColorScale = scaleSequential(interpolateGreys).domain([min_weight, max_weight])
  const recommendColorScale = scaleSequential(interpolateBlues).domain([min_weight-5, max_weight+5])
  const currentColorScale = scaleSequential(interpolateGreens).domain([min_weight-5, max_weight+5])
  const linearScale = scaleSequential().domain([min_weight, max_weight]).range([0, 1])
  for (const edge of _G.edges()) {
    const weight = _G.edge(edge).weight
    const isCommend = _G.edge(edge).isCommend
    const isCurrent = _G.edge(edge).isCurrent
    _G.edge(edge).penwidth = 1 + 4 * linearScale(weight)
    _G.edge(edge).color = isCurrent ? color(currentColorScale(weight))?.formatHex() : isCommend ? color(recommendColorScale(weight))?.formatHex() : color(linearColorScale(weight))?.formatHex()
    _G.edge(edge).fontname = 'Helvetica'
    _G.edge(edge).label = weight
    _G.edge(edge).arrowhead = 'none'
  }
  return _G
}

export function addGraphAttributes(dotString: string, attrs: Record<string, string> = {}) {
  // 在strict digraph {行后面加上rankdir=LR;
  const lines = dotString.split('\n')
  // key=value;
  const attrStr = Object.entries(attrs).map(([key, value]) => `${key}=${value};`).join('\n')
  lines.splice(1, 0, attrStr)
  return lines.join('\n')
}
