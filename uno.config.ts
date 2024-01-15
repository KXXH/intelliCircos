import { defineConfig } from 'unocss'
import { presetUno, presetIcons, presetWebFonts, presetAttributify } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts(),
    presetAttributify(),
  ],
})