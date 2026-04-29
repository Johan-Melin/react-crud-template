import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getHealthPayload } from "../server/health";

export default function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json(getHealthPayload("vercel-function"));
}
