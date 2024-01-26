import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        rounded: 'Nunito',
      },
    }),
    presetAttributify(),
    presetAnimations(),
    presetShadcn({
      // color: "red",
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'src/components/ui/**/*.{vue,js,ts,jsx,tsx}', // 适配shadcn-vue
      ],
    },
  },
  theme: {
    colors: {
      'warning': 'hsl(var(--warning))',
      'warning-foreground': 'hsl(var(--warning-foreground))',
      'danger': 'hsl(var(--danger))',
      'danger-foreground': 'hsl(var(--danger-foreground))',
      'success': 'hsl(var(--success))',
      'success-foreground': 'hsl(var(--success-foreground))',
    },
  },
  safelist: [
    ...['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'indigo', 'gray', 'orange', 'teal', 'violet', 'black'].map(c => `fill-${c}`),
  ],
})
