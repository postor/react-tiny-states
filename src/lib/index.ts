import { Store } from './Store'
import { useState, useEffect } from 'react'

export default createStore

export function createStore<T>(defaultValue: T) {
  let store = new Store<T>(defaultValue)
  return () => {
    let [x, update] = useState(store.value)
    let [pending, setPending] = useState(!!store.pending)

    useEffect(() => {
      let cb = (val: T) => update(val)
        , cbPending = (val: number) => setPending(!!val)
      store.addListener(cb, cbPending)
      return () => store.removeListener(cb)
    }, [])
    return [x, store.setState, pending]
  }
}

export function createPipe<T>(
  defaultValue: T
  , stores: Store<any>[]
  , cb?: (...vals: any[]) => (T | ((v: T) => T | Promise<T> | Promise<(v: T) => T>))
) {
  let store = new Store<T>(defaultValue, stores, cb)
  return () => {
    let [x, update] = useState(store.value)
    let [pending, setPending] = useState(!!store.pending)

    useEffect(() => {
      let cb = (val: T) => update(val)
        , cbPending = (val: number) => setPending(!!val)
      store.addListener(cb, cbPending)
      return () => store.removeListener(cb)
    }, [])
    return [x, pending]
  }
}