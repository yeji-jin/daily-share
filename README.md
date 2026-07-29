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
├── middleware.ts                  # 세션 쿠키 갱신 + 라우트 가드 (로그인/비로그인 접근 제어)
│
├── app/
│   ├── (guest)/                   # 비로그인 상태에서만 접근 가능
│   │   ├── layout.tsx
│   │   ├── signin/                # 이메일/비밀번호 + GitHub OAuth 로그인, ?reset=success 안내 토스트
│   │   ├── signup/                # React Hook Form + Zod 연동 예시
│   │   └── forgot-password/       # 비밀번호 재설정 이메일 요청
│   ├── (auth)/                    # 로그인 상태에서만 접근 가능
│   │   ├── page.tsx               # 홈 피드 (/)
│   │   ├── post/[id]/             # 게시글 상세 (/post/{id})
│   │   ├── profile/[id]/          # 사용자 프로필 (/profile/{id})
│   │   ├── settings/              # 설정 (/settings)
│   │   └── reset-password/        # 비밀번호 재설정 (재설정 링크로 인증된 세션에서 접근)
│   ├── auth/
│   │   └── confirm/route.ts       # Supabase 재설정 링크의 code를 세션으로 교환하는 콜백
│   ├── layout.tsx                 # 루트 레이아웃 (서버에서 getUser() 조회, Header/Provider 연결)
│   ├── not-found.tsx              # 404 페이지
│   ├── robots.ts                  # robots.txt 생성
│   ├── sitemap.ts                 # sitemap.xml 생성
│   └── globals.css
│
├── components/
│   ├── layout/                    # 헤더, 테마 토글 등 레이아웃 컴포넌트
│   │   ├── header.tsx             # 서버에서 받은 session prop으로 로그인/비로그인 UI 분기
│   │   └── theme-toggle.tsx
│   └── ui/                        # shadcn/ui 컴포넌트
│
├── hooks/
│   └── mutations/                 # TanStack Query mutation 훅
│       ├── use-sign-in.ts
│       ├── use-sign-in-with-oauth.ts
│       ├── use-sign-up.ts
│       ├── use-request-password-reset-email.ts
│       └── use-update-password.ts
│
├── lib/
│   ├── auth.ts                    # Supabase Auth 함수 (signUp, signInWithPassword, signInWithOAuth,
│   │                               #   requestPasswordResetEmail, updatePassword, signOut)
│   ├── error.ts                   # 에러 메시지 매핑 + showErrorToast 헬퍼
│   ├── site.ts                    # 사이트 메타 정보 (이름/설명/URL)
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts              # 브라우저용 Supabase 클라이언트
│       ├── server.ts              # 서버용 Supabase 클라이언트
│       └── middleware.ts          # 세션 쿠키 갱신 + 라우트 가드 로직 (middleware.ts에서 사용)
│
├── providers/
│   ├── query-provider.tsx         # TanStack Query Provider
│   ├── theme-provider.tsx         # next-themes Provider
│   └── SessionProvider.tsx        # 서버에서 받은 초기 user를 zustand 스토어에 시드 + 실시간 구독
│
├── stores/
│   └── session.ts                 # 유저 zustand 스토어 (useUser, useIsUserLoaded, useSetUser)
│
├── types/
│   ├── database.types.ts          # Supabase 자동생성 타입 (직접 수정 X, `npm run type-gen`으로 갱신)
│   ├── auth.ts                    # 인증 관련 zod 스키마 + 타입 (emailSchema, passwordSchema,
│   │                               #   signUpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema)
│   ├── mutations.ts               # 공용 mutation 콜백(onSuccess/onError 등) 타입
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
