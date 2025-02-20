import { list, selectedIndex } from "./stores"

const List = () => {
  let [users, pending] = list.use()
  let [i, , setI] = selectedIndex.use()
  // return <div>{JSON.stringify({ users, pending, i })}</div>
  if (pending) {
    return <div>list loading...</div>
  }
  return <ul>{users.map((x, i1) => <li key={x}
    style={{
      border: i1 == i ? '1px solid black' : 'none'
    }}
    onClick={() => setI(i1)}
  >{x}</li>)}</ul>
}

export default List

