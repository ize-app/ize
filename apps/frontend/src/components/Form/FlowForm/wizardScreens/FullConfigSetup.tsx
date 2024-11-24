import { zodResolver } from "@hookform/resolvers/zod";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { WizardNav } from "@/components/Wizard";
import { generateEvolveConfig } from "@/pages/NewFlow/generateNewFlowConfig/generateEvolveConfig";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { Switch } from "../../formFields";
import { FlowForm, FlowFormRef } from "../FlowForm";
import { ReusableSchema, reusableSchema } from "../formValidation/flow";
import { getDefaultFlowFormValues } from "../helpers/getDefaultFormValues";

export const FullConfigSetup = ({ evolve = false }: { evolve?: boolean }) => {
  // refs expose methods of child forms
  const flowFormRef = useRef<FlowFormRef>(null);
  const evolveFormRef = useRef<FlowFormRef>(null);

  return (
    <FullConfig
      evolve={evolve}
      flowFormRef={flowFormRef}
      evolveFormRef={evolveFormRef}
      // tabs={tabs}
      flowForm={
        <FlowForm
          ref={flowFormRef}
          name="flow"
          isReusable={true}
          defaultFormValues={{ ...getDefaultFlowFormValues() }}
        />
      }
      evolveForm={
        <FlowForm
          ref={evolveFormRef}
          name="evolve"
          isReusable={true}
          defaultFormValues={generateEvolveConfig({
            triggerPermission: { anyone: false, entities: [] },
            respondPermission: { anyone: false, entities: [] },
          })}
        />
      }
    />
  );
};

export const FullConfig = ({
  evolve = false,
  flowFormRef,
  evolveFormRef,
  flowForm,
  evolveForm,
  // tabs,
}: {
  evolve?: boolean;
  flowFormRef: React.RefObject<FlowFormRef>;
  evolveFormRef: React.RefObject<FlowFormRef>;
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

  const isReusable = formMethods.watch("reusable");

  useEffect(() => {
    if (!isReusable) setTabIndex(0);
  }, [isReusable]);

  const handleAllFormsSubmit = async () => {
    const isReusable = formMethods.getValues("reusable");
    if (flowFormRef.current && (isReusable ? evolveFormRef.current : true)) {
      const { isValid: flowIsValid, values: flow } = await flowFormRef.current.validate();

      const { isValid: evolveIsValid, values: evolve } =
        isReusable && evolveFormRef.current
          ? await evolveFormRef.current.validate()
          : { isValid: true, values: undefined };

      const reusableFormIsValid = await formMethods.trigger();
      const reusableForm = reusableSchema.parse(formMethods.getValues());

      if (flowIsValid && evolveIsValid && reusableFormIsValid) {
        // didn't call setFormState within each child form to avoid unnecessary re-renders
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
  };

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
