type Callback = (val: any) => Promise<void> | void
type PendingCallback = (val: number, by: number) => Promise<void> | void

export class Store<T> {
  public listeners: Callback[] = []
  public pending = 0
  public pendingListeners: PendingCallback[] = []

  constructor(
    public value: T | any,
    stores?: Store<any>[],
    cb?: (...vals: any[]) => (T | ((v: T) => T | Promise<T> | Promise<(v: T) => T>))
  ) {
    if (!stores || !cb) return

    this.pending = stores.reduce((p, x) => x.pending + p, 0)
    let update = () => {
      if (this.pending) return
      let rtn = cb(...stores.map(x => x.value))
      this.setState(rtn)
    }
    update()
    stores.forEach((x: Store<any>) => x.addListener(
      y => update(), (u, v) => this.addPending(v)))
  }

  setState(val: T | ((v: T) => T | Promise<T> | Promise<(v: T) => T>)) {
    if (val instanceof Function) {
      let rtn = val(this.value)
      if (rtn instanceof Promise) {
        this.addPending(1)
        rtn.then((x: T | ((v: T) => T)) => {
          this.addPending(-1)
          this.emit(x instanceof Function ? x(this.value) : x)
        })
      } else {
        this.emit(rtn)
      }
    } else {
      this.emit(val)
    }
  }

  addPending(by = 1) {
    this.pending += by
    this.pendingListeners.forEach(x => x(this.pending, by))
  }

  emit(val: T): void {
    if (val == this.value) return
    this.value = val
    this.listeners.forEach(x => x(val))
  }

  addListener(cb: Callback, cbPending: PendingCallback) {
    this.listeners.push(cb)
    this.pendingListeners.push(cbPending)
  }

  removeListener(cb: Callback) {
    let index = this.listeners.indexOf(cb)
    this.listeners.splice(index, 1)
    this.pendingListeners.splice(index, 1)
  }
}