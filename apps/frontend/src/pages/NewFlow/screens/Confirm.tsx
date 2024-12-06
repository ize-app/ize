import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SelectGroupsToWatchFlowForm } from "@/components/Form/SelectGroupsToWatchForm/SelectGroupsToWatchForm";
import {
  GroupsToWatchSchemaType,
  groupsToWatchSchema,
} from "@/components/Form/SelectGroupsToWatchForm/selectGroupsValidation";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewFlowWizardState } from "../newFlowWizard";

export const Confirm = () => {
  const formMethods = useForm<GroupsToWatchSchemaType>({
    defaultValues: { groups: [] },
    resolver: zodResolver(groupsToWatchSchema),
    shouldUnregister: false,
  });
  const { setFormState, formState, onNext, onPrev, nextLabel, disableNext } =
    useNewFlowWizardState();

  const entityIds: string[] = [];
  formState.new.flow.trigger.permission.entities.map((entity) => entityIds.push(entity.entityId));
  formState.new.flow.steps.forEach((step) => {
    step.response?.permission.entities.map((entity) => entityIds.push(entity.entityId));
  });

  const [shouldCallNext, setShouldCallNext] = useState(false);

  useEffect(() => {
    if (shouldCallNext) {
      onNext(); // Call onNext after formState is updated
      setShouldCallNext(false); // Reset the flag
    }
  }, [shouldCallNext]);

  const onSubmit = (data: GroupsToWatchSchemaType) => {
    setFormState((prev) => ({ ...prev, groupsToWatch: data.groups }));
    setShouldCallNext(true);
  };

  return (
    <FormProvider {...formMethods}>
      <form>
        <WizardBody>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "800px" }}>
            <Typography>
              Confirm your flow.
              {/* <span style={{ fontWeight: "bold" }}>{formState.name}</span> */}
            </Typography>
            <SelectGroupsToWatchFlowForm<GroupsToWatchSchemaType>
              name="groups"
              entityIds={entityIds}
            />
          </Box>
        </WizardBody>

        <WizardNav
          nextLabel={nextLabel}
          onPrev={onPrev}
          onNext={formMethods.handleSubmit(onSubmit)}
          disableNext={disableNext}
        />
      </form>
    </FormProvider>
  );
};
