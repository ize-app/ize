import * as z from "zod";

import { permissionSchema } from "./permission";
import { decisionSchema } from "./result";

export type EvolveSchemaType = z.infer<typeof evolveFlowSchema>;

export const evolveFlowSchema = z.object({
  requestPermission: permissionSchema,
  responsePermission: permissionSchema,
  decision: decisionSchema,
});
