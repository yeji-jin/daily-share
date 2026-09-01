# daily-share

Share your daily moments with a modern social platform.

자유롭게 데일리 피드를 올리는 플랫폼

## Live Demo

[https://daily-share-gilt.vercel.app](https://daily-share-gilt.vercel.app)

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (Auth, Database)
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix 기반)
- **State**: Zustand
- **Data Fetching**: TanStack Query (react-query)
- **Forms**: React Hook Form + Zod
- **Date**: date-fns (상대 시간 표시 등)
- **Theme**: next-themes (다크/라이트 모드)
- **Icons**: lucide-react
- **Toast**: Sonner

## Folder Structure

```
daily-share/
├── app/                # Next.js App Router (페이지, 레이아웃, 라우트 핸들러)
│   ├── (guest)/        # 비로그인 상태에서만 접근 가능한 라우트 그룹
│   ├── (auth)/         # 로그인 상태에서만 접근 가능한 라우트 그룹
│   └── auth/           # Supabase 인증 콜백 라우트
│
├── components/         # UI 컴포넌트
│   ├── comment/        # 댓글 관련 컴포넌트
│   ├── layout/         # 헤더 등 전역 레이아웃 컴포넌트
│   ├── modal/          # 모달 컴포넌트
│   ├── post/           # 게시글 관련 컴포넌트
│   ├── profile/        # 프로필 관련 컴포넌트
│   └── ui/             # shadcn/ui 컴포넌트
│
├── hooks/              # 커스텀 훅
│   ├── mutations/      # 도메인별(auth/, comment/, post/, profile/) TanStack Query mutation 훅
│   ├── queries/        # TanStack Query query 훅
│   └── (그 외)          # react-query와 무관한 범용 UI 동작 훅 (예: use-unsaved-changes-guard)
│
├── lib/                # 공용 유틸 + Supabase 관련 모듈
│   ├── services/       # 도메인별 Supabase 데이터 접근 함수
│   └── supabase/       # 브라우저/서버 Supabase 클라이언트 설정
│
├── providers/          # 전역 Provider (테마, 세션, 쿼리, 모달)
├── stores/             # Zustand 스토어
├── types/              # 공용 타입 + Supabase 자동생성 타입
├── middleware.ts       # 세션 쿠키 갱신 + 라우트 가드
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
