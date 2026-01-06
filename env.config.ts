import { defineEnv } from "envin";
import * as z from "zod"; 

const env = defineEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    CONVEX_DEPLOYMENT: z.string().optional(),
  },
  server: {
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
    CLERK_JWT_ISSUER_DOMAIN: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CONVEX_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_API_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  env: process.env
});


export default env;
