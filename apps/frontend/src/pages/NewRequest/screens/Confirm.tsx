import { zodResolver } from "@hookform/resolvers/zod";
import { FormLabel } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Switch } from "@/components/Form/formFields";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewRequestWizardState } from "../newRequestWizard";
import { RequestSchemaType } from "../requestValidation";
import { RequestWatchFlowSchemaType, requestWatchFlowSchema } from "../watchFlowValidation";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel, disableNext, setFormState, formState } =
    useNewRequestWizardState();
  const formMethods = useForm<RequestWatchFlowSchemaType>({
    defaultValues: { watch: false },
    resolver: zodResolver(requestWatchFlowSchema),
    shouldUnregister: false,
  });

  const [shouldCallNext, setShouldCallNext] = useState(false);

  useEffect(() => {
    if (shouldCallNext) {
      onNext(); // Call onNext after formState is updated
      setShouldCallNext(false); // Reset the flag
    }
  }, [shouldCallNext]);

  const onSubmit = (data: RequestWatchFlowSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      request: { ...prev.request, watch: data.watch } as RequestSchemaType,
    }));
    setShouldCallNext(true);
  };

  return (
    <FormProvider {...formMethods}>
      <WizardBody>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Box sx={{ maxWidth: "800px" }}>Submit to trigger this flow.</Box>
          {!formState.flow?.watching.user && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <FormLabel>
                Would you like to stay updated when this flow is triggered in the future?
              </FormLabel>
              <Switch
                label={"Watch this flow"}
                name={"watch"}
                sx={{ marginLeft: "8px", width: "300px" }}
              />
            </Box>
          )}
        </Box>
      </WizardBody>

      <WizardNav
        nextLabel={nextLabel}
        onPrev={onPrev}
        onNext={formMethods.handleSubmit(onSubmit)}
        disableNext={disableNext}
      />
    </FormProvider>
  );
};
