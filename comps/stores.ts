import Store from "../lib"

export const selectedIndex = new Store(0)
export const list = new Store([], [], () => waitMili(500).then(x => ['a', 'b', 'c']))
export const selectedProfile = new Store(
  ''
  , [list, selectedIndex]
  , (list, selectedIndex) => list[selectedIndex]
)

export const selectedProfileFriends = new Store(
  []
  , [selectedProfile]
  , (selectedProfile) => () => waitMili(1000).then(x => ['d' + selectedProfile, 'e' + selectedProfile])
  // , true
)

export const selectedProfileDesc = new Store(
  'default desc'
  , [selectedProfile]
  , (selectedProfile) => () => waitMili(2000).then(x => `some desc of ${selectedProfile}`)
  // , true
)

export const selectedProfileAD = new Store(
  ''
  , [selectedProfileFriends, selectedProfileDesc]
  , (a, b) => () => waitMili(1000).then(x => {
    console.log(`selectedProfileAD`, { a, b, x })
    return `....some AD for [friends:${a.join(',')} ,desc:${b}]`
  })
  // , true
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
type T1 = { version: number, data: number }
export const config = new Store<T1>(
  {
    version: 0,
    data: 1
  }
  , [selectedProfile]
  , (selectedProfile) => {
    let v: Promise<(v: T1) => T1> = waitMili(3000)
      .then(() => ({ version: 1, data: 2 }))
      .then(conf => {
        return (cur: T1) => cur.version < conf.version ? conf : cur
      })
    return v
  }
)

function waitMili(mili) {
  return new Promise(resolve => setTimeout(resolve, mili))
}