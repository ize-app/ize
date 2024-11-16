import * as z from "zod";

import { entityFormSchema } from "../../formValidation/entity";

export type PermissionSchemaType = z.infer<typeof permissionSchema>;

export const permissionSchema = z
  .object({
    // some components (Initial flow wizard) use a select field that can only pass a string value
    anyone: z
      .union([z.boolean(), z.string()])
      .transform((val) => (val === "true" ? true : val === "false" ? false : (val as boolean)))
      .default(true),
    entities: z.array(entityFormSchema).default([]),
  })
  .refine(
    (permission) => {
      if (!permission.anyone && (!permission.entities || permission.entities.length === 0))
        return false;
      return true;
    },
    { path: ["entities"], message: "Please select at least one group or individual." },
  );
