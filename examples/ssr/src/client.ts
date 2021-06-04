import { createElement } from 'react'
import ReactDOM from 'react-dom'
import Store from 'react-tiny-states'
import { stores } from './comps/stores'
import Index from './pages'
// @ts-ignore
let { STORE_VALS } = window
Store.initStores(stores, STORE_VALS)

ReactDOM.render(
  createElement(Index),
  document.querySelector('[data-reactroot]')
)