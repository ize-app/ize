import * as z from "zod";
import { entityFormSchema } from "./entity";

export type PermissionSchemaType = z.infer<typeof permissionSchema>;

export enum PermissionType {
  Entities = "Entities",
  Anyone = "Anyone",
  Process = "Process",
}

export const permissionSchema = z.object({
  type: z.nativeEnum(PermissionType),
  entities: z
    .array(entityFormSchema)
    .min(1, "Please select at least one group or individual.")
    .optional(),
  processId: z.string().uuid().optional(),
});
