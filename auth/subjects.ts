import { z } from "zod";
import { createSubjects } from "@openauthjs/openauth/subject";

export const userSchema = z.object({
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  nickname: z.string().optional(),
  locale: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
  birthdate: z.string().optional(),
  profile_images: z.object({
    image32: z.string().url(),
    image64: z.string().url(),
    image128: z.string().url(),
    image192: z.string().url(),
  }),
  picture: z.string().url(),
  access: z.string(),
});

export type UserSubject = z.infer<typeof userSchema>;

export const subjects = createSubjects({
  user: userSchema,
});
