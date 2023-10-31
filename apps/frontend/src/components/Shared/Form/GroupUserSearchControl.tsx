import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";

import { AgentType } from "../../../graphql/generated/graphql";
import { ProcessOption } from "../../NewProcess/newProcessWizard";
import { Avatar } from "../Avatar";

const options: ProcessOption[] = [
  {
    id: "0ec840c7-f906-4470-8b2b-2af9ca74a4cf",
    name: "Token Engineering Commons",
    type: AgentType.Group,
    icon: "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
  },
  {
    id: "4f18f7dd-5111-4288-91fa-7a6fcfe32281",
    name: "poppe",
    type: AgentType.User,
    icon: "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
  },
  {
    id: "4f18f7dd-5111-4288-91fa-7a6fcfe32281",
    name: "@core-team",
    type: AgentType.User,
    icon: "",
  },
];

interface GroupUserSearchControlProps {
  control: Control;
  name: string;
  label: string;
}

export const GroupUserSearchControl = ({
  control,
  name,
  label,
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
            options={options}
            getOptionLabel={(option: ProcessOption) => option.name}
            onChange={(_event, data) => field.onChange(data)}
            isOptionEqualToValue={(
              option: ProcessOption,
              value: ProcessOption,
            ) => option.name === value.name}
            renderTags={(value: readonly ProcessOption[], getTagProps) =>
              value.map((option: ProcessOption, index: number) => (
                <Chip
                  avatar={
                    <Avatar
                      name={option.name}
                      avatarUrl={
                        option.oragnization
                          ? option.oragnization.icon
                          : option.icon
                      }
                    />
                  }
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
                  parent={
                    option.oragnization
                      ? {
                          name: option.oragnization.name,
                          avatarUrl: option.oragnization.icon,
                        }
                      : undefined
                  }
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
