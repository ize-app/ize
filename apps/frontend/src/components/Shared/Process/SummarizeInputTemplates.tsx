import Typography from "@mui/material/Typography";

import { InputTemplateArgs } from "../../../graphql/generated/graphql";

const SummarizeInputTemplates = ({
  inputs,
  variant = "body1",
}: {
  inputs: InputTemplateArgs[];
  variant?: "body1" | "body2";
}) => {
  return (
    <ul style={{ padding: "0px 10px" }}>
      {inputs.map((input, index) => (
        <li key={input.name + index.toString()}>
          <Typography variant={variant}>
            <span style={{ fontWeight: 500 }}>{input.name}</span> ({input.type}
            ): {input.description}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

export default SummarizeInputTemplates;
