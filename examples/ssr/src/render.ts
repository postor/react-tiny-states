import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { selectedIndex, stores } from './comps/stores'
import Index from './pages'
import { waitStoresReady } from 'react-tiny-states/dist/ssr'

export async function render(i: number) {
  selectedIndex.value = i
  let vals = await waitStoresReady(stores)
  return [vals, renderToString(createElement(Index))]
}

