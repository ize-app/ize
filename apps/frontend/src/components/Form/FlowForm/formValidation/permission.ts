import * as z from "zod";

import { entityFormSchema } from "../../formValidation/entity";

export type PermissionSchemaType = z.infer<typeof permissionSchema>;

export enum PermissionType {
  Entities = "Entities",
  Anyone = "Anyone",
}

export const permissionSchema = z
  .object({
    type: z.nativeEnum(PermissionType),
    entities: z.array(entityFormSchema).default([]),
  })
  .refine(
    (permission) => {
      if (
        permission.type === PermissionType.Entities &&
        (!permission.entities || permission.entities.length === 0)
      )
        return false;
      return true;
    },
    { path: ["entities"], message: "Please select at least one group or individual." },
  );
