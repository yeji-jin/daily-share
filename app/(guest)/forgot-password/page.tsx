"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/types/auth";
import { useRequestPasswordResetEmail } from "@/hooks/mutations/use-request-password-reset-email";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/error";

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate: requestPasswordResetEmail, isPending } = useRequestPasswordResetEmail({
    onSuccess: () => {
      toast.info("인증메일이 발송되었습니다", {
        position: "top-center",
      });
      form.reset();
    },
    onError: showErrorToast,
  });

  const handleSendEmail = (values: ForgotPasswordValues) => {
    requestPasswordResetEmail(values.email);
  };

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-xl font-bold">비밀번호 찾기</h1>
      <p className="text-muted-foreground mt-2">
        이메일로 비밀번호를 재 설정 할 수 있는 인증링크를 보내드립니다
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendEmail)} className="mt-10 flex flex-col gap-4">
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
            <Button className="w-full py-6" type="submit">
              인증 메일 요청하기
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
