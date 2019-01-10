## Cookie

cookie是在客户端保存用户操作的历史信息，并在用户再次访问该站点时，浏览器通过 HTTP 协议将本地 cookie 内容发送给服务器，从而完成验证。

## Session

session是在服务器上保存用户操作的历史信息，并为客户端指定一个访问凭证。如果有客户端凭此凭证发出请求，则在服务端存储的信息中，取出用户相关登录信息，并且使用服务端返回的凭证常存储于Cookie中。这个访问凭证一般来说就是SessionID。session 可以储存在文件、数据库或内存中。

## token

一般指的是 JSON Web Token。客户端请求带上 token，服务端验证 token 是否有效，如果有效则开始处理。

参考[JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)了解 token。