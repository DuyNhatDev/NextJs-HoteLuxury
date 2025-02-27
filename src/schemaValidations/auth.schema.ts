import { Role } from "@/constants/type";
import z from "zod";

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.infer<typeof LoginBody>;

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum([Role.Admin, Role.Manager, Role.Client]),
      avatar: z.string().nullable(),
    }),
  }),
  message: z.string(),
});

export type LoginResType = z.infer<typeof LoginRes>;

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type RefreshTokenResType = z.infer<typeof RefreshTokenRes>;

export const LogoutBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type LogoutBodyType = z.infer<typeof LogoutBody>;

export const LoginGoogleQuery = z.object({
  code: z.string(),
});

export type LoginGoogleQueryType = z.infer<typeof LoginGoogleQuery>;
