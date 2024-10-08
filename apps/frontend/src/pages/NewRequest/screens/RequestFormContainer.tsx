import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FieldAnswerRecordSchemaType } from "@/components/Form/formValidation/field";

import Loading from "../../../components/Loading";
import {
  FieldAnswer,
  FieldDataType,
  FieldType,
  Flow,
  FlowType,
  GetFlowDocument,
} from "../../../graphql/generated/graphql";
import * as Routes from "../../../routers/routes";
import { shortUUIDToFull } from "../../../utils/inputs";
import { RequestForm } from "../components/RequestForm";
import { RequestSchemaType } from "../formValidation";
import { useNewRequestWizardState } from "../newRequestWizard";

const getFreeInputDefaultValue = (
  defaultValue: FieldAnswer | undefined | null,
  dataType: FieldDataType,
) => {
  if (defaultValue)
    switch (defaultValue.__typename) {
      case "EntitiesFieldAnswer":
        return defaultValue.entities;
      case "FlowsFieldAnswer":
        return defaultValue.flows;
      case "FreeInputFieldAnswer":
        return defaultValue.value;
      case "WebhookFieldAnswer":
        return defaultValue;
      case "OptionFieldAnswer":
        return defaultValue.selections;
      default:
        return "";
    }
  else
    switch (dataType) {
      // case FieldDataType.Date:
      //   return new Date();
      // case FieldDataType.DateTime:
      //   return new Date();
      case FieldDataType.EntityIds:
        return [];
      case FieldDataType.FlowIds:
        return [];
      case FieldDataType.Number:
        return "";
      case FieldDataType.String:
        return "";
      default:
        return "";
    }
};

const createRequestFormState = (flow: Flow): RequestSchemaType => {
  const step = flow.steps[0];
  const requestFields: FieldAnswerRecordSchemaType = {};
  step.request.fields.forEach((field) => {
    if (field.__typename === FieldType.FreeInput) {
      const defaultValue = getFreeInputDefaultValue(field?.defaultAnswer, field.dataType);
      requestFields[field.fieldId] = {
        dataType: field.dataType,
        required: field.required,
        value: defaultValue,
      };
    } else if (field.__typename === FieldType.Options) {
      requestFields[field.fieldId] = {
        selectionType: field.selectionType,
        maxSelections: field.maxSelections,
        optionSelections: [],
      };
    }
  }, {});

  const newFormState = {
    flow,
    name: "",
    requestFields,
    requestDefinedOptions: [],
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
      setFormState((prev) => {
        return {
          ...prev,
          ...createRequestFormState(flow),
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

  // console.log("form errors are ", formMethods.formState.errors);
  // console.log("form state is ", formMethods.getValues());
  return <RequestForm />;
};
