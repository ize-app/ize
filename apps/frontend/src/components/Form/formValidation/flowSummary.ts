import * as z from "zod";

// used for flowsSearchField
export const flowReferenceSchema = z.object({
  flowId: z.string().uuid(),
  flowName: z.string(),
  flowVersionId: z.string().uuid(),
});
