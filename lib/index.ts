import { Store } from './Store'
import { useState, useEffect } from 'react'

export default Store

export function useStore<T>(store: Store<T>) {
  let [x, update] = useState(store.value)
  let [pending, setPending] = useState(!!store.pending)

  useEffect(() => {
    let cb = (val: T) => update(val)
      , cbPending = (val: number) => setPending(!!val)
    store.addListener(cb, cbPending)
    store.addUse(1)
    update(store.value)
    setPending(!!(store.pending + store.refPending))
    return () => {
      store.removeListener(cb, cbPending)
      store.addUse(-1)
    }
  }, [])

  return [x, pending, store.setState.bind(store)]
}

