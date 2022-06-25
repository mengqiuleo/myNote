[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇博客收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉https://github.com/mengqiuleo/myNote





## 接口的使用

使用接口（Interfaces）来定义对象的类型。`接口是对象的状态(属性)和行为(方法)的抽象(描述)`



### 基本案例

```ts
// 定义人的接口
interface IPerson {
  id: number
  name: string
  age: number
  sex: string
}

const person1: IPerson = {
  id: 1,
  name: 'tom',
  age: 20,
  sex: '男'
}
```

类型检查器会查看对象内部的属性是否与 IPerson 接口描述一致, 如果不一致就会提示类型错误。



### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。

```typescript
interface IPerson {
  id: number
  name: string
  age: number
  sex?: string
}
```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 `?` 符号。

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

```typescript
const person2: IPerson = {
  id: 1,
  name: 'tom',
  age: 20
  // sex: '男' // 可以没有
}
```



### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly` 来指定只读属性:

```typescript
interface IPerson {
  readonly id: number
  name: string
  age: number
  sex?: string
}
```

一旦赋值后再也不能被改变了。

```typescript
const person2: IPerson = {
  id: 2,
  name: 'tom',
  age: 20
  // sex: '男' // 可以没有
  // xxx: 12 // error 没有在接口中定义, 不能有
}
person2.id = 2 // error
```



#### readonly vs const

最简单判断该用 `readonly` 还是 `const` 的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用 `readonly`。



### 索引类型

```ts
interface FrontLanguage {
  [index: number]: string
}

const frontend: FrontLanguage = {
  1: "HTML",
  2: "CSS",
  3: "JavaScript"
}

interface LanguageBirth {
  [name: string]: number
  Java: number
}

const language: LanguageBirth = {
  "Java": 1995,
  "JavaScript": 1996,
  "C": 1972
}
```



### 函数类型

接口能够描述 JavaScript 中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```typescript
/*
接口可以描述函数类型(参数的类型与返回的类型)
*/

interface SearchFunc {
  (source: string, subString: string): boolean
}
```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```typescript
const mySearch: SearchFunc = function(source: string, sub: string): boolean {
  return source.search(sub) > -1
}

console.log(mySearch('abcd', 'bc'))
```





### 接口继承

**接口是支持多继承的（类不支持多继承）**

```ts
interface Person {
  name: string
  eating: () => void
}

interface Animal {
  running: () => void
}

interface Student extends Person, Animal {
  sno: number
}

const stu: Student = {
  sno: 110,
  name: 'Pan',
  eating: function () {
  },
  running: function (): void {
    
  }
}
```



### 类的接口

```ts
interface Alarm {
  alert(): any
}

interface Light {
  lightOn(): void
  lightOff(): void
}

class Car implements Alarm {
  alert() {
    console.log('Car alert')
  }
}
    
// 一个类可以实现多个接口
class Car2 implements Alarm, Light {
  alert() {
    console.log('Car alert')
  }
  lightOn() {
    console.log('Car light on')
  }
  lightOff() {
    console.log('Car light off')
  }
}
```



### 交叉类型

联合类型表示多个类型中一个即可

```ts
type Alignment = 'left' | 'right' | 'center'
```



还有另外一种类型合并，就是交叉类型：

- 交叉类似表示需要满足多个类型的条件；
- 交叉类型使用& 符号；

```ts
type MyType = number & string

//表达的含义是number和string要同时满足；
//但是有同时满足是一个number又是一个string的值吗？其实是没有的，所以MyType其实是一个never类型；
```



#### 交叉类型的应用

在开发中，我们进行交叉时，通常是对对象类型进行交叉的：

```ts
interface Colorful {
  color: string
}

interface IRun {
  running: () => void
}

type NewType = Colorful & IRun

const obj: NewType = {
  color: 'red',
  running: function() {
    
  }
}
```



### interface和type区别

如果是定义非对象类型，通常推荐使用type

如果是定义对象类型，那么他们是有区别的：

- interface 可以重复的对某个接口来定义属性和方法；
- 而type定义的是别名，别名是不能重复的；

```ts
interface IPerson {
  name: string
  running: () => void
}

interface IPerson {
  age: number
}

type Person = {
  name: string
  running: () => void
}

  // 这里会报错
type Person = { //标识符“Person”重复。
  age: number
}
```





## 泛型的使用

**指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性。**



### 基本案例

```ts
function createArray2<T>(value: T, count: number) {
  const arr: Array<T> = []
  for (let index = 0; index < count; index++) {
    arr.push(value)
  }
  return arr
}
const arr3 = createArray2<number>(11, 3)
console.log(arr3)//[ 11, 11, 11 ]

const arr4 = createArray2<string>('aa', 3)
console.log(arr4)//[ 'aa', 'aa', 'aa' ]
```



### 多个泛型参数的函数

一个函数可以定义多个泛型参数

```ts
function swap<K, V>(a: K, b: V): [K, V] {
  return [a, b]
}
const result = swap<string, number>('abc', 123)
console.log(result[0].length, result[1].toFixed())
```



### 泛型接口

在定义接口的时候我们也可以使用泛型：

**在定义接口时, 为接口中的属性或方法定义泛型类型 在使用接口时, 再指定具体的泛型类型**

```ts
interface IPerson<T1 = string, T2 = number> {
  name: T1
  age: T2
}

const p: IPerson = {
  name: 'pan',
  age: 18
}
```



### 泛型类

**在定义类时, 为类中的属性或方法定义泛型类型 在创建类的实例时, 再指定特定的泛型类型**

```ts
class Point<T> {
  x: T
  y: T

  constructor(x: T, y: T) {
    this.x = x
    this.y = y
  }
}

const p1 = new Point(10,20)
const p2 = new Point<number>(10,20)
const p3:Point<number> = new Point(10,20)
```



### 泛型约束

如果我们直接对一个泛型参数取 `length` 属性, 会报错, 因为这个泛型根本就不知道它有这个属性

```typescript
// 没有泛型约束
function fn<T>(x: T): void {
  // console.log(x.length)  // error
}
```

我们可以使用泛型约束来实现

```typescript
interface Lengthwise {
  length: number
}

// 指定泛型约束
function fn2<T extends Lengthwise>(x: T): void {
  console.log(x.length)
}
```

我们需要传入符合约束类型的值，必须包含必须 `length` 属性：

```typescript
fn2('abc')
// fn2(123) // error  number没有length属性
```