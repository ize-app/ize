import { FieldAnswerFragment, FieldFragment, FieldType } from "@/graphql/generated/graphql";
import { AnswerFreeInput } from "./AnswerFreeInput";
import { FieldOptions } from "./FieldOptions";

export const Answer = ({
  field,
  fieldAnswer,
}: {
  field: FieldFragment;
  fieldAnswer: FieldAnswerFragment;
}) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      if (fieldAnswer.__typename !== "FreeInputFieldAnswer") return null;
      return <AnswerFreeInput answer={fieldAnswer.value} dataType={field.dataType} />;
    }
    case FieldType.Options: {
      if (fieldAnswer.__typename !== "OptionFieldAnswer") return null;
      return (
        <FieldOptions
          fieldOptions={field}
          optionSelections={fieldAnswer.selections}
          final={true}
          onlyShowSelections={true}
        />
      );
    }
  }
};
