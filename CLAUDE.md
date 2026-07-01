# Portainer 社区版

开源容器管理平台，完整支持 Docker 和 Kubernetes。

另见：

- docs/guidelines/server-architecture.md
- docs/guidelines/go-conventions.md
- docs/guidelines/typescript-conventions.md

## 包管理器

- **PNPM** 10+（前端）
- **Go** 1.25.8（后端）

## 构建命令

```bash
# 完整构建
make build              # 构建客户端和服务端
make build-client       # 构建 React/AngularJS 前端
make build-server       # 构建 Go 二进制
make build-image        # 构建 Docker 镜像

# 开发模式
make dev                # 同时运行前后端开发模式
make dev-client         # 启动 webpack-dev-server（端口 8999）
make dev-server         # 启动容器化 Go 服务

# 前端
pnpm dev            # Webpack 开发服务器
pnpm build          # 使用 webpack 构建前端
pnpm typecheck      # 运行前端类型检查（tsc）
pnpm lint           # 前端代码检查（eslint）
pnpm test           # 前端测试（vitest）
pnpm format         # 前端代码格式化（prettier）

# 测试
make test               # 全部测试（后端 + 前端）
make test-server        # 后端测试
make lint               # 全部代码检查
make format             # 代码格式化
```

## 开发服务器地址

- 前端：http://localhost:8999
- 后端：http://localhost:9000（HTTP）/ https://localhost:9443（HTTPS）
