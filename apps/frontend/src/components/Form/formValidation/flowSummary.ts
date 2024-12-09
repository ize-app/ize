import * as z from "zod";

// used for flowsSearchField
export const flowReferenceSchema = z.object({
  flowId: z.string().uuid(),
  flowVersionId: z.string().uuid(),
  name: z.string(),
});
