import { toNodeHandler } from "better-auth/node";
import { auth } from "../../server/auth/auth.js";
export const config = {
    api: {
        bodyParser: false,
    },
};
export default toNodeHandler(auth.handler);
//# sourceMappingURL=%5B...all%5D.js.map