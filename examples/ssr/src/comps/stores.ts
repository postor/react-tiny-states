import Store from "react-tiny-states"

export const selectedIndex = new Store<number>(0)
export const list = new Store<string[]>([], [], () => {
  let rtn: Promise<string[]> = waitMili(500).then(x => ['a', 'b', 'c'])
  return rtn
})
export const selectedProfile = new Store<string>(
  ''
  , [list, selectedIndex]
  , (list, selectedIndex) => list[selectedIndex]
)

export const selectedProfileFriends = new Store<string[]>(
  []
  , [selectedProfile]
  , selectedProfile => {
    let rtn: Promise<string[]> = waitMili(1000)
      .then(x => ['d' + selectedProfile, 'e' + selectedProfile])
    return rtn
  }
)

export const selectedProfileDesc = new Store<string>(
  'default desc'
  , [selectedProfile]
  , (selectedProfile) => {
    let rtn: Promise<string> = waitMili(2000).then(x => `some desc of ${selectedProfile}`)
    return rtn
  }
)

export const selectedProfileAD = new Store<string>(
  ''
  , [selectedProfileFriends, selectedProfileDesc]
  , (a, b) => {
    let rtn = waitMili(1000).then(x => {
      console.log(`selectedProfileAD`, { a, b, x })
      return `....some AD for [friends:${a.join(',')} ,desc:${b}]`
    })
    return rtn
  }
  // , true
)

export const selectedProfileAdUnused = new Store(
  ''
  , [selectedProfileFriends, selectedProfileDesc]
  , (a, b) => {
    let rtn = waitMili(1000).then(x => {
      console.log(`selectedProfileAdUnused`, { a, b, x })
      return `some AD for friends:${a.join(',')} desc:${b}`
    })
    return rtn
  }
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

function waitMili(mili: number) {
  return new Promise(resolve => setTimeout(resolve, mili))
}

export const stores = [
  list, selectedIndex, selectedProfile, selectedProfileAD,
  selectedProfileDesc, selectedProfileFriends
]