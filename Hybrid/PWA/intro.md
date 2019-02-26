## PWA

无法在不借助原生程序辅助浏览器的前提下突破 web 平台本身对 web 应用固有的桎梏：客户端软件（即网页）需要下载所带来的网络延迟；与 Web 应用依赖浏览器作为入口所带来的体验问题。

Progressive Web Apps（以下简称 PWA）以及构成 PWA 的一系列关键技术的出现，终于让我们看到了彻底解决这两个平台级别问题的曙光：能够显著提高应用加载速度、甚至让 web 应用可以在离线环境使用的 Service Worker 与 Cache Storage；用于描述 web 应用元数据（metadata）、让 web 应用能够像原生应用一样被添加到主屏、全屏执行的 Web App Manifest；以及进一步提高 web 应用与操作系统集成能力，让 web 应用能在未被激活时发起推送通知的 Push API 与 Notification API 等等。

## manifest

Web App Manifest，即通过一个清单文件向浏览器暴露 web 应用的元数据，包括名字、icon 的 URL 等，以备浏览器使用，比如在添加至主屏或推送通知时暴露给操作系统，从而增强 web 应用与操作系统的集成能力。

## Service Worker

Service Worker 是一个可编程的 Web Worker，它就像一个位于浏览器与网络之间的客户端代理，可以拦截、处理、响应流经的 HTTP 请求；配合随之引入 Cache Storage API，你可以自由管理 HTTP 请求文件粒度的缓存，这使得 Service Worker 可以从缓存中向 web 应用提供资源，即使是在离线的环境下。出于安全考虑，注册 Service Worker 要求你的 web 应用部署于 HTTPS 协议下，以免利用 Service Worker 的中间人攻击。

## Push Notification

PWA 推送通知中的「推送」与「通知」，其实使用的是两个不同但又相得益彰的 API：

[Notification API](https://notifications.spec.whatwg.org/) 相信大家并不陌生，它负责所有与通知本身相关的机制，比如通知的权限管理、向操作系统发起通知、通知的类型与音效，以及提供通知被点击或关闭时的回调等等，目前国内外的各大网站（尤其在桌面端）都有一定的使用。

[Push API](https://w3c.github.io/push-api/) 的出现则让推送服务具备了向 web 应用推送消息的能力，它定义了 web 应用如何向推送服务发起订阅、如何响应推送消息，以及 web 应用、应用服务器与推送服务之间的鉴权与加密机制；由于 Push API 并不依赖 web 应用与浏览器 UI 存活，所以即使是在 web 应用与浏览器未被用户打开的时候，也可以通过后台进程接受推送消息并调用 Notification API 向用户发出通知。

