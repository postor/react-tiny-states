import createStore, { createPipe } from "./lib";

export const list = createStore(['a', 'b', 'c'])
export const selectedIndex = createStore(0)
export const selectedProfile = createPipe(
  { name: '', repos: [] }
  ,[list,selectedIndex]
  ,
)