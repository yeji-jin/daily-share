import { z } from "zod";

export const emailSchema = z.email("올바른 이메일 형식이 아닙니다.");

export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginValues = z.infer<typeof loginSchema>;
