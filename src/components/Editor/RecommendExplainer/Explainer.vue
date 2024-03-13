<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { instance } from '@viz-js/viz'

// @ts-expect-error no types
import dot from '@dagrejs/graphlib-dot'
import { addGraphAttributes, simplifyGraph, splitTracks, tracks2graph, updateGraphWeight, updateVisualAttributes } from '@/lib/dag'

const el = ref<HTMLElement>()
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
const recommendTracks: string[] = [
  '<scatter><split><ideogram><split><line><split><line>',
  '<ideogram><split><heatmap><split><heatmap><split><chord>',
]
const currentTrack: string[] = ['<ideogram><split><histogram><split><histogram><split><histogram><split><histogram><split><chord>']

onMounted(() => {
  const graph = updateVisualAttributes(updateGraphWeight(simplifyGraph(tracks2graph([...tracks, ...recommendTracks, ...currentTrack])), (splitTracks(tracks)), (splitTracks(recommendTracks)), (splitTracks(currentTrack))))
  // console.log(splitTracks(tracks))
  const dotString = dot.write(graph)
  // console.log('dotString', dotString)
  instance().then((viz) => {
    const svg = viz.renderSVGElement(
      addGraphAttributes(dotString, {
        rankdir: 'LR',
        fontname: 'Helvetica',
        bgcolor: 'transparent',
      }),
    )
    svg.style.width = '100%'
    svg.style.height = 'auto'
    // svg.innerHTML = `  <defs>
    //   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    //     <stop offset="0%" stop-color="red" stop-opacity="1" />
    //     <stop offset="100%" stop-color="blue" stop-opacity="1" />
    //   </linearGradient>
    // </defs>${svg.innerHTML}`
    svg.querySelectorAll(':where(.node, .edge)').forEach((el) => {
      const classPathList = Array.from(el.classList).filter(s => s.startsWith('path'))
      el.addEventListener('pointerenter', () => {
        svg.querySelectorAll(`:where(.node, .edge):not(:where(.root, .${classPathList.join(', .')}))`).forEach((el) => {
          el.setAttribute('opacity', '0.2')
        })
      })
      el.addEventListener('pointerleave', () => {
        svg.querySelectorAll(`:where(.node, .edge):not(:where(.root, .${classPathList.join(', .')}))`).forEach((el) => {
          el.setAttribute('opacity', '1')
        })
      })
    })
    svg.classList.add('explainer-svg')

    el.value?.appendChild(svg)
  })
})
</script>

<template>
  <div m="x-0 y-2" p="2" border-t bg="background" class="explainer select-none">
    <div ref="el" />
  </div>
</template>

<style>
.explainer-svg .node {
  transition: all 0.2s ease;
}

@keyframes gradient {
  0% {
    stop-color: red;
  }

  50% {
    stop-color: green;
  }

  100% {
    stop-color: blue;
  }
}

#gradient stop {
  animation: gradient 5s infinite;
}
</style>
