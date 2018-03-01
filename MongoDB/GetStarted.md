# Get Started

## installation

1. 安装 mongodb: `brew install mongodb`

2. 在 node 项目中，安装 mongoose: `npm i -s mongoose`

3. 配置 connect

```javascript
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
```