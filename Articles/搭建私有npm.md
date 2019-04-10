# 搭建私有npm

需要准备的：

- [cnpmjs.org](https://github.com/cnpm/cnpmjs.org)
- mysql
- Node >=8.0.0

## 准备好需要的环境

首先`git clone https://github.com/cnpm/cnpmjs.org.git`，由于官方维护的不及时性，某些文档中的说明其实是已被弃用的。比如安装依赖，在 README 中依然是进入到项目路径中执行`make install`，但这个命令已经被删除。

现在我们通过执行`yarn install`安装`cnpmjs.org`项目所需依赖。

然后使用`brew install mysql`安装 mysql。

在 Navicat 中新建一个 mysql 的 connection，新增一个名称为`cnpmjs`的数据库。并进入 Query 执行`cnpmjs.org`中 `docs/db.sql`的语句之后，可以看到数据库中多出了很多个表。

## 配置

在`cnpmjs.org`中的`config/index.js`是项目的默认配置，在该路径下新建一个`config.js`文件作为自定义配置。

```javascript
module.exports = {
  enablePrivate: true,
  database: {
    db: 'cnpmjs',
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: ''
  },
  admins: {
    admin: 'admin@dian.so',
  },
  syncModel: 'exist',// 'none', 'all', 'exist'
  registryHost: '127.0.0.1:7001',
};
```

在本地使用这种配置作初步调试。

## 调试

在`cnpmjs.org`项目中，通过`make dev`启动本地调试，此时注意观察是否有报错信息。成功启动后，访问`127.0.0.1:7002`可以访问到与 [cnpmjs.org](https://cnpmjs.org) 一样的页面。

新建一个项目作测试。

使用`npm init`创建一个新的项目，新建一个`index.js`作为入口。

值得说的是，由于我们需要访问的 registry 是 `http://127.0.0.1:7001`，所以需要`npm config set registry http://127.0.0.1:7001`设置 registry，或者在每个 npm 命令后加上`--registry=http://127.0.0.1:7001`。

在终端中，使用`npm adduser`新增一个 npm 账户，如下

```bash
npm login

Username: admin
Password:
Email: (this IS public) admin@dian.so

Logged in as admin on http://127.0.0.1:7001/.
```

此时登录的 npm 账户为 admin，然后使用`npm publish`即可发布这个包。

在`127.0.0.1:7002`可以搜索到，在`~/.cnpmjs.org/nfs`可以找到这个包，且使用`yarn add test`可以安装这个包到`node_modules`中。