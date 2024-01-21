import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import RolesAndDecisionSystem from "../components/RolesAndDecisionSystem";
import { rolesFormSchema } from "../formSchema";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import { DecisionType } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export type RoleFormFields = z.infer<typeof rolesFormSchema>;

export type SetFieldValue = UseFormSetValue<RoleFormFields>;
export type GetFieldValues = UseFormGetValues<RoleFormFields>;

export const Roles = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewProcessWizardState();

  const {
    control,
    handleSubmit,
    watch,
    setValue: setFieldValue,
    getValues: getFieldValues,
  } = useForm<RoleFormFields>({
    defaultValues: {
      rights: {
        request: formState.rights?.request ?? [],
        response: formState.rights?.response ?? [],
      },
      decision: {
        type: formState.decision?.type ?? DecisionType.Absolute,
        requestExpirationSeconds: formState.decision?.requestExpirationSeconds ?? 86400,
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

  const isPercentageThreshold = watch("decision.type") === DecisionType.Percentage;

  const onSubmit = (data: RoleFormFields) => {
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
            isPercentageThreshold={isPercentageThreshold}
            setFieldValue={setFieldValue}
            getFieldValues={getFieldValues}
          />
        </form>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
