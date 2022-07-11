[TOC]



## DDL常见操作汇总

### 库的管理

**显示库**

```mysql 
show databases;
```

**创建库** 

```mysql
create database [if not exists] 库名;
```

**删除库**

```mysql
drop databases [if exists] 库名;
```

**建库通用的写法**

```mysql
drop database if exists 旧库名;
create database 新库名;
```

**选择/使用数据库**

```mysql
use 要使用的库名;
```



### 表管理

**创建表**

```
create table 表名(
  字段名1 类型[(宽度)] [约束条件] [comment '字段说明'],
  字段名2 类型[(宽度)] [约束条件] [comment '字段说明'],
  字段名3 类型[(宽度)] [约束条件] [comment '字段说明']
)[表的一些设置];
```

宽度和约束条件为可选参数，字段名和类型是必须的

```mysql
CREATE TABLE IF NOT EXISTS `users`(
  name VARCHAR(20),
  age INT,
  height DOUBLE
);
```

数据类型: 

- 整数数字类型：INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT；

- 浮点数字类型：FLOAT，DOUBLE（FLOAT是4个字节，DOUBLE是8个字节）；
- 精确数字类型：DECIMAL，NUMERIC（DECIMAL是NUMERIC的实现形式）；

日期类型:

- YEAR以YYYY格式显示值
- DATE类型用于具有日期部分但没有时间部分的值：格式YYYY-MM-DD
- DATETIME类型用于包含日期和时间部分的值：格式'YYYY-MM-DD hh:mm:ss'
- TIMESTAMP数据类型被用于同时包含日期和时间部分的值：格式'YYYY-MM-DD hh:mm:ss'

字符串类型:

- CHAR类型在创建表时为固定长度，长度可以是0到255之间的任何值；
- VARCHAR类型的值是可变长度的字符串，长度可以指定为0到65535之间的值；
- BINARY和VARBINARY 类型用于存储二进制字符串，存储的是字节字符串；
- BLOB用于存储大的二进制类型；
- TEXT用于存储大的字符串类型；

**约束条件**

**主键：PRIMARY KEY**
一张表中，我们为了区分每一条记录的唯一性，必须有一个字段是永远不会重复，并且不会为空的，这个字段我们通常会将它设置为主键：

- 主键是表中唯一的索引；

- 并且必须是NOT NULL的，如果没有设置NOT NULL，那么MySQL也会隐式的设置为NOT NULL；

- 主键也可以是多列索引，PRIMARY KEY(key_part, ...)，我们一般称之为联合主键；

- 建议：开发中主键字段应该是和业务无关的，尽量不要使用业务字段来作为主键；



**唯一：UNIQUE**
某些字段在开发中我们希望是唯一的，不会重复的，比如手机号码、身份证号码等，这个字段我们可以使用UNIQUE来约束：

- 使用UNIQUE约束的字段在表中必须是不同的；
- 对于所有引擎，UNIQUE 索引允许NULL包含的列具有多个值NULL。



**不能为空：NOT NULL**

- 某些字段我们要求用户必须插入值，不可以为空，这个时候我们可以使用NOT NULL 来约束；



**默认值：DEFAULT**

- 某些字段我们希望在没有设置值时给予一个默认值，这个时候我们可以使用DEFAULT来完成；

**自动递增：AUTO_INCREMENT**

- 某些字段我们希望不设置值时可以进行递增，比如用户的id，这个时候可以使用AUTO_INCREMENT来完成；

**外键约束**也是最常用的一种约束手段，我们再讲到多表关系时，再进行讲解；



**删除表**

```mysql
drop table [if exists] 表名;
```

**修改表名**

```mysql
alter table 表名 rename [to] 新表名;
```



**复制表**

只复制表结构:

```mysql
create table 表名 like 被复制的表名;
```

复制表结构+数据:

```mysql
create table 表名 [as] select 字段,... from 被复制的表 [where 条件];

 create table test13 as select * from test11;
```



### 表中列的管理

**添加列**

```mysql
alter table 表名 add column 列名 类型 [列约束];

ALTER TABLE `moment` ADD `publishTime` DATETIME;
```

**修改列**

```mysql
alter table 表名 change column 列名 新列名 新类型 [约束];

ALTER TABLE `moment` CHANGE `publishTime` `publishDate` DATE;
```

**删除列**

```mysql
alter table 表名 drop column 列名;

ALTER TABLE `moment` DROP `updateTime`;
```



## DML常见操作

可以通过DML语句对表进行：添加、删除、修改等操作；

**插入操作**

```mysql
insert into 表名[(字段,字段)] values (值,值);

INSERT INTO `products` (`title`, `description`, `price`, `publishTime`)
VALUES ('huawei', 'iPhoneP40只要888', 888.88, '2020-11-11');
```

**删除数据**

```mysql
# 会删除表中所有的数据
DELETE FROM `products`;

# 会删除符合条件的数据
DELETE FROM `products` WHERE `title` = 'iPhone';
```

**修改数据**

```mysql
# 会修改表中所有的数据
UPDATE `products` SET `title` = 'iPhone12', `price` = 1299.88;

# 会修改符合条件的数据
UPDATE `products` SET `title` = 'iPhone12', `price` = 1299.88 WHERE `title` = 'iPhone';
```

**查看表结构**

通过 desc 表名; 就可以查看当前表的结构是由什么构成的。包含那些字段：

```
desc student;
```



## DQL语句

可以通过DQL从数据库中查询记录

基本语法:

```mysql
select 查询的列 from 表名;

#查询所有的数据并且显示所有的字段：
SELECT * FROM `products`;

# 查询title、brand、price：
SELECT title, brand, price FROM `products`;

#我们也可以给字段起别名：别名一般在多张表或者给客户端返回对应的key时会使用到；
SELECT title as t, brand as b, price as p FROM `products`;
```



## select条件查询:where

**条件查询运算符**: =，<>(!=)，>，<，>=，<=

```mysql
# 查询价格小于1000的手机
SELECT * FROM `products` WHERE price < 1000;

# 查询价格大于等于2000的手机
SELECT * FROM `products` WHERE price >= 2000;

# 价格等于3399的手机
SELECT * FROM `products` WHERE price = 3399;

# 价格不等于3399的手机
SELECT * FROM `products` WHERE price = 3399;

# 查询华为品牌的手机
SELECT * FROM `products` WHERE `brand` = '华为';
```



**逻辑查询运算符:** AND，OR

```mysql
# 查询品牌是华为，并且小于2000元的手机
SELECT * FROM `products` WHERE `brand` = '华为' and `price` < 2000;
SELECT * FROM `products` WHERE `brand` = '华为' && `price` < 2000;

# 查询1000到2000的手机（不包含1000和2000）
SELECT * FROM `products` WHERE price > 1000 and price < 2000;

# OR: 符合一个条件即可
# 查询所有的华为手机或者价格小于1000的手机
SELECT * FROM `products` WHERE brand = '华为' or price < 1000;
```



**like（模糊查询）**

```mysql
select 列名 from 表名 where 列 like pattern;
```

模糊查询使用LIKE关键字，结合两个特殊的符号：

- %表示匹配任意个的任意字符；
- _表示匹配一个的任意字符；

```mysql
# 查询所有以v开头的title
SELECT * FROM `products` WHERE title LIKE 'v%';

# 查询带M的title
SELECT * FROM `products` WHERE title LIKE '%M%';

# 查询带M的title必须是第三个字符
SELECT * FROM `products` WHERE title LIKE '__M%';
```



**BETWEEN AND(区间查询)**

```mysql
selec 列名 from 表名 where 列名 between 值1 and 值2;

select * from stu t where t.age between 25 and 32;
```



**IN查询 NOT IN查询**   

```mysql
select 列名 from 表名 where 字段 in (值1,值2,值3,值4);

select 列名 from 表名 where 字段 not in (值1,值2,值3,值4);
```



## 排序和分页（order by 、limit）

### 排序查询（order by）

ORDER BY有两个常用的值：

- ASC：升序排列；
- DESC：降序排列；
- 默认为asc；

```mysql
select 字段名 from 表名 order by 字段1 [asc|desc],字段2 [asc|desc];


SELECT * FROM `products` WHERE brand = '华为' or price < 1000 ORDER BY price ASC;

select * from stu order by age desc,id asc;
```



### limit

offset：表示偏移量，通俗点讲就是跳过多少行，offset可以省略，默认为0，表示跳过0行；范围：[0,+∞)。 

count：跳过offset行之后开始取数据，取count行记录；范围：[0,+∞)。

```mysql
select 列 from 表 limit [offset,] count;

SELECT * FROM `products` LIMIT 30 OFFSET 0;
SELECT * FROM `products` LIMIT 30 OFFSET 30;
SELECT * FROM `products` LIMIT 30 OFFSET 60;
# 另外一种写法：offset, row_count
SELECT * FROM `products` LIMIT 90, 30;
```



page：表示第几页，从1开始，范围[1,+∞) 

pageSize：每页显示多少条记录，范围[1,+∞) 

如：page = 2，pageSize = 10，表示获取第2页10条数据。 我们使用limit实现分页，语法如下： 

```mysql
 select 列 from 表名 limit (page - 1) * pageSize,pageSize;
```



## 聚合函数

```mysql
# 华为手机价格的平均值
SELECT AVG(price) FROM `products` WHERE brand = '华为';

# 计算所有手机的平均分
SELECT AVG(score) FROM `products`;

# 手机中最低和最高分数
SELECT MAX(score) FROM `products`;
SELECT MIN(score) FROM `products`;

# 计算总投票人数
SELECT SUM(voteCnt) FROM `products`;

# 计算所有条目的数量
SELECT COUNT(*) FROM `products`;

# 华为手机的个数
SELECT COUNT(*) FROM `products` WHERE brand = '华为';
```



## 分组查询（group by、having）

GROUP BY通常和聚合函数一起使用：

- 表示我们先对数据进行分组，再对每一组数据，进行聚合函数的计算；

```mysql
# 根据品牌进行分组；计算各个品牌中：商品的个数、最高价格
SELECT brand,
  COUNT(*) as count,
  MAX(price) as maxPrice
FROM `products` GROUP BY brand;
```



**HAVING**

使用我们希望给Group By查询到的结果添加一些约束，那么我们可以使用：HAVING。

- 比如：如果我们还希望筛选出平均价格在4000以下，并且平均分在7以上的品牌：

```mysql
SELECT brand,
  COUNT(*) as count,
  ROUND(AVG(price),2) as avgPrice,
  MAX(price) as maxPrice,
  MIN(price) as minPrice,
  AVG(score) as avgScore
FROM `products` GROUP BY brand
HAVING avgPrice < 4000 and avgScore > 7;
```



## 连接查询

**内连接**

CROSS JOIN或者JOIN都可以；

```mysql
SELECT * FROM `products` INNER JOIN `brand` ON `products`.brand_id = `brand`.id;
```

用java伪代码描述：

```mysql
for(Object eleA : A){
  for(Object eleB : B){
    if(连接条件是否为true){
    	System.out.print(eleA+","+eleB);
    }
  }
}
```



**外连接**

外连接涉及到2个表，分为：主表和从表，要查询的信息主要来自于哪个表，谁就是主表。

最终：外连接查询结果 = 内连接的结果 + 主表中有的而内连接结果中没有的记录。 

外连接分为2种： 

左外链接：使用left join关键字，left join左边的是主表。 

右外连接：使用right join关键字，right join右边的是主表。



**左连接**

```mysql
select 列 from 主表 left join 从表 on 连接条件;

SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id;
```



**右连接**

```mysql
select 列 from 从表 right join 主表 on 连接条件;

SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id;
```



**全连接**

SQL规范中全连接是使用FULL JOIN，但是MySQL中并没有对它的支持，我们需要使用UNION 来实现：

```mysql
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id)
UNION
(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id);
```



