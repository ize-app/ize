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

import {
  AgentSummaryPartsFragment,
  AgentType,
  Me,
  NewAgentTypes,
} from "../../../graphql/generated/graphql";
import { Avatar } from "../Avatar";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { RoleModal } from "./ProcessForm/components/RoleModal";
import { GetFieldValues, SetFieldValue } from "./ProcessForm/wizardScreens/Roles";
import { MailOutline } from "@mui/icons-material";
import { DiscordLogoSvg, EthLogoSvg } from "../icons";
import { RecentAgentsContext } from "@/contexts/RecentAgentContext";

interface RoleSearchControlProps {
  control: Control;
  name: string;
  label: string;
  setFieldValue: SetFieldValue;
  getFieldValues: GetFieldValues;
}

export const RoleSearchControl = ({
  control,
  name,
  label,
  setFieldValue,
  getFieldValues,
  ...props
}: RoleSearchControlProps) => {
  const { me } = useContext(CurrentUserContext);
  const { recentAgents, setRecentAgents } = useContext(RecentAgentsContext);

  // Filtering discord roles since we don't yet have a good way of searching for other user's discord role
  const userIdentities = ((me as Me).identities as AgentSummaryPartsFragment[]).filter(
    (id) => !(id.__typename === "Identity" && id.identityType.__typename === "IdentityDiscord"),
  );

  const options = [...userIdentities, ...recentAgents];

  const [open, setOpen] = useState(false);
  const [roleModalType, setRoleModalType] = useState(NewAgentTypes.IdentityEmail);

  const onSubmit = (value: AgentSummaryPartsFragment[]) => {
    setRecentAgents(value);

    //@ts-ignore
    const currentState = getFieldValues(name) as AgentSummaryPartsFragment[];

    //@ts-ignore
    setFieldValue(name, [...currentState, ...value]);
  };

  return (
    <>
      {<RoleModal open={open} setOpen={setOpen} onSubmit={onSubmit} type={roleModalType} />}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
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
                      <Box
                        sx={{
                          padding: "8px 12px",
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<MailOutline color="primary" />}
                          onMouseDown={() => {
                            setRoleModalType(NewAgentTypes.IdentityEmail);
                            setOpen(true);
                          }}
                        >
                          Email address
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EthLogoSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewAgentTypes.IdentityBlockchain);
                            setOpen(true);
                          }}
                        >
                          Eth address
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DiscordLogoSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewAgentTypes.GroupDiscord);
                            setOpen(true);
                          }}
                        >
                          Discord @role
                        </Button>
                      </Box>
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
                            backgroundColor={
                              option.__typename === "Group" ? option.color : undefined
                            }
                            name={option.name}
                            avatarUrl={
                              option.__typename === "Group" && option.organization
                                ? option.organization.icon
                                : option.icon
                            }
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
                      avatarUrl={
                        option.__typename === "Group" && option.organization
                          ? option.organization.icon
                          : option.icon
                      }
                      name={option.name}
                      backgroundColor={option.__typename === "Group" ? option.color : undefined}
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
          );
        }}
      />
    </>
  );
};
