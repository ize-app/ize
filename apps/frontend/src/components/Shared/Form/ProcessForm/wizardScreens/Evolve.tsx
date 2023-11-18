import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DecisionType,
  DefaultEvolveProcessOptions,
} from "@/components/shared/Form/ProcessForm/types";
import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import {
  AgentSummaryPartsFragment,
  AgentType,
  GroupsAndUsersEliglbeForRoleDocument,
} from "@/graphql/generated/graphql";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import RolesAndDecisionSystem from "../components/RolesAndDecisionSystem";

import { rolesFormSchema } from "../formSchema";
import { RadioControl } from "../..";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { useContext } from "react";
import { createDiscordAvatarURL } from "@/utils/discord";
import { Typography } from "@mui/material";

type FormFields = z.infer<typeof rolesFormSchema>;

const namePrepend = "evolve.";

export const Evolve = ({}) => {
  const { data, loading } = useQuery(GroupsAndUsersEliglbeForRoleDocument);
  const { user } = useContext(CurrentUserContext);

  const agents =
    data?.groupsAndUsersEliglbeForRole as AgentSummaryPartsFragment[];

  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      evolve: {
        rights: {
          request: [
            ...new Set([
              //@ts-ignore
              ...formState.rights?.request,
              ...formState.rights?.response,
            ]),
          ],
          response:
            [
              {
                id: user.id,
                type: AgentType.User,
                avatarUrl: createDiscordAvatarURL(
                  user.discordData.discordId,
                  user.discordData.avatar,
                  128,
                ),
                name: user.discordData.username,
              },
            ] ?? [],
        },
        decision: {
          type: formState.decision?.type ?? DecisionType.Absolute,
          requestExpirationSeconds:
            formState.decision?.requestExpirationSeconds ?? 86400,
          percentageDecision: {
            quorum: formState.decision?.percentageDecision?.quorum ?? 3,
            percentage:
              formState.decision?.percentageDecision?.percentage ?? 51,
          },
          absoluteDecision: {
            threshold: formState.decision?.absoluteDecision?.threshold ?? 1,
          },
        },
      },
    },
    resolver: zodResolver(rolesFormSchema),
    shouldUnregister: true,
  });

  const isPercentageThreshold =
    watch("decision.type") === DecisionType.Percentage;

  const isCustomProcess =
    watch(namePrepend + "evolveDefaults") ===
    DefaultEvolveProcessOptions.Custom;

  const onSubmit = (data: FormFields) => {
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
          <Typography>
            Everything in Cults happens through process, including how process
            evolves.
          </Typography>
          <RadioControl
            //@ts-ignore
            control={control}
            name={namePrepend + "evolveDefaults"}
            label="How does process evolve"
            options={[
              {
                label:
                  "All process participants can request change, but only I can approve",
                value:
                  DefaultEvolveProcessOptions.ParticipantsRequestButCreatorApproves,
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
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
