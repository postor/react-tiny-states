import { Store } from "./Store"

export function waitTillReady<T>(store: Store<T>): Promise<T> {
  if (!(store.pending + store.refPending)) return Promise.resolve(store.value)
  return new Promise(resolve => {
    let pendingcb = () => { }, cb = () => {
      store.removeListener(cb, pendingcb)
      resolve(store.value)
    }
    store.addListener(cb, pendingcb)
  })
}

export async function waitStoresReady(stores: Store<any>[] = []) {
  stores.forEach(x => x.addUse(1))
  return Promise.all(stores.map(x => waitTillReady(x)))
}

export function initStores(stores: Store<any>[] = [], values = []) {
  let visited = new Set()
  stores.forEach((x, i) => {
    x.value = values[i]
  })
  stores.forEach(x => updateStore(x))
  visited.clear()
  return () => stores.forEach(x => x.addUse(-1))

  function updateStore(x: Store<any>) {
    if (visited.has(x)) return
    visited.add(x)
    x.addUse(1, false)
    if (x.stores) {
      x.stores.forEach(y => updateStore(y))
      x.cachedCbValues = x.stores.map(y => y.value)
    }
  }
}