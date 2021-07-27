import { install } from 'source-map-support'
import * as throng from 'throng'

import 'zone.js/dist/zone-node'
import './ssr-polyfills'

import { enableProdMode } from '@angular/core'
import { ngExpressEngine } from '@nguniversal/express-engine'

import * as express from 'express'
import { join } from 'path'


install()
enableProdMode()

import { AppServerModule } from './app.server.module'

const engine = ngExpressEngine({
    bootstrap: AppServerModule,
})

const hardlinks = {
    'cwd-detection': 'https://github.com/Eugeny/tabby/wiki/Shell-working-directory-reporting',
}

function start () {
    const app = express()

    const PORT = process.env.PORT || 8000
    const DIST_FOLDER = join(process.cwd(), 'build')

    app.engine('html', engine)

    app.set('view engine', 'html')
    app.set('views', DIST_FOLDER)

    app.use('/static', express.static(DIST_FOLDER, {
        maxAge: '1y',
    }))

    app.get(['/', '/app', '/login'], (req, res) => {
        res.render('index', { req })
    })

    app.get(['/terminal'], (req, res) => {
        res.sendFile(join(DIST_FOLDER, 'terminal.html'))
    })

    for (const [key, value] of Object.entries(hardlinks)) {
        app.get(`/go/${key}`, (req, res) => res.redirect(value))
    }

    process.umask(0o002)
    app.listen(PORT, () => {
        console.log(`Node Express server listening on http://localhost:${PORT}`)
    })
}

const WORKERS = process.env.WEB_CONCURRENCY || 4
throng({
    workers: WORKERS,
    lifetime: Infinity,
    start,
})
