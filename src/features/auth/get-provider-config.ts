export type AuthProviderConfig = {
  emailAndPassword: boolean;
  socialProviders: Array<"github" | "discord">;
};

export async function getProviderConfig() {
  const response = await fetch("/api/auth/providers");

  if (!response.ok) {
    throw new Error("Unable to load the available auth providers.");
  }

  return (await response.json()) as AuthProviderConfig;
}
