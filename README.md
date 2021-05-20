# react-tiny-states

用来给 React 管理小状态的库 | tiny states management for react 

## 对比其他状态管理库 | compare with other

|   | redux | recoil | pure-store | react-tiny-states |
|---|---|---|---|---|
| single/multi | single | multi | multi | multi |
| base on | context | context | state | state |
| async | third party | √ | × | √ |

## 基本使用 | basic usage

```
import Store from "react-tiny-states"
// basic
export const selectedIndex = new Store(0)
// async
const list=['a','b','c']
export const selected = new Store('',[selectedIndex],selectedIndex=>list[selectedIndex])

```