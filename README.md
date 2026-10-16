一个纯静态导航页面，展示摄影、会员看板、服务器探针和文件互传四个独立子站。页面支持彩色 WebGL 流体、移动端布局和减少动态效果偏好。
## 容器部署

仓库提供通用 Nginx 容器和 Compose 配置：

```sh
git clone https://github.com/Gx404/light.git gx404-home
cd gx404-home
docker compose up -d --build
```

默认端口是 `8080`，健康检查地址是 `/healthz`。也可以使用 GHCR 预构建镜像：

```sh
docker compose -f docker-compose.yml -f docker-compose.ghcr.yml pull
docker compose -f docker-compose.yml -f docker-compose.ghcr.yml up -d
```

完整的端口、HTTPS、更新和回滚说明见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。主分支由 [.github/workflows/container.yml](.github/workflows/container.yml) 发布 `ghcr.io/gx404/gx404-home`。

## 生产反向代理

容器只提供主站静态页面。需要绑定域名时，在自己的 Caddy、Nginx 或其他反向代理中把 HTTPS 流量转发到容器端口。仓库中的 `deploy/Caddyfile` 是 Gx404 现网路由示例，包含专用子站上游，不应原样复制到其他服务器。

摄影、会员、VPS 和互传继续作为独立子域名运行，不会被主站容器合并。

## 已验证

- 桌面端和 390 × 844、320 × 640 手机布局通过。
- 点击、拖动背景和减少动态效果偏好通过。
- `app.js` 与 `dist/vendor/fluid.js` 通过语法检查。
- 容器首页返回 `Gx404-首页`，`/healthz` 返回 `ok`。
