import { getHealthPayload } from "../server/health.js";
export default function handler(_request, response) {
    response.status(200).json(getHealthPayload("vercel-function"));
}
//# sourceMappingURL=health.js.map