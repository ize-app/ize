import { zodResolver } from "@hookform/resolvers/zod";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { WizardNav } from "@/components/Wizard";
import { generateEvolveConfig } from "@/pages/NewFlow/generateNewFlowConfig/generateEvolveConfig";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { Switch } from "../../formFields";
import { FlowForm, FlowFormRef } from "../FlowForm";
import { ReusableSchema, reusableSchema } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";
import { defaultFlowFormValues } from "../helpers/getDefaultFormValues";

export const FullConfigSetup = ({ evolve = false }: { evolve?: boolean }) => {
  const form1Ref = useRef<FlowFormRef>(null);
  const form2Ref = useRef<FlowFormRef>(null);
  const MemoizedFlowForm = memo(FlowForm);

  return (
    <FullConfig
      evolve={evolve}
      form1Ref={form1Ref}
      form2Ref={form2Ref}
      // tabs={tabs}
      flowForm={
        <MemoizedFlowForm
          ref={form1Ref}
          name="flow"
          isReusable={true}
          defaultFormValues={{ ...defaultFlowFormValues }}
        />
      }
      evolveForm={
        <MemoizedFlowForm
          ref={form2Ref}
          name="evolve"
          isReusable={true}
          defaultFormValues={generateEvolveConfig({
            permission: { type: PermissionType.Entities, entities: [] },
          })}
        />
      }
    />
  );
};

export const FullConfig = ({
  evolve = false,
  form1Ref,
  form2Ref,
  flowForm,
  evolveForm,
  // tabs,
}: {
  evolve?: boolean;
  form1Ref: React.RefObject<FlowFormRef>;
  form2Ref: React.RefObject<FlowFormRef>;
  flowForm: React.ReactElement;
  evolveForm: React.ReactElement;
  // tabs: TabProps[];
}) => {
  const { onPrev, nextLabel, onNext, formState, setFormState } = useNewFlowWizardState();
  const [currentTabIndex, setTabIndex] = useState(0);
  const [flowError, setFlowError] = useState(false);
  const [evolveError, setEvolveError] = useState(false);

  const formMethods = useForm<ReusableSchema>({
    defaultValues: {
      reusable: formState.new.reusable ?? false,
    },
    resolver: zodResolver(reusableSchema),
    shouldUnregister: false,
  });
  // const [evolveFlowError, setEvolveFlowError] = useState(false);
  const isReusable = formMethods.watch("reusable");
  // const isReusable = true;

  useEffect(() => {
    if (!isReusable) setTabIndex(0);
  }, [isReusable]);

  const handleAllFormsSubmit = useCallback(async () => {
    const isReusable = formMethods.getValues("reusable");
    if (form1Ref.current && form2Ref.current) {
      const { isValid: flowIsValid, values: flow } = await form1Ref.current.validate();
      const { isValid: evolveIsValid, values: evolve } = isReusable
        ? await form2Ref.current.validate()
        : { isValid: true, values: undefined };

      const reusableFormIsValid = await formMethods.trigger();
      const reusableForm = formMethods.getValues();

      if (flowIsValid && evolveIsValid && reusableFormIsValid) {
        setFormState((prev) => ({
          ...prev,
          new: { flow, evolve, reusable: reusableForm.reusable },
        }));
        onNext();
      } else {
        setFlowError(!flowIsValid);
        setEvolveError(!evolveIsValid);
      }
    }
  }, []);

  const tabs: TabProps[] = [
    {
      title: "Flow",
      content: flowForm,
      icon: flowError ? <WarningIcon fontSize="small" /> : undefined,
    },
    {
      title: "Evolve Flow",
      content: evolveForm,
      icon: evolveError ? <WarningIcon fontSize="small" /> : undefined,
    },
  ];

  const displayedTabs = isReusable ? tabs : tabs.slice(0, 1);

  return (
    <>
      <Box>
        <FormProvider {...formMethods}>
          {!evolve && (
            <form style={{ padding: "16px" }}>
              <Switch<ReusableSchema> name={`reusable`} label="Flow can be reused" />
            </form>
          )}
        </FormProvider>
        <Tabs
          tabs={displayedTabs}
          currentTabIndex={currentTabIndex}
          handleChange={(_event: React.SyntheticEvent, newValue: number) => {
            setTabIndex(newValue);
          }}
        />

        {tabs.map((tab: TabProps, index) => (
          <TabPanel value={currentTabIndex} index={index} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
      {/* <FlowForm ref={form1Ref} name="flow" /> */}
      <WizardNav onNext={handleAllFormsSubmit} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
