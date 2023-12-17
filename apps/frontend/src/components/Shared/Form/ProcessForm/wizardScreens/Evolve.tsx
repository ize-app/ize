import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { RadioControl } from "../..";
import RolesAndDecisionSystem from "../components/RolesAndDecisionSystem";
import { evolveProcessFormSchema } from "../formSchema";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import {
  DecisionType,
  DefaultEvolveProcessOptions,
} from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { CurrentUserContext } from "@/contexts/current_user_context";
import {
  AgentSummaryPartsFragment,
  AgentType,
  GroupsAndUsersEliglbeForRoleDocument,
} from "@/graphql/generated/graphql";

type FormFields = z.infer<typeof evolveProcessFormSchema>;

const namePrepend = "evolve.";

export const Evolve = ({}) => {
  const { data } = useQuery(GroupsAndUsersEliglbeForRoleDocument);
  const { me } = useContext(CurrentUserContext);

  const agents = data?.groupsAndUsersEliglbeForRole as AgentSummaryPartsFragment[];

  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      evolve: {
        evolveDefaults:
          formState.evolve?.evolveDefaults ??
          DefaultEvolveProcessOptions.ParticipantsRequestButCreatorApproves,
        rights: {
          request: formState.evolve?.rights?.request ?? [
            ...new Set([
              //@ts-ignore
              ...formState.rights?.request,
              ...formState.rights?.response,
            ]),
          ],
          response:
            formState.evolve?.rights?.response ?? [
              {
                id: me?.user.id,
                type: AgentType.User,
                avatarUrl: me?.user.icon,
                name: me?.user.name,
              },
            ] ??
            [],
        },
        decision: {
          type: formState.evolve?.decision?.type ?? DecisionType.Absolute,
          requestExpirationSeconds: formState.evolve?.decision?.requestExpirationSeconds ?? 86400,
          percentageDecision: {
            quorum: formState.evolve?.decision?.percentageDecision?.quorum ?? 3,
            percentage: formState.evolve?.decision?.percentageDecision?.percentage ?? 51,
          },
          absoluteDecision: {
            threshold: formState.evolve?.decision?.absoluteDecision?.threshold ?? 1,
          },
        },
      },
    },
    resolver: zodResolver(evolveProcessFormSchema),
    shouldUnregister: true,
  });

  const isPercentageThreshold = watch("evolve.decision.type") === DecisionType.Percentage;

  const isCustomProcess = watch("evolve.evolveDefaults") === DefaultEvolveProcessOptions.Custom;

  const onSubmit = (data: FormFields) => {
    // Going to rebuild the role selection so going to ignore this error for now
    //@ts-ignore
    setFormState((prev) => ({
      ...prev,
      evolve: {
        evolveDefaults: data.evolve.evolveDefaults,
        decision: { ...data.evolve.decision },
        rights: {
          request: [...data.evolve.rights.request],
          response: [...data.evolve.rights.response],
        },
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
          <Typography>
            Everything in Cults happens through process, including how process evolves.
          </Typography>
          <RadioControl
            //@ts-ignore
            control={control}
            name={namePrepend + "evolveDefaults"}
            label="How does process evolve"
            options={[
              {
                label: "All process participants can request change, but only I can approve",
                value: DefaultEvolveProcessOptions.ParticipantsRequestButCreatorApproves,
              },
              {
                label: "Custom",
                value: DefaultEvolveProcessOptions.Custom,
              },
            ]}
          />
          {isCustomProcess && (
            <RolesAndDecisionSystem
              //@ts-ignore
              control={control}
              agents={agents}
              isPercentageThreshold={isPercentageThreshold}
              namePrepend={namePrepend}
            />
          )}
        </form>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
