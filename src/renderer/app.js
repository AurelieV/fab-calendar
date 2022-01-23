import { createSSRApp, h } from 'vue'
import { IconPlugin } from 'purplefox-tools'
import 'purplefox-tools/style.css'
import '/src/style/index.css'

export { createApp }

function createApp(pageContext) {
  const { Page, pageProps } = pageContext
  const app = createSSRApp({
    render: () => h(Page, pageProps),
  })
  app.use(IconPlugin)

  return app
}
