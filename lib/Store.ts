type Callback = (val: any) => Promise<any> | any
type PendingCallback = (val: number, by: number) => Promise<any> | any

export class Store<T> {
  public listeners = new Set<Callback>()
  public refPending = 0
  public pending = 0
  public pendingListeners = new Set<PendingCallback>()
  public used = 0
  private updatecb = () => false
  private pendingcb = (u: any, v: any) => { }
  private cachedCbValues = undefined

  constructor(
    public value: T | any,
    public stores: Store<any>[] = [],
    public cb?: (...vals: any[]) => (T | ((v: T) => T | Promise<T> | Promise<(v: T) => T>)),
    // public debug = false
  ) {
    this.updatecb = this.update.bind(this)
    this.pendingcb = (u, v) => this.addPending(0, v)
  }

  addUse(by = 1) {
    let last = this.used
    this.used += by
    let { stores, cb } = this
    if (!cb) return
    stores.forEach(x => x.addUse(by))
    if (!last == !this.used) return
    if (last == 0) {
      this.refPending = this.stores.reduce((p, x) => x.pending + x.refPending + p, 0)
      // this.debug && console.log({
      //   refPending: this.refPending,
      //   // useBy: by,
      //   // used: this.used,
      //   mount: 1
      // })
      if (!this.refPending) this.updatecb()
      stores.forEach((x: Store<any>) => x.addListener(this.updatecb, this.pendingcb))
      // if (this.debug && this.refPending == 3) debugger
    } else {
      // this.debug && console.log({
      //   // useBy: by,
      //   // used: this.used,
      //   unmount: 1
      // })
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

  setState(val: T | ((v: T) => T | Promise<T> | Promise<(v: T) => T>)) {
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
    // if (!this.debug) return
    // // if (refBy == 1) debugger
    // console.log({
    //   by, refBy, pending: `${pending}=${this.pending}+${this.refPending}`,
    //   value: this.value
    // })
  }

  emit(val: T): void {
    if (val == this.value || (this.pending + this.refPending)) return
    this.value = val
    this.listeners.forEach(x => x(val))
  }

  addListener(cb: Callback, cbPending: PendingCallback) {
    this.listeners.add(cb)
    this.pendingListeners.add(cbPending)
  }

  removeListener(cb: Callback, cbPending: PendingCallback) {
    this.listeners.delete(cb)
    this.pendingListeners.delete(cbPending)
  }

  waitTillReady(): Promise<any> {
    if (!this.pending) return Promise.resolve()
    return new Promise(resolve => {
      let pendingcb = () => { }, cb = () => {
        this.removeListener(cb, pendingcb)
        resolve(this.value)
      }
      this.addListener(cb, pendingcb)
    })
  }
}