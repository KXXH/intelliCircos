import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const leftPanelOpen = ref(true)
  const rightPanelOpen = ref(true)

  const toggleLeftPanel = () => {
    leftPanelOpen.value = !leftPanelOpen.value
  }
  const toggleRightPanel = () => {
    rightPanelOpen.value = !rightPanelOpen.value
  }

  return { leftPanelOpen, rightPanelOpen, toggleLeftPanel, toggleRightPanel }
})
