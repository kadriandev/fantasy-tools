import { z } from "zod";
import { userSchema } from "../../../auth/subjects";

export const decodedAuthTokenSchema = z.object({
  mode: z.string(),
  type: z.string(),
  aud: z.string(),
  iss: z.string(),
  sub: z.string(),
  exp: z.number(),
  properties: userSchema,
});

export type ParsedAuthToken = z.infer<typeof decodedAuthTokenSchema>;
