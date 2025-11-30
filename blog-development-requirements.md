# Neo-Brutalism Blog 开发需求文档

## 项目概述

### 核心理念
**极简主义 × Neo-Brutalism × 高级美感**

设计一个遵循Linus Torvalds"Good Taste"原则的blog系统：数据结构驱动设计，消除特殊情况，追求代码简洁与架构优雅。

### 技术栈
- **Frontend**: Next.js
- **UI Library**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (现有数据库 + API + Keys)
- **Styling**: Tailwind CSS with Neo-Brutalism design tokens
- **TypeScript**: 5.0+ (严格模式)

## 核心功能需求

### 1. 文章展示系统
```
功能层级：
├── 文章列表页 (首页)
│   ├── 传统列表式展示 (标题 + 简介 + 时间 + 分类)
│   ├── 分页加载
│   └── 简单筛选
├── 文章详情页
│   ├── Markdown渲染
│   ├── 代码高亮
│   └── 阅读时间估算
└── 文章搜索
    ├── 标题搜索
    └── 内容搜索
```

### 2. 数据模型设计 (Supabase - 现有数据库)
**注意：基于现有Supabase数据库，只需要读取和前端展示**

```typescript
// 基于现有数据库结构的TypeScript接口定义
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  view_count?: number;
  // 根据实际数据库字段调整
}

// Supabase客户端配置
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 文章查询示例
async function getArticles(page = 1, limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data;
}
```

**现有数据库集成：**
- 使用现有的Supabase URL和API Keys
- 读取现有文章数据和字段结构
- 无需创建新的数据库表

## Neo-Brutalism UI设计系统

### 核心设计原则
1. **高对比度冲突**: 黑白为主的强对比
2. **厚重边框**: 4-8px solid borders
3. **硬阴影**: Sharp, hard shadows (no blur)
4. **几何形状**: 方形、圆形基础几何
5. **原色大胆**: 纯色块，拒绝渐变

### 设计Tokens
```css
:root {
  /* Neo-Brutalism Color Palette */
  --primary-black: #000000;
  --primary-white: #FFFFFF;
  --accent-red: #FF0000;
  --accent-blue: #0000FF;
  --accent-yellow: #FFFF00;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-800: #1F2937;

  /* Border System */
  --border-thin: 2px;
  --border-medium: 4px;
  --border-thick: 8px;

  /* Shadow System */
  --shadow-hard: 4px 4px 0px rgba(0,0,0,1);
  --shadow-hard-large: 8px 8px 0px rgba(0,0,0,1);

  /* Typography */
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
}
```

### 组件设计规范

#### 1. 文章列表组件 (传统列表式)
```typescript
// ArticleList.tsx
interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
}

// ArticleListItem.tsx
interface ArticleListItemProps {
  article: Article;
}

// Neo-Brutalism特征：
// - 每个列表项使用左边框强调
// - 标题使用等宽字体
// - 时间戳使用小号字体
// - Hover状态使用hard shadow
// - 极简设计，无冗余装饰
```

#### 2. 按钮系统
```typescript
// Button variants:
// - Primary: 黑底白字，白框
// - Secondary: 白底黑字，黑框
// - Accent: 红底白字，黑框
// - 全部使用hard shadow
// - Hover状态：translate(2px, 2px)
```

#### 3. 排版系统
```typescript
// Typography hierarchy:
// - H1: 4rem, font-mono, font-weight 900
// - H2: 3rem, font-mono, font-weight 800
// - H3: 2rem, font-mono, font-weight 700
// - Body: 1rem, font-sans, font-weight 400
// - 全部使用letter-spacing tracking-wide
```

## 页面布局设计

### 1. 整体布局结构
```
App Layout:
├── Header (固定顶部)
│   ├── Logo (Neo-Brutalism风格)
│   └── Navigation (简约导航)
├── Main Content
│   ├── 文章列表区域
│   │   ├── 搜索栏 (可选)
│   │   ├── 文章列表项
│   │   └── 分页导航
│   └── 文章详情区域
│       ├── 文章标题
│       ├── 文章元信息
│       └── 文章内容
└── Footer
    ├── Social Links
    └── Copyright
```

### 2. 响应式设计
```css
/* Mobile First Approach */
/*
- Mobile: < 768px (单列列表布局)
- Tablet: 768px - 1024px (单列列表，更大间距)
- Desktop: > 1024px (单列列表，最大宽度限制)
- 传统列表式布局在所有设备上保持一致性
- 保持Neo-Brutalism风格在所有设备上的一致性
*/
```

## 性能优化策略

### 1. 代码分割 (Next.js 15 特性)
```typescript
// Next.js 15 动态导入
const ArticleListItem = dynamic(() => import('@/components/ArticleListItem'), {
  loading: () => <ArticleListItemSkeleton />
});

const ArticleDetail = dynamic(() => import('@/components/ArticleDetail'), {
  loading: () => <ArticleDetailSkeleton />
});

// React 19 + Next.js 15 Server Components
// 大部分组件使用Server Components，减少bundle大小
// 仅客户端交互组件使用'use client'
```

### 2. 图片优化
```typescript
// Next.js Image组件 + Supabase Storage
import Image from 'next/image';

// 配置：
// - WebP格式
// - 响应式尺寸
// - Lazy loading
// - Neo-Brutalism风格图片处理
```

### 3. 数据获取策略 (Next.js 15 + Supabase)
```typescript
// Server Components - 直接在服务端获取数据
async function getArticles(page = 1, limit = 10) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data;
}

// ISR (Incremental Static Regeneration)
export const revalidate = 300; // 5 minutes

// 客户端数据获取 (如需要实时更新)
'use client';
import { useQuery } from '@tanstack/react-query';

const { data: articles, isLoading } = useQuery({
  queryKey: ['articles'],
  queryFn: () => fetch('/api/articles').then(res => res.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## 开发阶段规划

### Phase 1: 核心架构搭建 (2-3天)
- [ ] Next.js 15 项目初始化 (React 19 + App Router)
- [ ] Tailwind + shadcn/ui 配置
- [ ] Supabase 客户端配置 (现有数据库连接)
- [ ] 基础 Layout 组件 (Server Components)

### Phase 2: UI组件开发 (3-4天)
- [ ] Neo-Brutalism 设计系统实现
- [ ] 核心组件开发 (Button, Typography, List组件)
- [ ] 文章列表页面 (传统列表式)
- [ ] 文章详情页面 (Markdown渲染)

### Phase 3: 数据集成 (2-3天)
- [ ] Supabase 数据获取 (现有数据库读取)
- [ ] 文章列表 API 集成
- [ ] 文章详情页数据获取
- [ ] 响应式适配

### Phase 4: 优化与部署 (1-2天)
- [ ] 性能优化 (Next.js 15 特性)
- [ ] SEO 优化
- [ ] 部署配置 (Vercel)
- [ ] 测试与 bug 修复

## 代码质量标准

### 1. TypeScript严格模式
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. ESLint + Prettier配置
```json
// 遵循"Good Taste"原则：
// - 函数长度 < 20行
// - 圈复杂度 < 10
// - 代码重复率 < 3%
// - 100% TypeScript覆盖
```

### 3. 组件设计原则
```typescript
// 单一职责原则
interface ComponentProps {
  // Props必须明确类型，避免any
  // 必需props在前，可选props在后
  // 使用联合类型替代boolean flags
}

// 组件组合优于继承
// 使用compound pattern处理复杂组件
```

## 部署与运维

### 1. 部署环境
- **Production**: Vercel (推荐)
- **Staging**: Vercel Preview
- **Database**: Supabase Cloud

### 2. 环境变量配置
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. SEO优化
```typescript
// Metadata API
export const metadata: Metadata = {
  title: 'Neo-Brutalism Blog',
  description: 'A minimalist blog with Neo-Brutalism design',
  openGraph: {
    title: 'Neo-Brutalism Blog',
    description: 'A minimalist blog with Neo-Brutalism design',
    images: ['/og-image.png'],
  },
};
```

## 成功指标

### 1. 性能指标
- **Lighthouse Score**: > 90 (所有类别)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

### 2. 代码质量指标
- **TypeScript Coverage**: 100%
- **ESLint**: 0 errors, 0 warnings
- **Bundle Size**: < 200KB (gzipped)
- **Component Reusability**: > 80%

### 3. 用户体验指标
- **Mobile Responsiveness**: 100%覆盖
- **Accessibility**: WCAG 2.1 AA标准
- **Loading States**: 所有异步操作
- **Error Boundaries**: 优雅降级

---

**记住：好的代码是简洁的代码，好的设计是实用的设计。**
*遵循Linus Torvalds的"Good Taste"原则，用数据结构驱动设计，消除特殊情况，追求架构的优雅性。*
