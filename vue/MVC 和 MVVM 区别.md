# MVC 和 MVVM 区别

## MVC

MVC 全名是 Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写。

![](E:\note\前端\笔记\vue\mvvm\mvc.jpg)

- Model（模型）：是程序需要操作的数据或信息。通常模型对象负责在数据库中存取数据
- View（视图）：是提供给用户的操作界面，是程序的外壳
- Controller（控制器）：是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据

> Controller 负责将 Model 的数据用 View 显示出来，
>
> 换句话说就是在 Controller 里面把 Model 的数据赋值给 View。

简单理解：

用户操作->View（负责接收用户的输入操作）->Controller（业务逻辑处理）->Model（数据持久化）->View（将结果反馈给View）



## MVVM

MVVM 新增了 VM 类

- ViewModel 层：做了两件事达到了数据的双向绑定 
- 一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。
- 二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。

![](E:\note\前端\笔记\vue\mvvm\mvvm.jpg)

> 把Model和View关联起来的就是ViewModel。
>
> ViewModel负责把Model的数据同步到View显示出来，还负责把View的修改同步回Model。

MVVM 与 MVC 最大的区别就是：它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变（对应Vue数据驱动的思想）


