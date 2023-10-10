import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useForm } from "react-hook-form";
import {
  GroupUserSearchControlled,
  RadioControl,
  SelectControl,
  SliderControl,
} from "../Shared/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Groups from "@mui/icons-material/Groups";

import {
  useSetupProcessWizardState,
  ThresholdTypes,

} from "./setupProcessWizard";

import { WizardBody, WizardNav } from "../Shared/Wizard";

const userGroupSchema = z.object({ name: z.string(), avatarUrl: z.string() });

const formSchema = z
  .object({
    rights: z.object({
      request: z.array(userGroupSchema),
      response: z.array(userGroupSchema),
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

export const ProcessRights = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useSetupProcessWizardState();

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
    console.log("data is ", data);

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

  return (
    <>
      <WizardBody>
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <Typography>Requests</Typography>
            <GroupUserSearchControlled
              control={control}
              name={"rights.request"}
              label={"Request privleges"}
            />
            <SelectControl
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
          </div>
          <div>
            <Typography>Response</Typography>
            <GroupUserSearchControlled
              control={control}
              name={"rights.response"}
              label={"Response privleges"}
            />
            <RadioControl
              control={control}
              name="decision.decisionThresholdType"
              label="What options will users choose between?"
              options={[
                { value: ThresholdTypes.Absolute, label: "# of responses" },
                { value: ThresholdTypes.Percentage, label: "% of responses" },
              ]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography maxWidth={"300px"}>
                How many votes does an option need for a decision to be made?
              </Typography>
              <Box sx={{ width: "100%", display: "flex" }}>
                <SliderControl
                  name="decision.decisionThreshold"
                  control={control}
                  max={100}
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
              </Box>
            </Box>
            {isPercentageThreshold ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography maxWidth={"300px"}>
                  How many total responses do there need be to pick the winner?
                </Typography>
                <Box sx={{ width: "100%", display: "flex" }}>
                  <SliderControl
                    name="decision.quorum.quorumThreshold"
                    valueLabelDisplay="on"
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
                </Box>
              </Box>
            ) : null}
          </div>
          <div>
            <Typography>Edit</Typography>
            <GroupUserSearchControlled
              multiple={false}
              control={control}
              name={"rights.edit"}
              label={"Edit privleges"}
            />
          </div>
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
