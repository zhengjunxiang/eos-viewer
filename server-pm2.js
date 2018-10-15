const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const {createBundleRenderer} = require('vue-server-renderer')
const axios = require('axios');

const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo = `express/${require('express/package.json').version} ` + `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const app = express()

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    basedir: resolve('./dist'),
    runInNewContext: false
  }))
}

let renderer, readyPromise;
const templatePath = resolve('./src/index.template.html')

const template = fs.readFileSync(templatePath, 'utf-8')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
renderer = createRenderer(bundle, {template, clientManifest})

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({threshold: 0}))
app.use(favicon('./public/favicon.ico'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))
function render(req, res) {
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)
  const handleError = err => {
    if (err.url) res.redirect(err.url)
    else if (err.code === 404) res.status(404).send('404 | Page Not Found')
    else res.status(500).send('500 | Internal Server Error')
  }
  const context = { title: 'EOS Viewer', url: req.url }
  renderer.renderToString(context, (err, html) => {
    if (err) return handleError(err)
    res.send(html)
  })
}

app.get('*', render)

const port = 80;
app.listen(port, '0.0.0.0')
