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
  const { data, loading } = useQuery(GroupsAndUsersEliglbeForRoleDocument);

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
      requestExpirationSeconds: formState.requestExpirationSeconds ?? 86400,
      decision: {
        type: formState.decision?.type ?? DecisionType.Absolute,
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
    setFormState((prev) => ({
      ...prev,
      ...data,
      requestExpirationSeconds: data.requestExpirationSeconds,
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
