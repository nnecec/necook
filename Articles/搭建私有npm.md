# 搭建私有npm

## 1. 使用 cnpmjs.org 搭建

需要准备的：

- [cnpmjs.org](https://github.com/cnpm/cnpmjs.org)
- mysql
- Node >=8.0.0

### 准备好需要的环境

首先`git clone https://github.com/cnpm/cnpmjs.org.git`，由于官方维护的不及时性，某些文档中的说明其实是过时的。比如安装依赖，在 README 中依然是进入到项目路径中执行`make install`，但这个命令已经被删除。

现在通过执行`yarn install`安装`cnpmjs.org`项目所需依赖。

然后使用`brew install mysql`安装 mysql。

在 Navicat 中新建一个 mysql 的 connection，新增一个名称为`cnpmjs`的数据库。登录数据库并进入 Query 执行`cnpmjs.org`中 `docs/db.sql`的语句来初始化数据库。

### 配置

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
    admin: 'nnecec@outlook',
  },
  syncModel: 'exist',// 'none', 'all', 'exist'
  registryHost: '127.0.0.1:7001',
};
```

在本地使用这种配置作初步调试。

### 调试

在`cnpmjs.org`项目中，通过`make dev`启动本地调试，此时注意观察是否有报错信息。成功启动后，访问`127.0.0.1:7002`可以访问到与 [cnpmjs.org](https://cnpmjs.org) 一样的页面。

新建一个项目作测试。

使用`npm init`创建一个新的项目，新建一个`index.js`作为入口。

值得说的是，由于我们需要访问的 registry 是 `http://127.0.0.1:7001`，所以需要`npm config set registry http://127.0.0.1:7001`设置 registry，或者在每个 npm 命令后加上`--registry=http://127.0.0.1:7001`。

在终端中，使用`mysqld`启动本地 mysql，使用`npm adduser`新增一个 npm 账户，如下

```bash
npm login

Username: nnecec
Password:
Email: (this IS public) nnecec@outlook.com

Logged in as nnecec on http://127.0.0.1:7001/.
```

此时登录的 npm 账户为 nnecec，然后使用`npm publish`即可发布这个包。

在`127.0.0.1:7002`可以搜索到，在`~/.cnpmjs.org/nfs`可以找到这个包，且使用`yarn add test`可以安装这个包到`node_modules`中。

## 2.使用 verdaccio 搭建

> https://github.com/huangshuwei/blog/issues/15

[verdaccio](https://github.com/verdaccio/verdaccio) 不再需要 mysql 的支持，使用本地文件系统作为储存方式。

### 安装与调试

通过`npm install -g verdaccio`安装 verdaccio。然后可以使用`verdaccio`启动本地服务。

```bash
➜ verdaccio
 warn --- config file  - /Users/nnecec/.config/verdaccio/config.yaml
 warn --- Plugin successfully loaded: htpasswd
 warn --- Plugin successfully loaded: audit
 warn --- http address - http://localhost:4873/ - verdaccio/3.11.6
```

verdaccio 的配置默认在`~/.config/verdaccio/config.yaml`中，可以在启动 verdaccio 时选择自定义的配置，如`verdaccio --listen 4000 --config ~./config.yaml`。

访问 localhost:4873 会有一个类似 cnpmjs.org 的页面供查看本地所有的库。

再去上面的测试包，同样可以登录用户且发布到这个私有源中。

### 配置

verdaccio 提供了丰富的配置。在[配置文件](https://verdaccio.org/docs/en/configuration)中可以查看文档。举例如下：

```yaml
storage: ./storage
auth:
  htpasswd: # 权限校验策略
    file: ./htpasswd
    max_users: 10000
# 上行源
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    cache: false # 禁用缓存 将只缓存package.json
  taobao:
    url: https://registry.npm.taobao.org
# 配置包访问权限
packages:
  '@dian/*': # 不使用公开库代理 @dian 下的包
    access: $all # 所有人都可以访问
    publish: admin nnecec # admin 和 nnecec 可以发布
  '**': # 其余的包使用 npmjs 代理
    access: $anonymous # 未登录的可以访问
    publish: $authenticated # 已登陆的可以发布
    proxy: npmjs
listen:
# - localhost:4873            # default
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### 在服务器使用 docker 配置 verdaccio

参考[官方文档](https://verdaccio.org/docs/en/docker)拉取最新的 verdaccio

```bash
docker pull verdaccio/verdaccio:4.x-next
```

在根目录创建 docker 文件夹。从 docker-examples 获取基础配置，并拷贝到 docker 中。

```bash
mkdir -p ~/docker/verdaccio
git clone https://github.com/verdaccio/docker-examples.git
cd docker-example
mv docker-local-storage-volume  ~/docker/verdaccio
```

进入`conf/config.yaml`进行配置，如

```yaml
...
uplinks:
  taobao:
    url: https://registry.npm.taobao.org/
packages:
  '@dian/*':
    access: $all
    publish: dian
  '**':
    access: $all
    publish: dian
    proxy: taobao
...
```

回到 verdaccio 文件夹，通过`docker-compose up -d`在后台启用服务，此时访问 ip:4873 即可访问到 verdaccio。