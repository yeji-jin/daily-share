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
import { resetPasswordSchema, type ResetPasswordValues } from "@/types/auth";
import { useUpdatePassword } from "@/hooks/mutations/use-update-password";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/error";
import { signOut } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  const { mutate: updatePassword, isPending } = useUpdatePassword({
    onSuccess: async () => {
      await signOut();
      router.replace("/signin?reset=success");
    },
    onError: (error) => {
      showErrorToast(error);
      form.reset();
    },
  });

  const handleUpdatePassword = (value: ResetPasswordValues) => {
    updatePassword(value.password);
  };

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-xl font-bold">비밀번호 재설정</h1>
      <p className="text-muted-foreground mt-2">새로운 비밀번호로 변경해주세요</p>
      <Form {...form}>
        <form
          className="mt-10 flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleUpdatePassword)}
        >
          <fieldset className="contents" disabled={isPending}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">새 비밀번호</FormLabel>
                  <FormControl>
                    <Input className="py-6" type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full py-6" type="submit">
              비밀번호 변경하기
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
