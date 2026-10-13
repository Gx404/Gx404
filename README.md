# GX404 个人导航

黑色背景、中央大标题与底部入口布局，独立实现 GX404 的静态门户。页面不依赖第三方字体、图片、分析服务或运行时软件包。

## 内容

- 摄影作品：https://ph.gx404.cn/
- 会员看板：https://vip.gx404.cn/
- 服务器探针：https://vps.gx404.cn/
- 文件互传：https://ios.gx404.cn/

Sub 是下载转发服务，不展示为独立页面。摄影新域名由用户指定为 `ph.gx404.cn`。

## 维护与预览

修改 `dist/site.config.js` 可以更新标题、介绍和站点入口。`dist/index.html` 保留了无 JavaScript 时可使用的静态入口，修改链接时也应同步更新该文件。

运行 `node preview.mjs`，然后打开终端给出的本地地址。发布静态文件时上传 `dist` 中的全部文件即可，不需要构建或数据库。

## 部署

正式入口已经切换：`gx404.cn` 直接提供 `dist/`，摄影应用通过 `ph.gx404.cn` 反向代理到原有服务。现有摄影容器、数据库和上传目录保持不变。

服务器使用 [`deploy/Caddyfile`](deploy/Caddyfile)。更新页面时同步上传 `dist/`，然后按服务器上的 Caddy 流程重新加载配置即可。`sub.gx404.cn` 仍是 CDN 下载转发，不作为网页入口。

## 已验证

- 桌面端显示中央标题、底部四个入口和黑色背景。
- 点击、拖动背景会出现彩色 WebGL 流体；暂停按钮可以停止并恢复动效。
- `gx404.cn`、`ph.gx404.cn`、`vip.gx404.cn`、`vps.gx404.cn`、`ios.gx404.cn` 均返回 HTTP 200。
- `app.js` 与 `dist/vendor/fluid.js` 通过语法检查。


