import "../load-env.js";
import { z } from "zod";
const socialProviders = ["github", "discord"];
const optionalNonEmptyString = z.preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") {
        return undefined;
    }
    return value;
}, z.string().min(1).optional());
const authEnvSchema = z.object({
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    BETTER_AUTH_URL: z.url().optional(),
    AUTH_SOCIAL_PROVIDERS: z.string().optional(),
    GITHUB_CLIENT_ID: optionalNonEmptyString,
    GITHUB_CLIENT_SECRET: optionalNonEmptyString,
    DISCORD_CLIENT_ID: optionalNonEmptyString,
    DISCORD_CLIENT_SECRET: optionalNonEmptyString,
});
export function getAuthEnv() {
    return authEnvSchema.parse(process.env);
}
export function getEnabledSocialProviders() {
    const env = getAuthEnv();
    const allowList = new Set((env.AUTH_SOCIAL_PROVIDERS ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter((value) => socialProviders.includes(value)));
    const socialProvidersConfig = {
        github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
            ? {
                clientId: env.GITHUB_CLIENT_ID,
                clientSecret: env.GITHUB_CLIENT_SECRET,
            }
            : undefined,
        discord: env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
            ? {
                clientId: env.DISCORD_CLIENT_ID,
                clientSecret: env.DISCORD_CLIENT_SECRET,
            }
            : undefined,
    };
    return Object.fromEntries(Object.entries(socialProvidersConfig).filter(([provider, config]) => {
        return config && (allowList.size === 0 || allowList.has(provider));
    }));
}
export function getAuthBaseUrl() {
    return getAuthEnv().BETTER_AUTH_URL ?? "http://localhost:3000";
}
export function getAuthSecret() {
    return getAuthEnv().BETTER_AUTH_SECRET ?? "dev-better-auth-secret-change-me-0001";
}
//# sourceMappingURL=env.js.map