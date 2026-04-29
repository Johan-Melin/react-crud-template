import { getEnabledSocialProviders, type SocialProvider } from "./env.js";

export type AuthProviderConfig = {
  emailAndPassword: boolean;
  socialProviders: SocialProvider[];
};

export function getAuthProviderConfig(): AuthProviderConfig {
  return {
    emailAndPassword: true,
    socialProviders: Object.keys(
      getEnabledSocialProviders(),
    ) as SocialProvider[],
  };
}
