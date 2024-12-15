import * as z from "zod";

export type RequestWatchFlowSchemaType = z.infer<typeof requestWatchFlowSchema>;

export const requestWatchFlowSchema = z.object({
  watch: z.boolean().default(false),
});
