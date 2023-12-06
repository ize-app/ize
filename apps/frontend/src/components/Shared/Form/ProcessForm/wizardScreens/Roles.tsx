import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DecisionType } from "@/components/shared/Form/ProcessForm/types";
import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import {
  AgentSummaryPartsFragment,
  GroupsAndUsersEliglbeForRoleDocument,
} from "@/graphql/generated/graphql";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";

import { rolesFormSchema } from "../formSchema";
import RolesAndDecisionSystem from "../components/RolesAndDecisionSystem";

type FormFields = z.infer<typeof rolesFormSchema>;

export const Roles = () => {
  const { data } = useQuery(GroupsAndUsersEliglbeForRoleDocument);

  const agents =
    data?.groupsAndUsersEliglbeForRole as AgentSummaryPartsFragment[];

  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      rights: {
        request: formState.rights?.request ?? [],
        response: formState.rights?.response ?? [],
      },
      decision: {
        type: formState.decision?.type ?? DecisionType.Absolute,
        requestExpirationSeconds:
          formState.decision?.requestExpirationSeconds ?? 86400,
        percentageDecision: {
          quorum: formState.decision?.percentageDecision?.quorum ?? 3,
          percentage: formState.decision?.percentageDecision?.percentage ?? 51,
        },
        absoluteDecision: {
          threshold: formState.decision?.absoluteDecision?.threshold ?? 3,
        },
      },
    },
    resolver: zodResolver(rolesFormSchema),
    shouldUnregister: true,
  });

  const isPercentageThreshold =
    watch("decision.type") === DecisionType.Percentage;

  const onSubmit = (data: FormFields) => {
    // Going to rebuild the role selection so going to ignore this error for now
    //@ts-ignore
    setFormState((prev) => ({
      ...prev,
      ...data,
      decision: {
        ...data.decision,
      },
    }));

    onNext();
  };

  return (
    <>
      <WizardBody>
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <RolesAndDecisionSystem
            //@ts-ignore
            control={control}
            agents={agents}
            isPercentageThreshold={isPercentageThreshold}
          />
        </form>
      </WizardBody>
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
