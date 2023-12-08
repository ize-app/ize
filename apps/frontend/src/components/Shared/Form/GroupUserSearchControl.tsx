import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";

import { AgentSummaryPartsFragment } from "../../../graphql/generated/graphql";
import { Avatar, AvatarProps, reformatAgentForAvatar } from "../Avatar";

interface GroupUserSearchControlProps {
  control: Control;
  name: string;
  label: string;
  agents: AgentSummaryPartsFragment[] | undefined;
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
            options={(agents ?? []).map((agent) => {
              const reformattedAgent = {
                ...reformatAgentForAvatar(agent),
              };
              return reformattedAgent;
            })}
            getOptionLabel={(option: AvatarProps) => option.name}
            onChange={(_event, data) => field.onChange(data)}
            isOptionEqualToValue={(option: AvatarProps, value: AvatarProps) => {
              return option.id === value.id;
            }}
            renderTags={(value: readonly AvatarProps[], getTagProps) =>
              value.map((option: AvatarProps, index: number) => {
                return (
                  <Chip
                    avatar={
                      <Avatar
                        id={option.id}
                        backgroundColor={option.backgroundColor}
                        name={option.name}
                        avatarUrl={option.parent?.avatarUrl ?? option.avatarUrl ?? ""}
                        type={option.type}
                      />
                    }
                    variant="filled"
                    label={option.name}
                    color="primary"
                    {...getTagProps({ index })}
                  />
                );
              })
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
                  id={option.id}
                  avatarUrl={option.avatarUrl}
                  name={option.name}
                  parent={option.parent}
                  backgroundColor={option.backgroundColor}
                  type={option.type}
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
