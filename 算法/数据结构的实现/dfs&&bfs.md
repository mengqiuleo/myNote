## dfs&&bfs

### dfs

```js
const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3]
};
const visited = new Set();
const dfs = (n) => {
  console.log(n);
  visited.add(n);
  graph[n].forEach(c => {
    if(!visited.has(c)){
      dfs(c);
    }
  });
}

dfs(2);// 2 0 1 3

```

![](E:\gitNote\算法\数据结构的实现\图片\dfs.jpg)



## bfs

```js
const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3]
};
const visited = new Set();
visited.add(2);
const q = [2];
while(q.length) {
  const n = q.shift();
  console.log(n);
  graph[n].forEach(c => {
    if(!visited.has(c)) {
      q.push(c);
      visited.add(c);
    }
  });
}
// 2 0 3 1

```

