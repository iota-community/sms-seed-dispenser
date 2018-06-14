import Document, { Head, Main, NextScript } from "next/document"
import { ServerStyleSheet, injectGlobal } from "styled-components"
import htmlescape from "htmlescape"

const PAGE_TITLE = process.env.PAGE_TITLE
const PAGE_DESCRIPTION = process.env.PAGE_DESCRIPTION

const env = { PAGE_TITLE, PAGE_DESCRIPTION }

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: "__ENV__ = " + htmlescape(env)
            }}
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{process.env.PAGE_TITLE}</title>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

injectGlobal`
    body {
        margin: 0 auto;
        font-family: Avenir, Helvetica, Arial, sans-serif;
    }
`
