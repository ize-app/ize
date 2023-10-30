import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";

import { Avatar, UserDataProps } from "../Avatar";

interface Options {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  oragnization: Organization;
}

interface Organization {
  name: string;
  icon: string;
}

const options: UserDataProps[] = [
  {
    name: "Token Engineering Commons",
    avatarUrl:
      "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "poppe",
    avatarUrl:
      "https://cdn.discordapp.com/avatars/707707546114457641/3947a78996ba9e32703b635a40de6822.webp?size=240",
  },
  {
    name: "@core-team",
    avatarUrl: "",
    parent: {
      name: "Token Engineering Common",
      avatarUrl:
        "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
    },
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
            getOptionLabel={(option: UserDataProps) => option.name}
            onChange={(_event, data) => field.onChange(data)}
            isOptionEqualToValue={(
              option: UserDataProps,
              value: UserDataProps,
            ) => option.name === value.name}
            renderTags={(value: readonly UserDataProps[], getTagProps) =>
              value.map((option: UserDataProps, index: number) => (
                <Chip
                  avatar={
                    <Avatar
                      name={option.parent ? option.parent.name : option.name}
                      avatarUrl={
                        option.parent
                          ? option.parent.avatarUrl
                          : option.avatarUrl
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
                  avatarUrl={option.avatarUrl}
                  name={option.name}
                  parent={
                    option.parent
                      ? {
                          name: option.parent.name,
                          avatarUrl: option.parent.avatarUrl,
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
