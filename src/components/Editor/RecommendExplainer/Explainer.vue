<script setup lang="ts">
import { onMounted, ref, computed, watch, watchEffect, reactive, type ComputedRef } from 'vue'
import { instance } from '@viz-js/viz'
import { useFigureStore } from '@/stores/figure'
import { useChat } from '@/lib/ai/client'

// @ts-expect-error no types
import dot from '@dagrejs/graphlib-dot'
import { addGraphAttributes, simplifyGraph, splitTracks, tracks2graph, updateGraphWeight, updateVisualAttributes } from '@/lib/dag'

const el = ref<HTMLElement>()
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
// const apiBaseUrl = 'http://localhost:8000'
const apiBaseUrl = 'https://doubt-dvds-show-argument.trycloudflare.com'

const figureStore = useFigureStore()
const currentTrack = computed(() => {
  return [figureStore.CTMLConfig.slice(7, -5)]
})
const { messages } = useChat()
const recommendTracks: ComputedRef<string[]> = computed(() => {
  const old = recommendTracks.value ?? ['<ideagram>']
  if (messages.value[messages.value.length - 1].code) {
    return [messages.value[messages.value.length - 1]?.code ?? '']
  } else {
    return old
  }
})
let tracks = ref<string[]>([])
watch(currentTrack, async(newValue, oldValue) => {
  try {
    await fetch(apiBaseUrl + '/search?input=' + encodeURIComponent(newValue[0]))
      .then(response => response.json())
      .then(data => {
        tracks.value = data
      })
  } catch(e) {
    console.error('Error: ' + e)
  }
})

watchEffect(() => {
  const graph = updateVisualAttributes(updateGraphWeight(simplifyGraph(tracks2graph(tracks.value, recommendTracks.value, currentTrack.value)), (splitTracks(tracks.value)), (splitTracks(recommendTracks.value)), (splitTracks(currentTrack.value))))
  const dotString = dot.write(graph)
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
    if (el.value) {
      while (el.value.firstChild) {
        el.value.firstChild.remove();
      }
    }
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
