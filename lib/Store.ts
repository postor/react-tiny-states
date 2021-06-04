import { useState, useEffect } from 'react'

type Callback = (val: any) => Promise<any> | any

type PendingCallback = (val: number, by: number) => Promise<any> | any

type StateOrReducer<T> = (T | Promise<T> | Promise<(state: T) => T>
  | ((v: T) => T) | ((v: T) => Promise<T>)
  | ((v: T) => Promise<(state: T) => T>))

type UnwrapStore<T> = T extends Store<infer U, any> ? U : T;

type UnwrapStores<T extends [...any[]]> =
  T extends [infer Head, ...infer Tail]
  ? [UnwrapStore<Head>, ...UnwrapStores<Tail>]
  : [];

export default class Store<T, V extends [...Store<any, any>[]]> {
  private depListeners = new Set<Callback>()
  private hookListeners = new Set<Callback>()
  protected refPending = 0
  protected pending = 0
  private pendingListeners = new Set<PendingCallback>()
  private used = 0
  private updatecb = () => { }
  private pendingcb = (u: any, v: any) => { }
  private cachedCbValues = undefined

  constructor(
    private value: T,
    private stores?: [...V],
    private cb?: (...vals: UnwrapStores<V>) => StateOrReducer<T>,
    public enableCompute = true
  ) {
    if (this.enableCompute) this.updatecb = this.update.bind(this)
    this.pendingcb = (u, v) => this.addPending(0, v)
  }

  private addUse(by = 1, triggerUpdate = true) {
    let last = this.used
    this.used += by
    let { stores, cb } = this
    if (!cb) return
    stores.forEach(x => x.addUse(by, triggerUpdate))
    if (!last == !this.used) return
    if (last == 0) {
      this.refPending = this.stores.reduce((p, x) => x.pending + x.refPending + p, 0)
      triggerUpdate && this.updatecb()
      stores.forEach((x) => x.addListener(this.updatecb, this.pendingcb))
    } else {
      stores.forEach((x) => x.removeListener(this.updatecb, this.pendingcb))
    }
  }
  private update() {
    let { stores, cb } = this
    if ((this.pending + this.refPending) || !cb) return
    let cbValues = stores.map(x => x.value)
    if (this.cachedCbValues !== undefined && cbValues.every((x, i) => x === this.cachedCbValues[i])) return
    this.cachedCbValues = cbValues
    // @ts-ignore
    let rtn = this.cb(...cbValues)
    return this.setState(rtn)
  }
  public setState(val: StateOrReducer<T>) {
    const handlePromise = p => {
      this.addPending(1)
      p.then((x: T | ((v: T) => T)) => {
        this.addPending(-1)
        this.emit(x instanceof Function ? x(this.value) : x)
      })
    }
    if (val instanceof Function) {
      let rtn = val(this.value)
      if (rtn instanceof Promise) {
        handlePromise(rtn)
      } else {
        this.emit(rtn)
      }
    } else if (val instanceof Promise) {
      handlePromise(val)
    } else {
      this.emit(val)
    }
  }
  private addPending(by = 1, refBy = 0) {
    this.pending += by
    this.refPending += refBy
    let pending = this.pending + this.refPending
    this.pendingListeners.forEach(x => x(pending, by + refBy))
  }
  private emit(val: T): void {
    if (val == this.value) return
    this.value = val
    if (!(this.pending + this.refPending)) this.depListeners.forEach(x => x(val))
    this.hookListeners.forEach(x => x(val))
  }
  private addListener(cb: Callback, cbPending: PendingCallback) {
    this.depListeners.add(cb)
    this.pendingListeners.add(cbPending)
  }
  private addHookListener(cb: Callback, cbPending: PendingCallback) {
    this.hookListeners.add(cb)
    this.addListener(cb, cbPending)
  }
  private removeListener(cb: Callback, cbPending: PendingCallback) {
    this.depListeners.delete(cb)
    this.pendingListeners.delete(cbPending)
  }
  private removeHookListener(cb: Callback, cbPending: PendingCallback) {
    this.hookListeners.delete(cb)
    this.removeListener(cb, cbPending)
  }

  wait(): Promise<T> {
    if (!(this.pending + this.refPending)) return Promise.resolve(this.value)
    return new Promise(resolve => {
      let pendingcb = () => { }, cb = () => {
        this.removeListener(cb, pendingcb)
        resolve(this.value)
      }
      this.addListener(cb, pendingcb)
    })
  }

  public static async waitStoresReady(stores: Store<any, any>[] = []) {
    stores.forEach(x => x.addUse(1))
    return Promise.all(stores.map(x => x.wait()))
  }

  public static initStores(stores: Store<any, any>[] = [], values = []) {
    let visited = new Set()
    stores.forEach((x, i) => {
      x.value = values[i]
    })
    stores.forEach(x => updateStore(x))
    visited.clear()
    return () => stores.forEach(x => x.addUse(-1))

    function updateStore(x: Store<any, any>) {
      if (visited.has(x)) return
      visited.add(x)
      x.addUse(1, false)
      if (x.stores) {
        x.stores.forEach(y => updateStore(y))
        x.cachedCbValues = x.stores.map(y => y.value)
      }
    }
  }

  public use(): [T, boolean, (val: StateOrReducer<T>) => void] {
    let [x, update] = useState<T>(this.value)
    let [pending, setPending] = useState(!!this.pending)
    useEffect(() => {
      let cb = (val: T) => update(val)
        , cbPending = (val: number) => setPending(!!val)
      this.addHookListener(cb, cbPending)
      this.addUse(1)
      update(this.value)
      setPending(!!(this.pending + this.refPending))
      return () => {
        this.removeHookListener(cb, cbPending)
        this.addUse(-1)
      }
    }, [])
    return [x, pending, this.setState.bind(this)]
  }
}