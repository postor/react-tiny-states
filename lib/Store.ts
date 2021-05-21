type Callback = (val: any) => Promise<any> | any
type PendingCallback = (val: number, by: number) => Promise<any> | any

export class Store<T> {
  public depListeners = new Set<Callback>()
  public hookListeners = new Set<Callback>()
  public refPending = 0
  public pending = 0
  public pendingListeners = new Set<PendingCallback>()
  public used = 0
  private updatecb = () => false
  private pendingcb = (u: any, v: any) => { }
  public cachedCbValues = undefined

  constructor(
    public value: T | any,
    public stores: Store<any>[] = [],
    public cb?: (...vals: any[]) => (T | Promise<T> | Promise<(state: T) => T> | ((v: T) => T) | ((v: T) => Promise<(state: T) => T>)),
  ) {
    this.updatecb = this.update.bind(this)
    this.pendingcb = (u, v) => this.addPending(0, v)
  }

  addUse(by = 1, triggerUpdate = true) {
    let last = this.used
    this.used += by
    let { stores, cb } = this
    if (!cb) return
    stores.forEach(x => x.addUse(by, triggerUpdate))
    if (!last == !this.used) return
    if (last == 0) {
      this.refPending = this.stores.reduce((p, x) => x.pending + x.refPending + p, 0)
      triggerUpdate && this.updatecb()
      stores.forEach((x: Store<any>) => x.addListener(this.updatecb, this.pendingcb))
    } else {
      stores.forEach((x: Store<any>) => x.removeListener(this.updatecb, this.pendingcb))
    }
  }
  update() {
    let { stores, cb } = this
    if ((this.pending + this.refPending) || !cb) return
    let cbValues = stores.map(x => x.value)
    if (this.cachedCbValues !== undefined && cbValues.every((x, i) => x === this.cachedCbValues[i])) return
    this.cachedCbValues = cbValues
    let rtn = this.cb(...cbValues)
    return this.setState(rtn)
  }
  setState(val: T | Promise<T> | Promise<(state: T) => T> | ((v: T) => T) | ((v: T) => Promise<(state: T) => T>)) {
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
  addPending(by = 1, refBy = 0) {
    this.pending += by
    this.refPending += refBy
    let pending = this.pending + this.refPending
    this.pendingListeners.forEach(x => x(pending, by + refBy))
  }
  emit(val: T): void {
    if (val == this.value) return
    this.value = val
    if (!(this.pending + this.refPending)) this.depListeners.forEach(x => x(val))
    this.hookListeners.forEach(x => x(val))
  }
  addListener(cb: Callback, cbPending: PendingCallback) {
    this.depListeners.add(cb)
    this.pendingListeners.add(cbPending)
  }
  addHookListener(cb: Callback, cbPending: PendingCallback) {
    this.hookListeners.add(cb)
    this.addListener(cb, cbPending)
  }
  removeListener(cb: Callback, cbPending: PendingCallback) {
    this.depListeners.delete(cb)
    this.pendingListeners.delete(cbPending)
  }
  removeHookListener(cb: Callback, cbPending: PendingCallback) {
    this.hookListeners.delete(cb)
    this.removeListener(cb, cbPending)
  }
}