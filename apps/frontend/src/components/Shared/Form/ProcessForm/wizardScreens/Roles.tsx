import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TextFieldControl } from "@/components/shared/Form";
import { DecisionType } from "@/components/shared/Form/ProcessForm/types";
import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import InputAdornment from "@mui/material/InputAdornment";
import {
  AgentSummaryPartsFragment,
  GroupsAndUsersEliglbeForRoleDocument,
} from "@/graphql/generated/graphql";
import {
  GroupUserSearchControl,
  SelectControl,
} from "@/components/shared/Form";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";

import { rolesFormSchema } from "../formSchema";

type FormFields = z.infer<typeof rolesFormSchema>;

const RightsContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Typography variant={"h3"}>{title}</Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "12px",
      }}
    >
      {children}
    </Box>
  </Box>
);

const SliderContainer = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "24px",
      minHeight: "50px",
    }}
  >
    <Box sx={{ width: "300px", flexBasis: "auto", flexGrow: "1" }}>
      <Typography>{label}</Typography>
    </Box>
    <Box
      sx={{
        width: "100%",
        display: "flex",
        maxWidth: "50%",
      }}
    >
      {children}
    </Box>
  </Box>
);
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
          <RightsContainer title={"Request"}>
            <GroupUserSearchControl
              //@ts-ignore
              control={control}
              name={"rights.request"}
              label={"Who can create requests?"}
              agents={agents}
            />
            <SelectControl
              //@ts-ignore
              control={control}
              sx={{ width: "300px" }}
              name="requestExpirationSeconds"
              selectOptions={[
                { name: "1 hour", value: 3600 },
                { name: "4 hours", value: 14400 },
                { name: "1 day", value: 86400 },
                { name: "3 days", value: 259200 },
                { name: "7 days", value: 604800 },
                { name: "30 days", value: 2592000 },
              ]}
              label="Days until request expires"
            />
          </RightsContainer>
          <RightsContainer title={"Response"}>
            <GroupUserSearchControl
              //@ts-ignore
              control={control}
              name={"rights.response"}
              label={"Who can respond to requests?"}
              agents={agents}
            />
            <Box
              sx={{
                display: "flex",
                gap: "24px",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{}}>
                <SelectControl
                  //@ts-ignore
                  control={control}
                  name="decision.type"
                  sx={{ width: "300px" }}
                  selectOptions={[
                    {
                      value: DecisionType.Absolute,
                      name: "Threshold vote",
                    },
                    {
                      value: DecisionType.Percentage,
                      name: "Percentage vote",
                    },
                  ]}
                  label="When is there a final result?"
                />
              </Box>
              {isPercentageThreshold ? (
                <>
                  <Box>
                    <TextFieldControl
                      //@ts-ignore
                      control={control}
                      name="decision.percentageDecision.percentage"
                      label={`Option becomes final result when it has:`}
                      endAdornment={
                        <InputAdornment position="end">
                          % of responses
                        </InputAdornment>
                      }
                      sx={{ width: "300px" }}
                      required
                    />
                  </Box>
                  <Box>
                    <TextFieldControl
                      //@ts-ignore
                      control={control}
                      name="decision.percentageDecision.quorum"
                      label={`Quorum (min # of responses for a result)`}
                      endAdornment={
                        <InputAdornment position="end">
                          total responses
                        </InputAdornment>
                      }
                      sx={{ width: "300px" }}
                      required
                    />
                  </Box>
                </>
              ) : (
                <Box>
                  <TextFieldControl
                    //@ts-ignore
                    control={control}
                    name="decision.absoluteDecision.threshold"
                    label={"Option is selected once it has:"}
                    sx={{ width: "300px" }}
                    endAdornment={
                      <InputAdornment position="end">responses</InputAdornment>
                    }
                    required
                  />
                </Box>
              )}
            </Box>
          </RightsContainer>
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
