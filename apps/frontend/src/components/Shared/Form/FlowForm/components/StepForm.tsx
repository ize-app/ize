import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select } from "@/components/shared/Form/FormFields";

import { StepContainer } from "./StepContainer";
import { ResponseForm } from "./ResponseForm/ResponseForm";
import { ResultForm } from "./ResultForm/ResultForm";
import { RequestForm } from "./RequestForm/RequestForm";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResultType } from "@/graphql/generated/graphql";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  stepsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: number | "EvolveStep" | false;
  formIndex: number; // react-hook-form name
}

export const stepNameLabels = new Map<ResultType, { stepTitle: string }>([
  [ResultType.Decision, { stepTitle: "Decide" }],
  [ResultType.Ranking, { stepTitle: "Rank" }],
  [ResultType.AutoApprove, { stepTitle: "Auto-approve request" }],
  [ResultType.Raw, { stepTitle: "Get group's thoughts" }],
  [ResultType.LlmSummary, { stepTitle: "Sensemaking with AI" }],
]);

export interface PreviousStepResult {
  resultType: ResultType;
}

export const StepForm = ({
  useFormMethods,
  formIndex,
  stepsArrayMethods,
  handleStepExpansion,
  expandedStep,
}: StepFormProps) => {

  const { control, getValues: getFieldValues, watch } = useFormMethods;
  console.log("form state for ", formIndex, " is ", getFieldValues());

  console.log("errors are ", useFormMethods.formState.errors);

  const resultType = watch(`steps.${formIndex}.result.type`);
  // const [lastResult, setLastResultType] = useState<ResultType | null>(null);

  // useEffect(() => {
  //   console.log("inside use effet for ", resultType);
  //   if (!!resultType && lastResult !== resultType) {
  //     useFormMethods.resetField(`steps.${formIndex}`, {
  //       defaultValue: getDefaultFormValues(resultType),
  //     });
  //     setLastResultType(resultType);
  //   }
  // }, [resultType]);

  const previousStepResult: PreviousStepResult | null =
    formIndex > 0
      ? {
          resultType: watch(`steps.${formIndex - 1}.result.type`),
        }
      : null;

  const isReusable = watch("reusable");

  const stepTitle = stepNameLabels.get(resultType)?.stepTitle;

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIdentifier={formIndex}
      title={` Step ${formIndex + 1}: ${stepTitle}`}
    >
      <ResponsiveFormRow>
        <Select
          control={control}
          label="Purpose of this step"
          name={`steps.${formIndex}.result.type`}
          width="300px"
          size="small"
          displayLabel={false}
          selectOptions={[
            { name: "Decide", value: ResultType.Decision },
            { name: "Get ideas, thoughts, or feedback", value: ResultType.Raw },
            { name: "Rank", value: ResultType.Ranking },
            { name: "Co-create shared understanding with AI ", value: ResultType.LlmSummary },
            { name: "Auto-approve a request", value: ResultType.AutoApprove },
          ]}
        />
      </ResponsiveFormRow>

      {resultType && (
        <>
          {isReusable && <RequestForm formMethods={useFormMethods} formIndex={formIndex} />}
          {resultType !== ResultType.AutoApprove && (
            <ResponseForm
              formMethods={useFormMethods}
              formIndex={formIndex}
              previousStepResult={previousStepResult}
            />
          )}
          {/* <ResponsePermissionsForm formMethods={useFormMethods} formIndex={formIndex} /> */}
          <ResultForm
            formMethods={useFormMethods}
            formIndex={formIndex}
            stepsArrayMethods={stepsArrayMethods}
          />
        </>
      )}
    </StepContainer>
  );
};
