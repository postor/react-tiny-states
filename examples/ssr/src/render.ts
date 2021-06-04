import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import Store from 'react-tiny-states'
import { selectedIndex, stores } from './comps/stores'
import Index from './pages'

export async function render(i: number) {
  selectedIndex.setState(i)
  let vals = await Store.waitStoresReady(stores)
  return [vals, renderToString(createElement(Index))]
}

