# Gx404 个人导航

黑色背景、可随流体背景变色的中央标题与彩色表情导航，独立实现 Gx404 的静态门户。底栏保留版权和工信部备案链接。页面不依赖第三方字体、图片、分析服务或运行时软件包。

## 内容

- 摄影作品：https://ph.gx404.cn/
- 会员看板：https://vip.gx404.cn/
- 服务器探针：https://vps.gx404.cn/
- 文件互传：https://ios.gx404.cn/

Sub 是下载转发服务，不展示为独立页面。摄影新域名由用户指定为 `ph.gx404.cn`。

## 维护与预览

修改 `dist/site.config.js` 可以更新标题、介绍、站点入口和备案信息。`dist/index.html` 保留了无 JavaScript 时可使用的静态入口，修改链接时也应同步更新该文件。

运行 `node preview.mjs`，然后打开终端给出的本地地址。发布静态文件时上传 `dist` 中的全部文件即可，不需要构建或数据库。

## 部署

正式入口已经切换：`gx404.cn` 直接提供 `dist/`，摄影应用通过 `ph.gx404.cn` 反向代理到原有服务。现有摄影容器、数据库和上传目录保持不变。

服务器源码位于 `/home/gx404/apps/gx404-home`，使用 [`deploy/Caddyfile`](deploy/Caddyfile)。修改完成后先提交到本仓库，再在服务器快进更新；只更新静态页面时无需重启。仓库推送不会自动部署。修改路由时，备份 `/etc/caddy/Caddyfile`，验证新配置，再安装到该路径并重新加载 Caddy，确保服务器重启后仍有效。

旧摄影页面与上传图片路径会以 308 跳转到 `ph.gx404.cn`，保留路径和查询参数。摄影应用的域名设置见 [`deploy/photography.compose.yml`](deploy/photography.compose.yml)，它叠加到现有摄影 Compose 配置之后，仅调整公开站点地址。当前摄影镜像的 `robots.txt` 是构建时生成的，因此由 Caddy 提供正确的新站点地图地址。

摄影应用继续使用原有镜像、启动方式和数据卷。更新公开域名时只重新创建应用服务，不构建镜像、不启动数据库初始化。首次切换前的 Caddy 配置保留在服务器 `/home/gx404/backups/gx404-home/Caddyfile.before-20261013`。`sub.gx404.cn` 仍是 CDN 下载转发，不作为网页入口。

## 已验证

- 桌面端显示中央标题、底部四个入口和黑色背景。
- 390 × 844 与 320 × 640 手机布局无横向溢出，四个入口完整可见。
- 点击、拖动背景会出现彩色 WebGL 流体；标题使用混色呈现背景颜色，并遵循系统减少动态效果偏好。
- `gx404.cn`、`ph.gx404.cn`、`vip.gx404.cn`、`vps.gx404.cn`、`ios.gx404.cn` 均返回 HTTP 200。
- `app.js` 与 `dist/vendor/fluid.js` 通过语法检查。


