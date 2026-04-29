import "../load-env.ts";
import { z } from "zod";

const supportedSocialProviders = ["github", "discord"] as const;

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  AUTH_SOCIAL_PROVIDERS: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
});

type ProviderName = (typeof supportedSocialProviders)[number];

function parseAllowList(rawValue: string | undefined) {
  return rawValue
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) ?? [];
}

function isProviderEnabled(name: ProviderName, allowList: string[]) {
  return allowList.length === 0 || allowList.includes(name);
}

function hasProviderCredentials(name: ProviderName, env: z.infer<typeof envSchema>) {
  if (name === "github") {
    return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
  }

  return Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET);
}

function main() {
  const env = envSchema.parse(process.env);
  const errors: string[] = [];
  const warnings: string[] = [];
  const allowList = parseAllowList(env.AUTH_SOCIAL_PROVIDERS);
  const unknownProviders = allowList.filter(
    (provider) => !supportedSocialProviders.includes(provider as ProviderName),
  );

  if (!env.DATABASE_URL) {
    errors.push("Missing DATABASE_URL.");
  }

  if (!env.BETTER_AUTH_SECRET) {
    errors.push("Missing BETTER_AUTH_SECRET.");
  } else if (env.BETTER_AUTH_SECRET.length < 32) {
    errors.push("BETTER_AUTH_SECRET must be at least 32 characters.");
  }

  if (!env.BETTER_AUTH_URL) {
    errors.push("Missing BETTER_AUTH_URL.");
  }

  if (unknownProviders.length > 0) {
    warnings.push(
      `Ignoring unsupported AUTH_SOCIAL_PROVIDERS entries: ${unknownProviders.join(", ")}.`,
    );
  }

  for (const provider of supportedSocialProviders) {
    const explicitlyEnabled = allowList.includes(provider);

    if (!isProviderEnabled(provider, allowList)) {
      continue;
    }

    if (explicitlyEnabled && !hasProviderCredentials(provider, env)) {
      warnings.push(
        `${provider} is enabled but missing client credentials, so its button will stay hidden.`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("Setup check failed.");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
    process.exit(1);
  }

  console.log("Core setup looks ready.");
  console.log("- DATABASE_URL is configured.");
  console.log("- BETTER_AUTH_SECRET is configured.");
  console.log("- BETTER_AUTH_URL is configured.");

  if (warnings.length > 0) {
    console.log("Optional follow-ups:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  } else {
    console.log("Optional social provider configuration looks consistent.");
  }
}

main();
