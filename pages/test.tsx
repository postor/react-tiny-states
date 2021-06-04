
import ProfileAD from "../comps/ProfileAD"
import Store from "../lib"

let val = new Store(0)

const Test = () => {
  let [i, pending, setI] = val.use()
  return <>
    <p>value:{i + ''},pending:{pending + ''}</p>
    <button onClick={() => setI(0)}>reset</button>
    <button onClick={() => setI(x => x + 1)}>+1</button>
    <button onClick={() => setI(() => new Promise(resolve => {
      setTimeout(() => resolve(y => y + 1), 1000)
    }) as Promise<(v: number) => number>)}>+1 delay 1s</button>

  </>
}

export default Test