# ssr example

```

```

## wait store values and generate html

[src/render.ts](./src/render.ts)
```
export async function render(i: number) {
  selectedIndex.setState(i)
  let vals = Store.waitStoresReady(stores)
  return [vals, renderToString(createElement(Index))]
}
```

## put values to global var and html to body

[index.html](./index.html)
```
<body>
  {html}
  <script>
    var STORE_VALS={vals}
  </script>
  <script src="/main.js"></script>
</body>
```

## load values before client render

[src/client.ts](./src/client.ts)
```
let { STORE_VALS } = window
Store.initStores(stores, STORE_VALS)

ReactDOM.render(
  createElement(Index),
  document.querySelector('[data-reactroot]')
)
```
