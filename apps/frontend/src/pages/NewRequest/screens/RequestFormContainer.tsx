import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createInputRecordsFormState } from "@/components/Form/InputField/createFormState/createInputRecordsFormState";

import Loading from "../../../components/Loading";
import { FieldFragment, Flow, FlowType, GetFlowDocument } from "../../../graphql/generated/graphql";
import * as Routes from "../../../routers/routes";
import { shortUUIDToFull } from "../../../utils/inputs";
import { RequestForm } from "../components/RequestForm";
import { useNewRequestWizardState } from "../newRequestWizard";
import { RequestSchemaType } from "../requestValidation";

const createRequestFormState = (flow: Flow): RequestSchemaType => {
  const requestFields = createInputRecordsFormState({
    fields: flow.fieldSet.fields as FieldFragment[],
  });

  const newFormState: RequestSchemaType = {
    requestId: crypto.randomUUID(),
    name: "",
    requestFields,
    requestDefinedOptions: {},
    watch: false,
  };
  return newFormState;
};

export const RequestFormContainer = () => {
  const { formState, setFormState, setParams } = useNewRequestWizardState();
  const { flowId: shortFlowId } = useParams();

  useEffect(() => setParams({ flowId: shortFlowId }), [shortFlowId, setParams]);

  const flowId = shortUUIDToFull(shortFlowId as string);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
    },
    onCompleted: (data) => {
      const flow = data.getFlow as Flow;
      console.log("flow", flow);
      //@ts-expect-error not sure why typechecking is broken here
      setFormState((prev) => {
        return {
          ...prev,
          flow,
          request: { ...createRequestFormState(flow) },
        };
      });
    },
  });

  const onError = () => {
    navigate(Routes.newRequestRoute(Routes.NewRequestRoute.SelectFlow));
  };

  const flow = data?.getFlow as Flow;

  // Users shouldn't be able to create requests for evolve flows directly in the UI
  if (flow && flow.type === FlowType.Evolve)
    navigate(Routes.newRequestRoute(Routes.NewRequestRoute.SelectFlow));

  if (error) onError();

  if (!formState.flow || loading) {
    return <Loading />;
  }

  return <RequestForm />;
};
