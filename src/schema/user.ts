import { z } from "zod";

export const userSchema = z.object({
  body: z.object({
    name: z.string().max(50),
    email: z.string().email(),
    phone: z.string().max(13),
    password: z.string().max(30),
  }),
});

export const pidSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const dpidSchema = z.object({
  body: z.object({
    id: z.string(),
    paymentId: z.string(),
  }),
});
