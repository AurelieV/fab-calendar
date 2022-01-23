import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.pageExports
  const title = (documentProps && documentProps.title) || 'Fab Calendar'
  const desc = (documentProps && documentProps.description) || ''

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,300;0,400;0,600;0,700;1,400&display=swap"
            rel="stylesheet">
        <meta name="description" content="${desc}" />
        <title>${title}</title>
    </head>

    <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
    </body>

    </html>`

  return {
    documentHtml,
    pageContext: {},
  }
}
