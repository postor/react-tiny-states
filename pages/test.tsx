
import ProfileAD from "../comps/ProfileAD"
import { config, selectedIndex } from "../comps/stores"
import { useStore } from "../lib"


const Test = () => {
  let [i, pending, setI] = useStore(selectedIndex)
  return <>
    <p>value:{i + ''},pending:{pending + ''}</p>
    <button onClick={() => setI(0)}>reset</button>
    <button onClick={() => setI(x => x + 1)}>+1</button>
    <button onClick={() => setI(() => new Promise(resolve => {
      setTimeout(() => resolve(y => y + 1), 1000)
    }))}>+1 delay 1s</button>

  </>
}

export default Test