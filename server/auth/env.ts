import "../load-env.ts";
import { z } from "zod";

const socialProviders = ["github", "discord"] as const;

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  BETTER_AUTH_URL: z.url().optional(),
  AUTH_SOCIAL_PROVIDERS: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  DISCORD_CLIENT_ID: z.string().min(1).optional(),
  DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
});

export type SocialProvider = (typeof socialProviders)[number];

export function getAuthEnv() {
  return authEnvSchema.parse(process.env);
}

export function getEnabledSocialProviders() {
  const env = getAuthEnv();
  const allowList = new Set(
    (env.AUTH_SOCIAL_PROVIDERS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value): value is SocialProvider =>
        socialProviders.includes(value as SocialProvider),
      ),
  );

  const socialProvidersConfig = {
    github:
      env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
        ? {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          }
        : undefined,
    discord:
      env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
        ? {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
          }
        : undefined,
  };

  return Object.fromEntries(
    Object.entries(socialProvidersConfig).filter(([provider, config]) => {
      return config && (allowList.size === 0 || allowList.has(provider as SocialProvider));
    }),
  );
}

export function getAuthBaseUrl() {
  return getAuthEnv().BETTER_AUTH_URL ?? "http://localhost:3000";
}

export function getAuthSecret() {
  return getAuthEnv().BETTER_AUTH_SECRET ?? "dev-better-auth-secret-change-me-0001";
}
