import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { ButtonGroupField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";
import { GroupFlowPolicyType } from "@/graphql/generated/graphql";

import { WizardNav } from "../../../components/Wizard";
import { PolicyDecisionForm } from "../components/PolicyDecisionForm";
import {
  GroupSetupAndPoliciesSchemaType,
  groupSetupAndPoliciesFormSchema,
} from "../formValidation";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";

const flowPolicySelections = [
  {
    name: "Only I can approve",
    title: "Dictatorship",
    value: GroupFlowPolicyType.CreatorAutoApprove,
  },
  {
    name: "Anyone in group approves",
    title: "Empower members",
    value: GroupFlowPolicyType.GroupAutoApprove,
  },
  {
    name: "Decides by vote",
    title: "Democracy",
    value: GroupFlowPolicyType.GroupDecision,
  },
];

export const Policy = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const formMethods = useForm<GroupSetupAndPoliciesSchemaType>({
    defaultValues: {
      ...formState,
      flows: formState.flows ?? {},
    },
    resolver: zodResolver(groupSetupAndPoliciesFormSchema),
    shouldUnregister: false,
  });

  const onSubmit = async (data: GroupSetupAndPoliciesSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));
    onNext();
  };

  console.log("errors are  ", formMethods.formState.errors);
  console.log("form state is ", formMethods.getValues());

  const evolveGroupPolicyType = formMethods.watch("flows.evolveGroup.type");
  const watchGroupPolicyType = formMethods.watch("flows.watch.type");

  return (
    <FormProvider {...formMethods}>
      <WizardScreenBodyNarrow>
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Typography variant="description">
            Your group is fully managed by collaborative proess <em>flows</em>. By default, anyone
            in your group can request changes to the group. Decide here how those requests are
            approved.
          </Typography>
          <FieldBlockFadeIn>
            <Typography variant="h3">Evolving the group itself</Typography>
            <Typography variant="description">
              How can membership and notification settings evolve time?
            </Typography>
            <ButtonGroupField<GroupSetupAndPoliciesSchemaType>
              label="How does this group evolve?"
              name="flows.evolveGroup.type"
              options={flowPolicySelections}
              buttonWidth="180px"
            />
            {evolveGroupPolicyType === GroupFlowPolicyType.GroupDecision && (
              <FieldBlockFadeIn sx={{ marginTop: "12px" }}>
                <PolicyDecisionForm flowType="evolveGroup" />
              </FieldBlockFadeIn>
            )}
          </FieldBlockFadeIn>
          <FieldBlockFadeIn>
            <Typography variant="h3">Evolving watched flows</Typography>
            <Typography variant="description">
              How does the group decide which flows to pay attention to?
            </Typography>
            <ButtonGroupField<GroupSetupAndPoliciesSchemaType>
              label="How does this group evolve?"
              name="flows.watch.type"
              options={flowPolicySelections}
              buttonWidth="180px"
            />
            {watchGroupPolicyType === GroupFlowPolicyType.GroupDecision && (
              <FieldBlockFadeIn sx={{ marginTop: "12px" }}>
                <PolicyDecisionForm flowType="watch" />
              </FieldBlockFadeIn>
            )}
          </FieldBlockFadeIn>
        </form>
      </WizardScreenBodyNarrow>
      <WizardNav
        onNext={formMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </FormProvider>
  );
};
