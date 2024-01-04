import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller } from "react-hook-form";
import { useContext, useState } from "react";

import { AgentSummaryPartsFragment, AgentType, Me } from "../../../graphql/generated/graphql";
import { Avatar } from "../Avatar";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { RoleModal } from "./ProcessForm/components/RoleModal";
import { SetFieldValue } from "./ProcessForm/wizardScreens/Roles";

interface RoleSearchControlProps {
  control: Control;
  name: string;
  label: string;
  agents: AgentSummaryPartsFragment[] | undefined;
  setFieldValue: SetFieldValue;
}

export const RoleSearchControl = ({
  control,
  name,
  label,
  agents,
  setFieldValue,
  ...props
}: RoleSearchControlProps) => {
  const { me } = useContext(CurrentUserContext);
  const userIdentities = (me as Me).identities as AgentSummaryPartsFragment[];

  const [options, setOptions] = useState<AgentSummaryPartsFragment[]>([
    ...(agents ?? []),
    ...userIdentities,
  ]);

  const [open, setOpen] = useState(false);

  const onSubmit = (value: AgentSummaryPartsFragment[]) => {
    setOptions((prev) => [...prev, ...value]);
    //@ts-ignore
    setFieldValue(name, value);
  };

  return (
    <>
      <RoleModal open={open} setOpen={setOpen} onSubmit={onSubmit} />
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl required>
            <Autocomplete
              includeInputInList={true}
              multiple
              id="tags-filled"
              {...field}
              {...props}
              options={options}
              getOptionLabel={(option: AgentSummaryPartsFragment) => option.name}
              onChange={(_event, data) => field.onChange(data)}
              isOptionEqualToValue={(
                option: AgentSummaryPartsFragment,
                value: AgentSummaryPartsFragment,
              ) => {
                return option.id === value.id;
              }}
              PaperComponent={({ children }) => {
                return (
                  <Paper>
                    <Button
                      color="primary"
                      fullWidth
                      sx={{ justifyContent: "flex-start", pl: 2 }}
                      onMouseDown={() => {
                        setOpen(true);
                      }}
                    >
                      + Add New
                    </Button>
                    {children}
                  </Paper>
                );
              }}
              renderTags={(value: readonly AgentSummaryPartsFragment[], getTagProps) =>
                value.map((option: AgentSummaryPartsFragment, index: number) => {
                  return (
                    <Chip
                      avatar={
                        <Avatar
                          id={option.id}
                          // backgroundColor={option.backgroundColor}
                          name={option.name}
                          avatarUrl={option.icon}
                          type={option.__typename as AgentType}
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
                    avatarUrl={option.icon}
                    name={option.name}
                    //   parent={option.parent}
                    //   backgroundColor={option.backgroundColor}
                    type={option.__typename as AgentType}
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
                  placeholder="Add a group or identity..."
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
    </>
  );
};
