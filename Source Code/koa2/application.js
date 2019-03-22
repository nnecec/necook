const debug = require('debug')('koa:application');
const onFinished = require('on-finished'); // https://github.com/jshttp/on-finished
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json'); // 检查入参 body 是否是 JSON
const context = require('./context');
const request = require('./request');
const statuses = require('statuses'); // 提供是否是对应 http status https://www.npmjs.com/package/statuses
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');

module.exports = class Application extends Emitter {
  constructor() {
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }


  /**
   * 通过 this.callback 获取参数
   *
   * @param {*} args
   * @returns
   */
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * JSON 过滤返回指定结构
   *
   * @return {Object}
   */
  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  inspect() {
    return this.toJSON();
  }

  /**
   * 将 中间件 方法加入到 this.middleware
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');

    this.middleware.push(fn);
    return this;
  }

  /**
   * 将 req 和 res 封装成 ctx
   * @return {Function} 传给 createServer 的 requestListener 监听函数
   */
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res); // 封装出 ctx
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  /**
   * 使用 fnMiddleware 处理 ctx 并返回
   * @return {Promise} 返回了一个 promise 这个 promise 用来处理每次请求
   */
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err); // 处理请求错误
    const handleResponse = () => respond(ctx); // 处理正确res
    onFinished(res, onerror); // 请求终止时调用 onerror
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * 封装 req 和 res 并返回 ctx
   */
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * 错误处理
   */
  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};


/**
 * 处理经过中间件处理后的 ctx 并作为最终 res
 *
 * @param {*} ctx
 * @returns
 */
function respond(ctx) {
  // 提供跳过处理的选择
  if (false === ctx.respond) return;

  // 如果 ctx 不可写
  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // 如果 code 是对应 empty 内容时
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  // 如果是 HEAD 方法
  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) { // 如果 res未发出 且 body 是JSON格式
      ctx.length = Buffer.byteLength(JSON.stringify(body)); // 设置 ctx 长度
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body 是 JSON 格式时
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}