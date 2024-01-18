// import '@unocss/reset/normalize.css'
import 'v-calendar/style.css'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
