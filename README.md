# daily-share

Share your daily moments with a modern social platform.

자유롭게 데일리 피드를 올리는 플랫폼

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (Auth, Database)
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
│   ├── (auth)/                    # 인증 관련 라우트 그룹 (레이아웃 분리, 헤더 없음)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/                # React Hook Form + Zod 연동 예시
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── post/[id]/                 # 게시글 상세 (/post/{id})
│   ├── user/[id]/                 # 사용자 프로필 (/user/{id})
│   ├── settings/                  # 설정 (/settings)
│   ├── search/                    # 검색 (/search)
│   ├── page.tsx                   # 홈 피드 (/)
│   ├── layout.tsx                 # 루트 레이아웃 (Header, Provider 연결)
│   ├── not-found.tsx              # 404 페이지
│   ├── robots.ts                  # robots.txt 생성
│   ├── sitemap.ts                 # sitemap.xml 생성
│   └── globals.css
│
├── components/
│   ├── layout/                    # 헤더, 테마 토글 등 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   └── theme-toggle.tsx
│   └── ui/                        # shadcn/ui 컴포넌트
│
├── hooks/
│   └── mutations/                 # TanStack Query mutation 훅
│       └── use-sign-up.ts
│
├── lib/
│   ├── auth.ts                    # Supabase Auth 관련 함수 (signUp 등)
│   ├── site.ts                    # 사이트 메타 정보 (이름/설명/URL)
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts              # 브라우저용 Supabase 클라이언트
│       └── server.ts              # 서버용 Supabase 클라이언트
│
├── providers/
│   ├── query-provider.tsx         # TanStack Query Provider
│   └── theme-provider.tsx         # next-themes Provider
│
├── types/
│   ├── database.types.ts          # Supabase 자동생성 타입 (직접 수정 X, `npm run type-gen`으로 갱신)
│   ├── auth.ts                    # 인증 관련 zod 스키마 + 타입
│   └── post.ts                    # Post 도메인 타입
│
└── public/
```

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

`.env.local`에 아래 값이 필요합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | 개발 서버 실행                   |
| `npm run build`        | 프로덕션 빌드                    |
| `npm run start`        | 프로덕션 서버 실행               |
| `npm run lint`         | ESLint 검사                      |
| `npm run format`       | Prettier로 전체 포맷팅           |
| `npm run format:check` | 포맷팅 여부만 확인 (수정 X)      |
| `npm run type-gen`     | Supabase 스키마 기반 타입 재생성 |
