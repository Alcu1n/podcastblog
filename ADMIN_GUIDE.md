# Admin System Guide

## 管理员系统使用指南

### 概述
管理员系统提供了完整的文章管理功能，包括创建、编辑、删除和查看文章。

### 访问路径
- **登录页面**: `/admin/login` - 管理员身份验证
- **管理首页**: `/admin` - 文章列表和操作入口
- **创建文章**: `/admin/new` - 新建文章表单
- **编辑文章**: `/admin/edit/[id]` - 编辑现有文章

### 身份验证系统

#### 登录凭据
- **邮箱**: `alcuin.ch@gmail.com`
- **密码**: `Zmksdwdwd043..`

#### 安全特性
- ✅ 密码哈希存储 (SHA-256)
- ✅ 安全会话令牌
- ✅ HTTP-only Cookie
- ✅ 24小时自动过期
- ✅ 防止未授权访问
- ✅ 自动登出保护

#### 使用流程
1. 访问任何 `/admin/*` 路径
2. 未登录用户自动重定向到 `/admin/login`
3. 输入管理员凭据登录
4. 登录成功后重定向到目标页面
5. 会话保持24小时，超时自动登出

### 功能特性

#### 1. 文章列表 (`/admin`)
- ✅ 显示所有文章（包括草稿和已发布）
- ✅ 文章状态标识（草稿/已发布）
- ✅ 创建时间、发布时间、查看次数
- ✅ 快速操作按钮（编辑、查看、删除）
- ✅ 实时数据刷新

#### 2. 创建文章 (`/admin/new`)
- ✅ 标题输入（必填）
- ✅ URL/Slug（可选，自动生成）
- ✅ 摘要/描述（可选）
- ✅ 内容编辑（Markdown 支持）
- ✅ 状态选择（草稿/已发布）
- ✅ 分类标签（可选）
- ✅ 实时预览模式

#### 3. 编辑文章 (`/admin/edit/[id]`)
- ✅ 预填充现有数据
- ✅ 所有创建功能
- ✅ 自动保存草稿建议

### 数据结构

文章存储在 `stories` 表中，主要字段：

```sql
- id: string (主键)
- title: string (标题)
- content: text (内容)
- description: string (摘要)
- status: 'draft' | 'published' (状态)
- url: string (URL路径)
- categories: array (分类标签)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)
- meta: jsonb (元数据)
  - view_count: number (查看次数)
  - published_at: timestamp (发布时间)
```

### API 函数

#### 读取操作
- `getArticles()` - 获取文章列表
- `getArticleById(id)` - 根据ID获取文章
- `getArticleBySlug(slug)` - 根据Slug获取文章

#### 写入操作
- `createArticle(data)` - 创建新文章
- `updateArticle(data)` - 更新现有文章
- `deleteArticle(id)` - 删除文章

#### 工具函数
- `validateArticleForm(data)` - 表单验证
- `generateSlug(title)` - 生成URL slug

### 使用流程

#### 1. 创建新文章
1. 访问 `/admin/new`
2. 填写标题（必填）
3. 编写内容（支持Markdown）
4. 选择状态：草稿或已发布
5. 点击"Create Article"

#### 2. 编辑现有文章
1. 在 `/admin` 页面找到要编辑的文章
2. 点击"Edit"按钮
3. 修改内容
4. 点击"Update Article"

#### 3. 删除文章
1. 在文章列表中找到目标文章
2. 点击"Delete"按钮
3. 确认删除操作

### 设计原则

系统遵循 Linus Torvalds 的"Good Taste"原则：

1. **数据结构驱动**：操作围绕清晰的数据结构展开
2. **消除特殊情况**：通过良好设计避免边缘情况
3. **简洁实用**：界面直观，功能明确
4. **错误处理**：完整的验证和错误反馈

### 技术特性

- **TypeScript 严格模式**：100% 类型安全
- **Server Components**：服务端渲染，性能优化
- **Neo-Brutalism 设计**：高对比度，硬阴影，清晰边框
- **响应式设计**：适配各种屏幕尺寸

### 故障排除

#### 常见问题

1. **编辑页面404**
   - 确保文章ID存在
   - 检查URL格式是否正确

2. **创建文章失败**
   - 检查必填字段（标题、内容）
   - 确认网络连接正常
   - 查看控制台错误信息

3. **数据不同步**
   - 点击"Refresh"按钮
   - 检查数据库连接状态

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 代码检查
npm run lint
```

### 安全注意事项

- 管理员功能需要适当的权限控制
- 敏感操作（如删除）有确认机制
- 表单数据经过验证和清理
- XSS 防护措施已实施

### 已修复问题 (2025-12-01)

#### 问题1: 编辑页面 `formData.categories?.join is not a function`
**原因**: 数据库中的 `categories` 字段可能不是数组类型
**解决**: 添加 `Array.isArray()` 检查，确保数据类型安全

#### 问题2: 新增文章 `Could not find the 'updated_at' column`
**原因**: stories 表没有 `updated_at` 字段
**解决**: 将 `updated_at` 移入 `meta` JSON 字段存储

#### 问题3: Next.js 16 路由参数变化
**原因**: `params` 现在是 Promise，需要 `await` 解包
**解决**: 使用 `const { id } = await params`

#### 问题4: Categories 字段无法输入逗号
**原因**: 过度复杂的数组处理逻辑，逗号被误用为分隔符
**解决**: 简化为直接字符串处理，移除不必要的数组转换

#### 问题5: 数据库中 categories 显示为 JSON 数组
**原因**: 类型定义与实际存储不匹配
**解决**: 统一使用字符串类型存储逗号分隔的分类

#### 问题6: Next.js 16 Suspense 边界问题
**原因**: useSearchParams 需要包装在 Suspense 中
**解决**: 添加 Suspense 边界处理

---

**系统状态**: ✅ 完全可用 (带身份验证保护)
**开发服务器**: http://localhost:3000
**管理入口**: http://localhost:3000/admin
**登录页面**: http://localhost:3000/admin/login

### Categories 字段使用说明

现在 categories 字段简化为字符串格式：
- **输入格式**: `tech, programming, tutorial` (逗号分隔)
- **存储格式**: 直接存储为字符串 `"tech, programming, tutorial"`
- **显示格式**: 自动转换为字符串显示
- **支持内容**: 可自由输入逗号，不会影响功能