# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Neo-Brutalism Blog System** - A minimalist blog built with Next.js 15, React 19, and Supabase, following Linus Torvalds' "Good Taste" principles.

### Core Philosophy
- **Data Structure Driven Design**: Manipulate data structures, not control flow
- **Eliminate Special Cases**: Use better data structures to remove edge cases
- **Pragmatic Minimalism**: Simple, readable, practical code
- **Good Taste**: Clean architecture that just works
- **Important Notice**: Always use the context7 mcp to get the latest official documentation when needed, such as the development documentation for Next.js version 15.

### Tech Stack
- **Frontend**: Next.js 15 (App Router + React 19 Server Components)
- **UI**: shadcn/ui + Tailwind CSS with Neo-Brutalism design system
- **Database**: Supabase (existing database - read-only for frontend)
- **Styling**: Neo-Brutalism design tokens (high contrast, thick borders, hard shadows)

## Development Commands

```bash
# Project Setup (when starting from scratch)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
npm install @supabase/supabase-js @tanstack/react-query @radix-ui/react-slot lucide-react
npm install class-variance-authority clsx tailwind-merge

# Development
npm run dev

# Build & Production
npm run build
npm run start

# Code Quality
npm run lint
npm run type-check
```

## Architecture Overview

### Project Structure (Planned)
```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with Neo-Brutalism theme
│   ├── page.tsx           # Homepage (article list)
│   ├── articles/[slug]/   # Dynamic article detail pages
│   └── globals.css        # Global styles + design tokens
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── blog/             # Blog-specific components
│   │   ├── article-list.tsx
│   │   ├── article-item.tsx
│   │   └── article-detail.tsx
│   └── layout/           # Layout components (header, footer)
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   ├── types.ts          # TypeScript type definitions
│   └── api.ts            # Data fetching functions
└── styles/
    └── neo-brutalism.css # Design system tokens
```

### Component Architecture Principles

1. **Server Components First**: Default to Server Components, only use 'use client' for interactivity
2. **Data Structure Driven**: Define TypeScript interfaces first, build components around data
3. **Single Responsibility**: Each component does one thing well
4. **Composition Over Inheritance**: Use component composition patterns

### Data Layer

```typescript
// Core Article interface (based on existing Supabase schema)
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
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### Neo-Brutalism Design System

#### Design Tokens
```css
:root {
  /* Core Colors */
  --primary-black: #000000;
  --primary-white: #FFFFFF;
  --accent-red: #FF0000;
  --accent-blue: #0000FF;
  --accent-yellow: #FFFF00;

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
}
```

#### Component Patterns
- **Buttons**: Hard shadows, hover:translate(2px, 2px), thick borders
- **Typography**: H1-H3 use font-mono with font-black, body uses font-sans
- **Lists**: Traditional list layout (title + excerpt + time), no card design
- **Borders**: Consistent 4px-8px borders with high contrast colors

### Performance Optimization

1. **ISR Strategy**: 5-minute revalidation for article lists
2. **Server Components**: Use Next.js 15 Server Components by default
3. **Image Optimization**: Use next/image with WebP/AVIF formats
4. **Code Splitting**: Dynamic imports for client-side components

### Code Quality Standards

- **TypeScript**: Strict mode enabled, 100% type coverage
- **Function Length**: Keep functions under 20 lines
- **Cyclomatic Complexity**: Keep complexity under 10
- **No Implicit Any**: All types must be explicitly defined

## Key Implementation Details

### Article Display System
- **Traditional List Layout**: Title + excerpt + timestamp (no cards)
- **Neo-Brutalism Styling**: Left border emphasis, hard shadows on hover
- **Typography Hierarchy**: Monospace fonts for headers, clean sans-serif for body

### Data Fetching Strategy
```typescript
// Server Components - direct Supabase calls
async function getArticles(page = 1, limit = 10) {
  const supabase = createClient();
  return await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
}
```

### Environment Configuration
```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=https://irxaduaqcbjfdvbiamwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Development Workflow

1. **Data Structures First**: Define TypeScript interfaces before components
2. **Server Components Default**: Only use client components when absolutely necessary
3. **Progressive Enhancement**: Start with basic functionality, add features incrementally
4. **Design System Consistency**: Always use defined design tokens and component patterns

## Deployment

- **Platform**: Vercel (recommended for Next.js 15)
- **Environment**: Production uses Supabase Cloud database
- **Performance Target**: Lighthouse score >90 across all categories
- **Bundle Size**: Keep under 200KB gzipped

---

**Remember**: Good code is data-driven, simple, and eliminates special cases through better design. Focus on clean architecture that just works.
