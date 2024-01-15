import { defineConfig } from 'unocss'
import { presetUno, presetIcons, presetWebFonts, presetAttributify } from 'unocss'
import presetAnimations from "unocss-preset-animations"
import { presetShadcn } from "unocss-preset-shadcn"
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        'rounded': 'Nunito'
      }
    }),
    presetAttributify(),
    presetAnimations(),
    presetShadcn({
      // color: "red",
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]s|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
      ],
    },
  },
})