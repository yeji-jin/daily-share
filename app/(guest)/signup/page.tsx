"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useSignUp } from "@/hooks/mutations/use-sign-up";
import { signUpSchema, type SignUpValues } from "@/types/auth";
import { showErrorToast } from "@/lib/error";

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate: signUp, isPending: isSignUpPending } = useSignUp({
    onError: showErrorToast,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const onSubmit = (values: SignUpValues) => {
    signUp(values);
  };

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-xl font-bold">회원가입</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-4">
          <fieldset disabled={isSignUpPending} className="contents">
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
              회원가입
            </Button>
          </fieldset>
        </form>
      </Form>
      <div className="mt-10 flex items-center justify-center gap-2">
        <p>이미 계정이 있다면?</p>
        <Link href="/signin" className="text-muted-foreground underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
