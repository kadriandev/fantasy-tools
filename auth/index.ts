import { Resource } from "sst";
import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { YahooProvider } from "@openauthjs/openauth/provider/yahoo";
import { subjects, userSchema } from "./subjects";

async function getUser(access_token: string) {
  // Get user from database and return user ID
  const userinfo = await fetch(
    "https://api.login.yahoo.com/openid/v1/userinfo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  ).then((res) => res.json());
  userinfo.access = access_token;

  const user = userSchema.parse(userinfo);

  return user;
}

const app = issuer({
  subjects,
  ttl: {
    access: 3600,
  },
  providers: {
    yahoo: YahooProvider({
      clientID: Resource.YAHOO_CLIENT_ID.value,
      clientSecret: Resource.YAHOO_CLIENT_SECRET.value,
      scopes: ["openid2", "email", "profile", "fspt-r"],
    }),
  },
  success: async (ctx, value) => {
    if (value.provider === "yahoo") {
      const user = await getUser(value.tokenset.access);
      if (user) {
        console.log(`[SUCCESSFUL LOGIN]: ${user.name} logged in.`);
        return ctx.subject("user", user);
      }

      throw new Error("Unable to find user.");
    }
    throw new Error("Invalid provider");
  },
});

export const handler = handle(app);
