# Implementation Plan - Twitter Image Combiner Extension

## 1. 目标
创建一个 Chrome 扩展，在 Twitter/X 网页版运行。
功能：在每条推文下添加一个按钮，点击后将该推文包含的所有图片（排除引用推文中的图片）按顺序垂直拼接成一张长图并下载。

## 2. 技术架构
- **Manifest V3**: 符合 Chrome 扩展最新标准。
- **纯原生 JavaScript/CSS**: 遵循 KISS 原则，不引入复杂框架。
- **Content Script**: 负责 DOM 操作、按钮注入、图片抓取与 Canvas 绘图。

## 3. 详细步骤

### 阶段 1: 基础设置 (Foundation)
- 创建 `manifest.json`。
  - 权限: `activeTab`, `scripting` (备用), `host_permissions` (`*://*.twitter.com/*`, `*://*.x.com/*`, `*://pbs.twimg.com/*`).
- 创建空白的 `content.js` 和 `style.css`。
- 准备图标文件 (icon16/48/128).

### 阶段 2: 核心逻辑 - 按钮注入 (Button Injection)
- 分析 Twitter DOM 结构，找到推文容器 (`article`) 和操作栏 (`[role="group"]`).
- 使用 `MutationObserver` 监听 DOM 变化，确保动态加载的推文也能被处理。
- 编写注入函数，在操作栏末尾添加自定义图标按钮 "拼接图片"。
- 确保按钮样式融入 Twitter 原生 UI (使用 SVG 图标)。

### 阶段 3: 核心逻辑 - 图片提取与过滤 (Image Extraction)
- 在点击事件中，获取当前推文的上下文。
- 查找推文内的图片 (`img[src*="pbs.twimg.com/media"]`).
- **关键过滤**: 排除引用推文内的图片。
  - 检查图片元素的祖先是否包含表示引用的容器 (通常可通过 DOM 层级或特定 class/aria 属性判断)。
- 解析图片 URL，获取最高质量版本 (通常将 `name=small` 改为 `name=large` 或 `name=orig`)。

### 阶段 4: 图片处理与下载 (Processing & Download)
- 使用 `fetch` 获取图片 Blob (利用 Host Permissions 解决 CORS)。
- 使用 `createImageBitmap` 或 `new Image()` 加载图片数据。
- 创建一个 `canvas` 元素。
- 计算总高度 = 所有图片高度之和。宽度 = 取最大宽度。
- 将图片从上到下绘制到 Canvas 上。
- 导出为 Blob/DataURL。
- 创建临时 `<a>` 标签触发下载。

### 阶段 5: 测试与优化 (Polish)
- 测试推文类型：单图、多图 (2/3/4张)、仅文字、包含引用推文、包含 GIF/视频 (应忽略或提示)。
- 优化 UI 反馈 (点击时的加载状态)。

## 4. 任务清单 (Task List)

- [ ] 初始化项目结构 (manifest.json, icons)
- [ ] 编写 content.js - DOM 监听与按钮注入
- [ ] 编写 content.js - 图片提取 (排除引用)
- [ ] 编写 content.js - Canvas 绘图与下载逻辑
- [ ] 编写 style.css - 按钮样式
- [ ] 手动测试验证

## 5. 思考点 (Thoughts)
- **选择器稳定性**: Twitter 使用混淆类名 (Atomic CSS)，应尽量依赖 `data-testid` (如 `data-testid="tweet"`, `data-testid="tweetPhoto"`) 或 ARIA 属性 (`role="group"`).
- **CORS**: 必须配置 `pbs.twimg.com` 的权限，否则 Canvas 导出 (`toDataURL`/`toBlob`) 会报错 "Tainted canvas"。
- **用户体验**: 按钮点击后应该有个简单的 loading 指示，防止用户重复点击。
