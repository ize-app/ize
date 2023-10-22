import { zodResolver } from "@hookform/resolvers/zod";
import Groups from "@mui/icons-material/Groups";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ThresholdTypes, useNewProcessWizardState } from "./newProcessWizard";
import {
  GroupUserSearchControl,
  RadioControl,
  SelectControl,
  SliderControl,
} from "../shared/Form";
import { WizardBody, WizardNav } from "../shared/Wizard";

const userGroupSchema = z.object({ name: z.string(), avatarUrl: z.string() });

const formSchema = z
  .object({
    rights: z.object({
      request: z
        .array(userGroupSchema)
        .min(1, "Please select at least one group or individual."),
      response: z
        .array(userGroupSchema)
        .min(1, "Please select at least one group or individual."),
      edit: userGroupSchema,
    }),
    decision: z.object({
      decisionThreshold: z.number(),
      decisionThresholdType: z.nativeEnum(ThresholdTypes),
      requestExpirationSeconds: z.number(),
      quorum: z.object({ quorumThreshold: z.number().optional() }).optional(),
    }),
  })
  .refine(
    (data) => {
      if (
        data.decision.decisionThresholdType === ThresholdTypes.Percentage &&
        data.decision?.quorum?.quorumThreshold === undefined
      )
        return false;
      return true;
    },
    { path: ["decision.quorum.quorumThreshold"] },
  );

type FormFields = z.infer<typeof formSchema>;

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
        border: "solid 1px #EADDFF",
        borderRadius: "6px",
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

export const ProcessRights = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();
  const totalGroupMembers = 128;

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      rights: {
        request: formState.rights?.request ?? [],
        response: formState.rights?.response ?? [],
        edit: formState.rights?.edit,
      },
      decision: {
        decisionThresholdType:
          formState.decision?.decisionThresholdType ?? ThresholdTypes.Absolute,
        decisionThreshold: formState.decision?.decisionThreshold ?? 1,
        requestExpirationSeconds:
          formState.decision?.requestExpirationSeconds ?? 86400,
        quorum: {
          quorumThreshold: formState.decision?.quorum?.quorumThreshold ?? 0,
        },
      },
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  const isPercentageThreshold =
    watch("decision.decisionThresholdType") === ThresholdTypes.Percentage;

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
      decision: {
        ...data.decision,
        requestExpirationSeconds:
          data.decision.requestExpirationSeconds ?? 3600,
      },
    }));

    onNext();
  };
  // start at size and grow regardless of

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
          <RightsContainer title={"How is this process triggered?"}>
            <GroupUserSearchControl
              //@ts-ignore
              control={control}
              name={"rights.request"}
              label={"Who can create requests to trigger this process?"}
            />
            <SelectControl
              //@ts-ignore
              control={control}
              sx={{ width: "300px" }}
              name="decision.requestExpirationSeconds"
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
          <RightsContainer title={"How is a final decision reached?"}>
            <GroupUserSearchControl
              //@ts-ignore
              control={control}
              name={"rights.response"}
              label={"Who can respond to requests?"}
            />
            <RadioControl
              //@ts-ignore
              control={control}
              name="decision.decisionThresholdType"
              label="At what point is a final decision reached?"
              options={[
                {
                  value: ThresholdTypes.Absolute,
                  label: "An option receives a certain # of votes",
                },
                {
                  value: ThresholdTypes.Percentage,
                  label: "An option receives a certain % of votes",
                },
              ]}
            />
            <SliderContainer
              label={
                isPercentageThreshold
                  ? "What percentage of votes?"
                  : "How many votes?"
              }
            >
              <SliderControl
                name="decision.decisionThreshold"
                //@ts-ignore
                control={control}
                max={100}
                valueLabelFormat={(value: number) =>
                  isPercentageThreshold ? value.toString() + "%" : value
                }
                min={isPercentageThreshold ? 50 : 1}
                valueLabelDisplay="on"
              />
              <Box
                sx={{
                  width: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                {isPercentageThreshold ? "100%" : totalGroupMembers}
                {isPercentageThreshold ? null : <Groups color="primary" />}
              </Box>
            </SliderContainer>
            {isPercentageThreshold ? (
              <SliderContainer
                label={
                  "What's the minimum # of people that need to vote to reach a decision (the quorum)?"
                }
              >
                <SliderControl
                  name="decision.quorum.quorumThreshold"
                  valueLabelDisplay="on"
                  //@ts-ignore
                  control={control}
                  max={100}
                  min={1}
                />
                <Box
                  sx={{
                    width: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  {totalGroupMembers}
                  <Groups color="primary" />
                </Box>
              </SliderContainer>
            ) : null}
          </RightsContainer>
          <RightsContainer title={"How can this process evolve?"}>
            {/* <Typography>Edit</Typography> */}
            <GroupUserSearchControl
              multiple={false}
              //@ts-ignore
              control={control}
              name={"rights.edit"}
              label={"Who is responsible for how this process evolves?"}
            />
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
