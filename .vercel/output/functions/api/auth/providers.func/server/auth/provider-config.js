import { getEnabledSocialProviders } from "./env.js";
export function getAuthProviderConfig() {
    return {
        emailAndPassword: true,
        socialProviders: Object.keys(getEnabledSocialProviders()),
    };
}
//# sourceMappingURL=provider-config.js.map