import { FieldFragment, ResultConfigFragment, ResultType } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Field } from "./Field";

export const ResultConfig = ({
  resultConfig,
  field,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
}) => {

  switch (resultConfig.__typename) {
    case ResultType.Decision: {
      return (
        <>
          <Typography>Decision</Typography>
          {field && <Field field={field} />}
        </>
      );
    }
  }
};
