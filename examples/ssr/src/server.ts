import express from 'express'
import { readFile } from 'fs-extra'
import { join } from 'path'
import { render } from './render'
const template = require('string-template')

const app = express()
app.use('/', express.static(join(__dirname, '..', 'public')))
app.get('/:id', async (req, res) => {
  let id = parseInt(req.params['id']) || 0
  let [vals, html] = await render(id)
  let content = await readFile(join(__dirname, '..', 'index.html'), 'utf-8')
  let page = template(content, { vals: JSON.stringify(vals), html })
  res.send(page)
})
app.use('/', (req, res) => res.redirect('/0'))

// @ts-ignore
app.listen(3000, () => console.log('server started on 3000'))