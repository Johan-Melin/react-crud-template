import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthProviderConfig } from "../../server/auth/provider-config.js";

export default function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json(getAuthProviderConfig());
}
