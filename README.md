<p align="center">
  <img title="portainer" src='https://github.com/portainer/portainer/blob/develop/app/assets/images/portainer-github-banner.png?raw=true' />
</p>

# Portainer CE 中文版

> 本仓库基于 [Portainer CE 2.39.3](https://github.com/portainer/portainer/releases/tag/2.39.3) 官方源码二次开发，提供完整的中文界面。**非官方项目**，与 Portainer 官方无关联。

**Portainer 社区版** 是一个轻量级的容器化应用服务交付平台，可用于管理 Docker、Swarm、Kubernetes 和 ACI 环境。它由单个容器组成，可通过"智能" GUI 和丰富的 API 管理所有编排器资源（容器、镜像、卷、网络等）。

## 与官方版本的差异

| 改动 | 说明 |
|------|------|
| **前端中文化** | 约 99% 界面汉化（730+ 文件），覆盖 Docker / Kubernetes / Edge / 设置 / 认证等全部模块，含 React 与 AngularJS 视图 |
| **镜像导出增强** | 镜像列表支持导出为 tar：文件按镜像名命名，支持多镜像合并导出 |
| **容器列表优化** | 端口映射同行显示、列宽优化 |
| **多架构构建** | `build/linux/Dockerfile` 支持 `ARG BASE_TAG` 参数化基础镜像，便于构建 amd64 / arm64 镜像 |

## 快速开始

从 GitHub Container Registry 直接拉取中文版镜像（无需登录，公开可拉）：

```bash
docker pull ghcr.io/mlyu8888/portainer-cn:2.39.3

docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  ghcr.io/mlyu8888/portainer-cn:2.39.3
```

访问 `https://localhost:9443` 即为中文界面。

## 镜像仓库

| 标签 | 说明 |
|------|------|
| `ghcr.io/mlyu8888/portainer-cn:2.39.3` | 中文版 2.39.3（amd64） |

- 包地址：https://github.com/users/mlyu8888/packages/container/package/portainer-cn
- 可见性：Public，支持匿名拉取
- 更多部署方式（Swarm / Kubernetes / 离线安装）见 [官方部署文档](https://docs.portainer.io/start/install-ce)

## 本地构建与发布

### 环境要求

- **pnpm** 10+（前端）
- **Go** 1.25.9（后端）
- **Docker**（构建镜像，建议 buildx）

### 1. 构建前端（必须为 production 产物）

```bash
NODE_ENV=production pnpm run build --config webpack/webpack.production.js
```

> ⚠️ 直接 `pnpm build` 默认生成 development 产物（`main.js` 约 86MB 且含 `eval-source-map`），会使镜像从约 140MB 膨胀到约 180MB。构建后验证：`du -sh dist/public` 应约为 46MB。

### 2. 编译后端二进制

```bash
GIT_COMMIT_HASH=unknown ./build/build_binary.sh linux amd64
# arm64 版本：
GIT_COMMIT_HASH=unknown ./build/build_binary.sh linux arm64
```

### 3. 构建 Docker 镜像（amd64）

```bash
docker buildx build --build-arg BASE_TAG=amd64 --load \
  -t ghcr.io/mlyu8888/portainer-cn:2.39.3 -f build/linux/Dockerfile .
```

### 4. 构建 Docker 镜像（arm64）

```bash
docker buildx build --platform linux/arm64 --build-arg BASE_TAG=arm64 --load \
  -t ghcr.io/mlyu8888/portainer-cn:2.39.3-arm64 -f build/linux/Dockerfile .
```

### 5. 推送到 GHCR

```bash
# 登录（需 GitHub PAT，勾选 write:packages 权限）
docker login ghcr.io -u <你的GitHub用户名>

docker push ghcr.io/mlyu8888/portainer-cn:2.39.3
docker push ghcr.io/mlyu8888/portainer-cn:2.39.3-arm64
```

## 二次开发

```bash
make build        # 完整构建（前端 + 后端）
make dev          # 开发模式（前端 :8999 / 后端 :9000）
pnpm typecheck    # 类型检查
pnpm lint         # 代码检查
pnpm test         # 前端测试
make test         # 全部测试
```

## 版本与上游

- 当前版本：**Portainer CE 2.39.3** 中文版
- 上游仓库：https://github.com/portainer/portainer
- 同步方式：关注上游 release，将变更 cherry-pick / 合并至本仓库

## 许可

本项目基于 zlib 许可证，详见 [LICENSE](./LICENSE)。

Portainer 还包含来自开源项目的代码，详见 [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)。
