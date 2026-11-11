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

从 GitHub Container Registry 直接拉取中文版镜像（无需登录，公开可拉；amd64 / arm64 多架构，自动匹配主机架构）：

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
| `ghcr.io/mlyu8888/portainer-cn:2.39.3` | 中文版 2.39.3（**amd64 / arm64 多架构**，`docker pull` 时自动匹配主机架构） |
| `ghcr.io/mlyu8888/portainer-cn:2.39.3-amd64` | 仅 amd64 |
| `ghcr.io/mlyu8888/portainer-cn:2.39.3-arm64` | 仅 arm64 |

- 包地址：https://github.com/users/mlyu8888/packages/container/package/portainer-cn
- 可见性：Public，支持匿名拉取

## 版本与上游

- 当前版本：**Portainer CE 2.39.3** 中文版
- 上游仓库：https://github.com/portainer/portainer

## 许可

本项目基于 zlib 许可证，详见 [LICENSE](./LICENSE)。

Portainer 还包含来自开源项目的代码，详见 [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)。
