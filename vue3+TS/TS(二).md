[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇博客收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉https://github.com/mengqiuleo/myNote





## 函数的使用

### 函数类型示例

```ts
function add(x: number, y: number): number {
  return x + y
}

let myAdd = function(x: number, y: number): number {
  return x + y
}
```



### 参数的可选类型

**可选类型需要在必传参数的后面**

```ts
function add(x: number, y?: number): void {
  console.log(x,y)
}
```



### 默认参数

JavaScript是支持默认参数的，TypeScript也是支持默认参数的：

```ts
function add(x: number, y: number = 6): void {
  console.log(x,y)
}
```

这个时候y的类型其实是undefined 和number 类型的联合。



### 剩余参数

在 TypeScript 里，你可以把所有参数收集到一个变量里： 剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ `...`）后面给定的名字，你可以在函数体内使用这个数组。

```typescript
function info(x: string, ...args: string[]) {
  console.log(x, args)
}
info('abc', 'c', 'b', 'a')
```



### 可推导的this类型

TypeScript是如何处理this呢？

```ts
const info = {
  name: 'pan',
  sayHello(): void {
    console.log(this.name)
  }
}

info.sayHello()//pan
```

上面的代码是可以正常运行的，也就是TypeScript在编译时，认为我们的this是可以正确去使用的：

TypeScript认为函数sayHello 有一个对应的this的外部对象info，所以在使用时，就会把this当做该对象。



### 函数的重载

**函数重载: 函数名相同, 而形参不同的多个函数**

需求: 我们有一个add函数，它可以接收2个string类型的参数进行拼接，也可以接收2个number类型的参数进行相加

```ts
// 重载函数声明
function add(x: string, y: string): string
function add(x: number, y: number): number

// 定义函数实现
function add(x: string | number, y: string | number): string | number {
  // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 x + y
  if (typeof x === 'string' && typeof y === 'string') {
    return x + y
  } else if (typeof x === 'number' && typeof y === 'number') {
    return x + y
  }
}

console.log(add(1, 2))
console.log(add('a', 'b'))
// console.log(add(1, 'a')) // error
```





## 类的使用

### 基本示例

```ts
/*
类的基本定义与使用
*/

class Greeter {
  // 声明属性
  message: string

  // 构造方法
  constructor(message: string) {
    this.message = message
  }

  // 一般方法
  greet(): string {
    return 'Hello ' + this.message
  }
}

// 创建类的实例
const greeter = new Greeter('world')
// 调用实例的方法
console.log(greeter.greet())
```



### 继承

```ts
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  run(distance: number = 0) {
    console.log(`${this.name} run ${distance}m`)
  }
}

class Snake extends Animal {
  constructor(name: string) {
    // 调用父类型构造方法
    super(name)
  }

  // 重写父类型的方法
  run(distance: number = 5) {
    console.log('sliding...')
    super.run(distance)
  }
}

class Horse extends Animal {
  constructor(name: string) {
    // 调用父类型构造方法
    super(name)
  }

  // 重写父类型的方法
  run(distance: number = 50) {
    console.log('dashing...')
    // 调用父类型的一般方法
    super.run(distance)
  }

  xxx() {
    console.log('xxx()')
  }
}

const snake = new Snake('sn')
snake.run()

const horse = new Horse('ho')
horse.run()

// 父类型引用指向子类型的实例 ==> 多态
const tom: Animal = new Horse('ho22')
tom.run()

/* 如果子类型没有扩展的方法, 可以让子类型引用指向父类型的实例 */
const tom3: Snake = new Animal('tom3')
tom3.run()
/* 如果子类型有扩展的方法, 不能让子类型引用指向父类型的实例 */
// const tom2: Horse = new Animal('tom2')
// tom2.run()
```

`Snake`类和 `Horse` 类都创建了 `run` 方法，它们重写了从 `Animal` 继承来的 `run` 方法，使得 `run` 方法根据不同的类而具有不同的功能。

注意，即使 `tom` 被声明为 `Animal` 类型，但因为它的值是 `Horse`，调用 `tom.run(34)` 时，它会调用 `Horse` 里重写的方法。



### 类的成员修饰符

在TypeScript中，类的属性和方法支持三种修饰符： public、private、protected

- public 修饰的是在任何地方可见、公有的属性或方法，默认编写的属性就是public的；
- private 修饰的是仅在同一类中可见、私有的属性或方法；
- protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法；

`protected` 修饰符与 `private` 修饰符的行为很相似，但有一点不同，`protected`成员在子类中仍然可以访问。

```ts
class Animal {
  public name: string

  public constructor(name: string) {
    this.name = name
  }

  public run(distance: number = 0) {
    console.log(`${this.name} run ${distance}m`)
  }
}

class Person extends Animal {
  private age: number = 18
  protected sex: string = '男'

  run(distance: number = 5) {
    console.log('Person jumping...')
    super.run(distance)
  }
}

class Student extends Person {
  run(distance: number = 6) {
    console.log('Student jumping...')

    console.log(this.sex) // 子类能看到父类中受保护的成员
    // console.log(this.age) //  子类看不到父类中私有的成员

    super.run(distance)
  }
}

console.log(new Person('abc').name) // 公开的可见
// console.log(new Person('abc').sex) // 受保护的不可见
// console.log(new Person('abc').age) //  私有的不可见
```



### readonly 修饰符

可以使用 `readonly` 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```typescript
class Person {
  readonly name: string = 'abc'
  constructor(name: string) {
    this.name = name
  }
}

let john = new Person('John')
// john.name = 'peter' // error
```



### 抽象类

抽象类做为其它派生类的基类使用。 它们不能被实例化。不同于接口，抽象类可以包含成员的实现细节。 `abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```typescript
/*
抽象类
  不能创建实例对象, 只有实现类才能创建实例
  可以包含未实现的抽象方法
*/

abstract class Animal {
  abstract cry()

  run() {
    console.log('run()')
  }
}

class Dog extends Animal {
  cry() {
    console.log(' Dog cry()')
  }
}

const dog = new Dog()
dog.cry()
dog.run()
```



### 类的类型

**类本身也是可以作为一种数据类型的**：

```ts
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
  running() {
    console.log(this.name + "running")
  }
}

const p1: Person = new Person('pan')
```

