# daily-share

Share your daily moments with a modern social platform.

자유롭게 데일리 피드를 올리는 플랫폼

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix 기반)
- **State**: Zustand
- **Data Fetching**: TanStack Query (react-query)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes (다크/라이트 모드)
- **Icons**: lucide-react
- **Toast**: Sonner

## Folder Structure

```
daily-share/
├── app/
│   ├── (auth)/                 # 인증 관련 라우트 그룹 (레이아웃 분리)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── post/[id]/               # 게시글 상세 (/post/{id})
│   ├── user/[id]/                # 사용자 프로필 (/user/{id})
│   ├── settings/                 # 설정 (/settings)
│   ├── search/                   # 검색 (/search)
│   ├── page.tsx                  # 홈 피드 (/)
│   ├── layout.tsx                # 루트 레이아웃 (Header, Provider 연결)
│   ├── not-found.tsx             # 404 페이지
│   ├── robots.ts                 # robots.txt 생성
│   ├── sitemap.ts                # sitemap.xml 생성
│   └── globals.css
│
├── components/
│   ├── layout/                   # 헤더, 테마 토글 등 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   └── theme-toggle.tsx
│   └── ui/                       # shadcn/ui 컴포넌트
│
├── lib/
│   ├── site.ts                   # 사이트 메타 정보 (이름/설명/URL)
│   └── utils.ts
│
├── providers/
│   ├── query-provider.tsx        # TanStack Query Provider
│   └── theme-provider.tsx        # next-themes Provider
│
└── public/
```

## Getting Started

```bash
npm install
npm run dev
```