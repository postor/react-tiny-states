# react-tiny-states

用来给 React 管理小状态的库 | tiny states management for react 

## 对比其他状态管理库 | compare with other

|              | redux       | recoil  | pure-store | react-tiny-states |
| ------------ | ----------- | ------- | ---------- | ----------------- |
| single/multi | single      | multi   | multi      | multi             |
| base on      | context     | context | state      | state             |
| async        | third party | √       | ×          | √                 |

## 基本使用 | basic usage

```
import Store,{useStore} from "react-tiny-states"

// 简单变量 | basic init 
const selectedIndex = new Store(0)

// 异步变量 | async init
const list = new Store([], [], () => getList().then((list=[])=>list)
const Index=()=>{
  let [arr,pending]=useStore(list)
  if(pending) return 'loading...'
  return <ul>{arr.map((x,i)=><li key={i}>{x}</li>)}</ul>
}

// 计算值 | computed init
const selected = new Store('',[selectedIndex,list],selectedIndex=>list[Math.min(selectedIndex,list.length-1)])

// 异步计算值 | computed async init
const desc = new Store(
  'default desc'
  , [selected]
  , (selected) => () => getDesc(selected).then(desc=>desc)
)

// 更新 | update
const Test = () => {
  let [i, pending, setI] = useStore(index)
  return <>
    <p>value:{i + ''},pending:{pending + ''}</p>
    <button onClick={
      () => setI(0) // 更新 | basic update
    }>reset</button>
    <button onClick={
      () => setI(x => x + 1) // reducer 更新 | reducer update
    }>+1</button>
    <button onClick={
      // 异步 reducer 更新 | async reducer update
      () => setI(() => new Promise(resolve => {
      setTimeout(() => resolve(y => y + 1), 1000)
    }))}>+1 delay 1s</button>
  </>
}
```

## ssr

refer [examples/ssr](./examples/ssr)