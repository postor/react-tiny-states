import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { selectedIndex, stores } from './comps/stores'
import Index from './pages'

selectedIndex.setState(1)
stores.forEach(x => x.addUse(1))
console.log(stores.map(x => {
  let obj = {}
  for (let i in x) {
    if (['object', 'function'].includes(typeof x[i])) continue
    obj[i] = x[i]
  }
  return obj
}))
let ps: Promise<any>[] = stores.map(x => x.waitTillReady())
Promise.all(ps).then(vals => {
  console.log(renderToString(createElement(Index)))
})
