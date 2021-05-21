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
  stores.forEach((x, i) => {
    x.value = values[i]
    x.addUse(1, false)
  })
  stores.forEach(x => x.cachedCbValues = x.stores.length
    ? x.stores.map(y => y.value)
    : undefined)
  return () => stores.forEach(x => x.addUse(-1))
}