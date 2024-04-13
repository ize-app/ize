import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";
import { FlowSchemaType } from "../formValidation/flow";

import { WizardBody, WizardNav } from "@/components/Wizard";
import { flowSchema } from "../formValidation/flow";
import { StepsForm } from "../components/StepsForm";
import { PermissionType } from "../formValidation/permission";
import { TextField } from "../../formFields";
import { EntityType, DecisionType } from "@/graphql/generated/graphql";
import { useContext } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const { me } = useContext(CurrentUserContext);

  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      reusable: formState.reusable ?? false,
      evolve: formState.evolve ?? {
        requestPermission: { type: PermissionType.Anyone, entities: [] },
        responsePermission: {
          type: PermissionType.Entities,
          entities: me?.identities
            ? [
                // This would be an issue if there was ever not any other id but the discord id
                // but each discord auth also creates email identity
                // TODO: brittle, should handle better
                me.identities
                  .filter((id) => id.identityType.__typename !== "IdentityDiscord")
                  .map((id) => ({ ...id, __typename: "Identity" as EntityType }))[0],
              ]
            : [],
        },
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
        },
      },
      steps: formState.steps ? [...formState.steps] : [defaultStepFormValues],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: FlowSchemaType) => {
    setFormState((prev) => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form>
      <WizardBody>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <TextField<FlowSchemaType>
            control={useFormMethods.control}
            sx={{ width: "100%" }}
            label="Name of this flow"
            placeholderText="What's the purpose of this form?"
            variant="outlined"
            size="small"
            showLabel={true}
            name={`name`}
          />
          <StepsForm useFormMethods={useFormMethods} />
        </Box>
      </WizardBody>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
