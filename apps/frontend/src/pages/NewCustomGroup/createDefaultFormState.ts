import { GroupInitialSetupSchemaType } from "./formValidation";

export const createDefaultFormState = (): GroupInitialSetupSchemaType => ({
  entityId: crypto.randomUUID(),
  name: "",
  description: "",
  members: [],
  notificationEntity: undefined,
});
