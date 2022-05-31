// 什么是虚拟DOM？ 用JS模拟DOM结构
//数据改变 -> 虚拟DOM(计算变更) -> 操作真实DOM -> 视图更新

{
  tag: 'div';
  props: {
    id: 'app';
    className: 'container'
  };
  children: [
    {
      tag: 'h1',
      children: '虚拟DOM'
    },
    {
      tag: 'ul',
      props: { style: 'color: brown'},
      children: [
        {
          tag: 'li',
          children: '第一项'
        },
        {
          tag: 'li',
          children: '第二项'
        },
        {
          tag: 'li',
          children: '第三项'
        }
      ]
    }
  ]
}