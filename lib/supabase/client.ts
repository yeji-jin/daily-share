import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

// 브라우저 클라이언트는 요청 단위로 달라질 게 없어서 싱글톤으로 공유해서 씀
export const supabase = createClient();