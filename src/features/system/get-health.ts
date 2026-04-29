export type Healthcheck = {
  environment: string;
  runtime: string;
  status: "ok";
  timestamp: string;
};

export async function getHealth() {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error("Unable to reach the local API runtime.");
  }

  return (await response.json()) as Healthcheck;
}
