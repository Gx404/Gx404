# Gx404 主站部署

主站是一个不需要后端、数据库或构建步骤的静态导航页。`dist/` 是完整的运行时文件，容器只负责通过 Nginx 提供这些文件。

## 本地或自有服务器构建

要求 Docker 24 或更新版本，以及 Docker Compose v2：

```sh
git clone https://github.com/Gx404/light.git gx404-home
cd gx404-home
docker compose up -d --build
```

打开 `http://localhost:8080/`。如果 8080 已被占用，可以指定端口：

```sh
PORT=9090 docker compose up -d --build
```

检查容器状态和健康接口：

```sh
docker compose ps
curl http://localhost:8080/healthz
```

健康接口应返回 `ok`。查看日志：

```sh
docker compose logs -f gx404-home
```

## 使用 GHCR 预构建镜像

主分支会由 GitHub Actions 发布到 GHCR。镜像默认是公开读取的；如果仓库设置为私有，先登录 GHCR：

```sh
echo "$CR_PAT" | docker login ghcr.io -u YOUR_GITHUB_NAME --password-stdin
```

使用仓库内的 GHCR Compose 文件启动：

```sh
docker compose -f docker-compose.yml -f docker-compose.ghcr.yml up -d
```

更新到最新主分支镜像：

```sh
docker compose -f docker-compose.yml -f docker-compose.ghcr.yml pull
docker compose -f docker-compose.yml -f docker-compose.ghcr.yml up -d
```

生产环境建议改用固定 SHA 标签，而不是长期使用 `latest`：

```sh
docker pull ghcr.io/gx404/gx404-home:sha-<commit>
```

回滚时把 `docker-compose.ghcr.yml` 中的镜像标签改为上一版 SHA，再执行 `up -d`。

## 绑定域名和 HTTPS

容器只监听本机端口，外部 HTTPS 由已有反向代理负责。Caddy 示例：

```caddyfile
gx404.example.com {
    encode gzip
    reverse_proxy 127.0.0.1:8080
}
```

把 `gx404.example.com` 换成自己的域名，并确保 DNS 指向服务器。不要把本仓库的生产专用 `deploy/Caddyfile` 原样复制到其他服务器；其中包含 Gx404 现网子站的专用上游地址。

## 修改页面

常用配置在 `dist/site.config.js`。修改后同步检查 `dist/index.html` 的无 JavaScript 入口，然后重新构建：

```sh
docker compose build --no-cache
docker compose up -d
```

页面不保存用户数据，也不需要数据库迁移。摄影、会员、VPS 和互传仍是独立子域名，不会被这个容器合并。

## 直接静态部署

如果不使用 Docker，也可以把 `dist/` 的全部内容上传到任何静态 Web 服务器。需要支持 HTTPS，并确保未知路径回退到 `index.html`；`/healthz` 不是静态部署的必需项。

