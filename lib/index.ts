import { Store } from './Store'
import { useState, useEffect } from 'react'
export default Store

export function useStore<T>(store: Store<T>): [T, boolean,
  (val: T | Promise<T> | Promise<(state: T) => T> | ((v: T) => T)
    | ((v: T) => Promise<(state: T) => T>)) => void
] {
  let [x, update] = useState<T>(store.value)
  let [pending, setPending] = useState(!!store.pending)
  useEffect(() => {
    let cb = (val: T) => update(val)
      , cbPending = (val: number) => setPending(!!val)
    store.addHookListener(cb, cbPending)
    store.addUse(1)
    update(store.value)
    setPending(!!(store.pending + store.refPending))
    return () => {
      store.removeHookListener(cb, cbPending)
      store.addUse(-1)
    }
  }, [])
  return [x, pending, store.setState.bind(store)]
}