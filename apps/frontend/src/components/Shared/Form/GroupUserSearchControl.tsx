import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";

import {
  AgentSummaryPartsFragment,
  AgentType,
  OrganizationPartsFragment,
} from "../../../graphql/generated/graphql";
import { Avatar } from "../Avatar";

interface GroupUserSearchControlProps {
  control: Control;
  name: string;
  label: string;
  agents: AgentSummaryPartsFragment[];
}

interface SearchOption {
  id: string;
  name: string;
  type: AgentType;
  organization?: OrganizationPartsFragment;
  icon: string | null | undefined;
}

export const GroupUserSearchControl = ({
  control,
  name,
  label,
  agents,
  ...props
}: GroupUserSearchControlProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl required>
          <Autocomplete
            multiple
            id="tags-filled"
            {...field}
            {...props}
            options={agents.map((agent) => ({
              id: agent.id,
              name: agent.name,
              type:
                agent.__typename === "Group" ? AgentType.Group : AgentType.User,
              icon: agent.icon,
              organization:
                agent.__typename === "Group" ? agent.organization : undefined,
            }))}
            getOptionLabel={(option: SearchOption) => option.name}
            onChange={(_event, data) => field.onChange(data)}
            isOptionEqualToValue={(
              option: SearchOption,
              value: SearchOption,
            ) => {
              return option.name === value.name;
            }}
            renderTags={(value: readonly SearchOption[], getTagProps) =>
              value.map((option: SearchOption, index: number) => (
                <Chip
                  avatar={<Avatar name={option.name} avatarUrl={option.icon} />}
                  variant="filled"
                  label={option.name}
                  color="primary"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "left",
                  alignItems: "center",
                  gap: "16px",
                  verticalAlign: "middle",
                }}
                {...props}
              >
                <Avatar
                  avatarUrl={option.icon}
                  name={option.name}
                  parent={option.organization}
                />
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {option.name}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                variant="outlined"
                placeholder="Add a group or person..."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                error={Boolean(error)}
              />
            )}
          />
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.message ?? ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};
