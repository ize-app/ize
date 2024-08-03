import * as z from "zod";

// used for flowsSearchField
export const flowSummarySchema = z.object({
  flowId: z.string().uuid(),
});
