import type { AuthProviderConfig } from "./get-provider-config.ts";

type ProviderButtonsProps = {
  config: AuthProviderConfig;
  isBusy: boolean;
  onSignIn: (provider: AuthProviderConfig["socialProviders"][number]) => void;
};

const providerLabels: Record<AuthProviderConfig["socialProviders"][number], string> =
  {
    github: "Continue with GitHub",
    discord: "Continue with Discord",
  };

export function ProviderButtons({
  config,
  isBusy,
  onSignIn,
}: ProviderButtonsProps) {
  if (config.socialProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">
        Social sign-in
      </p>
      <div className="grid gap-3">
        {config.socialProviders.map((provider) => (
          <button
            key={provider}
            type="button"
            className="button-secondary w-full"
            disabled={isBusy}
            onClick={() => onSignIn(provider)}
          >
            {providerLabels[provider]}
          </button>
        ))}
      </div>
    </div>
  );
}
