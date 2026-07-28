"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSignIn } from "@/hooks/mutations/use-sign-in";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import { showErrorToast } from "@/lib/error";

export default function SignInPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: signIn, isPending: isSignInWithPasswordPending } = useSignIn({
    onError: showErrorToast,
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
                    <Input
                      className="py-6"
                      type="email"
                      placeholder="abc@google.com"
                      {...field}
                    />
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
        <p>아직 회원이 아니라면?</p>
        <Link href="/signup" className="text-muted-foreground underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
