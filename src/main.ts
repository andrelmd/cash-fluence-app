import { createPinia } from "pinia"
import { createApp } from "vue"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "vuetify/styles"
import App from "./App.vue"
import "./styles.css"

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(createPinia()).use(vuetify).mount("#app")
