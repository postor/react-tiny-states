import { createElement } from 'react'
import ReactDOM from 'react-dom'
import { stores } from './comps/stores'
import { initStores } from 'react-tiny-states/dist/ssr'
import Index from './pages'

// @ts-ignore
initStores(stores, window.STORE_VALS)

ReactDOM.render(
  createElement(Index),
  document.querySelector('[data-reactroot]')
)