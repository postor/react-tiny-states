import Store from "../lib"

let isBrowser = typeof window !== 'undefined'

export const selectedIndex = new Store(0)
export const list = new Store(
  [],
  [],
  () => (waitMili(500).then(x => ['a', 'b', 'c'])) as Promise<string[]>
  , isBrowser)
export const selectedProfile = new Store(
  ''
  , [list, selectedIndex]
  , (list, selectedIndex) => list[selectedIndex]
  , isBrowser
)

export const selectedProfileFriends = new Store(
  ['']
  , [selectedProfile]
  , (selectedProfile) => (v: string[]) => (waitMili(1000).then(x =>
    ['d' + selectedProfile, 'e' + selectedProfile]) as Promise<string[]>)
  , isBrowser
)

export const selectedProfileDesc = new Store(
  'default desc'
  , [selectedProfile]
  , (selectedProfile) => () => waitMili(2000)
    .then(x => `some desc of ${selectedProfile}`)
  , isBrowser
)

export const selectedProfileAD = new Store(
  ''
  , [selectedProfileFriends, selectedProfileDesc]
  , (a, b) => () => waitMili(1000).then(x => {
    console.log(`selectedProfileAD`, { a, b, x })
    return `....some AD for [friends:${a.join(',')} ,desc:${b}]`
  })
  , isBrowser
)

export const selectedProfileAdUnused = new Store(
  ''
  , [selectedProfileFriends, selectedProfileDesc]
  , (a, b) => () => waitMili(1000).then(x => {
    console.log(`selectedProfileAdUnused`, { a, b, x })
    return `some AD for friends:${a.join(',')} desc:${b}`
  })
)


// computed async reducer 
interface T1 { version: number, data: number }
export const config = new Store<T1, [typeof selectedProfile]>(
  {
    version: 0,
    data: 1
  }
  , [selectedProfile]
  , () => {
    let v: Promise<(v: T1) => T1> = waitMili(3000)
      .then(() => ({ version: 1, data: 2 }))
      .then(conf => {
        return (cur: T1) => cur.version < conf.version ? conf : cur
      })
    return v
  }
)

function waitMili(mili) {
  console.log(`enableCompute, shall only print in browser`)
  return new Promise(resolve => setTimeout(resolve, mili))
}