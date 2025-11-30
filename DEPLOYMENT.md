# Neo-Brutalism Blog 部署指南

## 项目概述

这是一个基于 Next.js 16、React 19 的 Neo-Brutalism 风格博客系统，支持 Supabase 数据集成。

## 部署到 Vercel

### 前置条件

1. Vercel 账号
2. Supabase 项目 (可选，如果不配置将使用模拟数据)
3. Git 仓库

### 部署步骤

#### 1. 连接 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: Neo-Brutalism blog"
git remote add origin <your-repository-url>
git push -u origin main
```

#### 2. 在 Vercel 中创建项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. Vercel 会自动检测为 Next.js 项目

#### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# 必需的 Supabase 配置 (如果不使用 Supabase，可以跳过)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 可选的站点配置
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME="Your Blog Name"
```

#### 4. 部署配置

Vercel 会自动使用以下配置：

- **构建命令**: `npm run build`
- **输出目录**: `.next`
- **Node.js 版本**: 18.x
- **区域**: sin1 (新加坡)

### 性能优化特性

#### ISR (Incremental Static Regeneration)

- **首页**: 每 5 分钟重新生成
- **文章页**: 每 1 小时重新生成

#### 图片优化

- 支持 WebP/AVIF 格式
- 自动响应式图片
- 懒加载支持

#### Bundle 优化

- 动态导入大型依赖
- 树摇优化
- 压缩和 minification

### Supabase 数据库设置

如果使用 Supabase，需要创建以下表结构：

```sql
-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
```

### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 配置 DNS 记录 (Vercel 会提供)
4. 等待 SSL 证书生成

### 监控和分析

Vercel 提供以下内置功能：

- **Analytics**: 页面访问量、性能指标
- **Speed Insights**: Core Web Vitals
- **Logs**: 错误和访问日志
- **Error Tracking**: 错误监控和报告

### 故障排除

#### 构建失败

1. 检查环境变量是否正确配置
2. 确认依赖版本兼容性
3. 查看 Vercel 构建日志

#### 性能问题

1. 检查 Lighthouse 分数
2. 优化图片和静态资源
3. 使用 Vercel Analytics 分析瓶颈

#### Supabase 连接问题

1. 验证环境变量
2. 检查 Supabase 项目设置
3. 确认 RLS (Row Level Security) 策略

### 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量模板
cp .env.example .env.local

# 启动开发服务器
npm run dev

# 构建测试
npm run build

# 启动生产服务器
npm run start
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: React 19 Server Components
- **样式**: Tailwind CSS v4 + 自定义 Neo-Brutalism 设计系统
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel
- **类型检查**: TypeScript 5 (严格模式)

## 设计原则

- **数据结构驱动设计**: 优先操作数据结构而非控制流
- **消除特殊情况**: 通过更好的设计减少边缘情况
- **极简主义**: 简洁、实用、可维护的代码
- **Neo-Brutalism**: 高对比度、厚边框、硬阴影的视觉风格