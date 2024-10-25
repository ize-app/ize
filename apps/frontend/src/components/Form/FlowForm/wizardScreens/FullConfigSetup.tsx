import { zodResolver } from "@hookform/resolvers/zod";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { WizardNav } from "@/components/Wizard";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { Switch } from "../../formFields";
import { FlowForm, FlowFormRef } from "../FlowForm";
import { ReusableSchema, reusableSchema } from "../formValidation/flow";

export const FullConfigSetup = ({ evolve = false }: { evolve?: boolean }) => {
  const { onPrev, nextLabel, formState } = useNewFlowWizardState();
  const [currentTabIndex, setTabIndex] = useState(0);
  const [flowError, setFlowError] = useState(false);
  const formMethods = useForm<ReusableSchema>({
    defaultValues: {
      reusable: formState.new.reusable ?? false,
    },
    resolver: zodResolver(reusableSchema),
    shouldUnregister: false,
  });
  // const [evolveFlowError, setEvolveFlowError] = useState(false);
  const isReusable = formMethods.watch("reusable");

  const form1Ref = useRef<FlowFormRef>(null);
  const form2Ref = useRef<FlowFormRef>(null);

  // useEffect(() => {
  //   console.log("form1Ref.current", form1Ref.current);
  // }, [form1Ref]);

  // useEffect(() => {
  //   console.log("form2Ref.current", form2Ref.current);
  // }, [form2Ref]);

  const handleAllFormsSubmit = () => {
    if (!form1Ref.current) console.log("form1Ref.current is null");
    if (form1Ref.current) {
      setFlowError(form1Ref.current.getErrors());
      form1Ref.current.submit();
    }
    // if (form2Ref.current) form2Ref.current.submit();
    // also add submit for reusable
  };

  const flowForm = <FlowForm ref={form1Ref} name="flow" isReusable={isReusable} />;

  const tabs: TabProps[] = [
    {
      title: "Flow",
      content: flowForm,
      icon: flowError ? formState.new.flow && <WarningIcon fontSize="small" /> : undefined,
    },
  ];

  if (isReusable)
    tabs.push({
      title: "Evolve Flow",
      content: formState.new.evolve && <FlowForm ref={form2Ref} name="evolve" isReusable={true} />,
    });

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
          tabs={tabs}
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
