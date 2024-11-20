import { Typography } from "@mui/material";

import { FieldAnswerFragment, FieldFragment, FieldType } from "@/graphql/generated/graphql";

import { AnswerFreeInput } from "./AnswerFreeInput";
import { FieldOptions } from "./FieldOptions";
import { EntityList } from "../EntityList";
import { FlowsList } from "../FlowsList";
import { LabeledGroupedInputs } from "../Form/formLayout/LabeledGroupedInputs";

export const Answer = ({
  field,
  fieldAnswer,
}: {
  field: FieldFragment;
  fieldAnswer: FieldAnswerFragment;
}) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      if (fieldAnswer.__typename === "FreeInputFieldAnswer")
        return <AnswerFreeInput answer={fieldAnswer.value} dataType={field.dataType} />;
      else if (fieldAnswer.__typename === "EntitiesFieldAnswer") {
        return <EntityList entities={fieldAnswer.entities} />;
      } else if (fieldAnswer.__typename === "FlowsFieldAnswer") {
        return <FlowsList flows={fieldAnswer.flows} />;
      } else if (fieldAnswer.__typename === "WebhookFieldAnswer") {
        return (
          <Typography fontSize={".875rem"}>
            {fieldAnswer.uri
              ? `${fieldAnswer.uri} (full webhook not publicly viewable)`
              : "No notification webhook"}
          </Typography>
        );
      } else return null;
    }
    case FieldType.Options: {
      if (fieldAnswer.__typename !== "OptionFieldAnswer") return null;

      return (
        <LabeledGroupedInputs sx={{ backgroundColor: "white" }}>
          <FieldOptions
            fieldOptions={field}
            optionSelections={fieldAnswer.selections}
            final={true}
            onlyShowSelections={true}
          />
        </LabeledGroupedInputs>
      );
    }
  }
};
