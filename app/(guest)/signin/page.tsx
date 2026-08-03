"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginValues } from "@/types/auth";
import { useSignIn } from "@/hooks/mutations/auth/use-sign-in";
import { useSignInWithOAuth } from "@/hooks/mutations/auth/use-sign-in-with-oauth";
import { showErrorToast } from "@/lib/error";

function ResetSuccessNotice() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      toast.info("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.", {
        id: "reset-success",
        position: "top-center",
      });
    }
  }, [searchParams]);

  return null;
}

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: signIn, isPending: isSignInWithPasswordPending } = useSignIn({
    onError: showErrorToast,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
  const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } = useSignInWithOAuth({
    onError: showErrorToast,
  });

  const isPending = isSignInWithOAuthPending || isSignInWithPasswordPending;

  const onSubmit = (values: LoginValues) => {
    signIn(values);
  };

  const hadleSignInWithOAuth = () => {
    signInWithOAuth("github");
  };

  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <ResetSuccessNotice />
      </Suspense>
      <h1 className="text-xl font-bold">로그인</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-4">
          <fieldset disabled={isPending} className="contents">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">이메일</FormLabel>
                  <FormControl>
                    <Input className="py-6" type="email" placeholder="abc@google.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">비밀번호</FormLabel>
                  <FormControl>
                    <Input className="py-6" type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full py-6" type="submit">
              로그인
            </Button>
          </fieldset>
        </form>
      </Form>
      <Button
        className="mt-4 w-full py-6"
        type="button"
        variant="outline"
        onClick={hadleSignInWithOAuth}
        disabled={isPending}
      >
        <img
          src="/assets/github-mark.svg"
          alt=""
          width={20}
          height={20}
          className="size-5 dark:hidden"
        />
        <img
          src="/assets/github-mark-white.svg"
          alt=""
          width={20}
          height={20}
          className="hidden size-5 dark:block!"
        />
        GitHub 로그인
      </Button>
      <div className="mt-10 flex items-center justify-center gap-2">
        <Link href="/signup" className="text-muted-foreground underline">
          회원가입
        </Link>
        <Link href="/forgot-password" className="text-muted-foreground underline">
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}
