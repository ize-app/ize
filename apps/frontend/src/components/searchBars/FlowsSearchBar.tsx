import { ToggleButton } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

import Search from "@/components/Tables/Search";
import { FlowTriggerPermissionFilter, WatchFilter } from "@/graphql/generated/graphql.ts";

export const FlowsSearchBar = ({
  searchQuery,
  triggerPermissionFilter,
  watchFilter,
  setWatchFilter,
  setSearchQuery,
  setTriggerPermissionFilter,
  hideTriggerFilterButton,

}: {
  searchQuery: string;
  triggerPermissionFilter: FlowTriggerPermissionFilter;
  watchFilter: WatchFilter;
  setWatchFilter: Dispatch<SetStateAction<WatchFilter>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setTriggerPermissionFilter: Dispatch<SetStateAction<FlowTriggerPermissionFilter>>;
  hideTriggerFilterButton: boolean;
}) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        width: "100%",
        // maxWidth: "500px",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
        },
      })}
    >
      <Search
        searchQuery={searchQuery}
        changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(event.target.value);
        }}
      />
      <Box sx={{ display: "flex", gap: "8px" }}>
        {!hideTriggerFilterButton && (
          <ToggleButton
            size="small"
            value="check"
            selected={triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission}
            sx={{ width: "140px" }}
            color="primary"
            onChange={() => {
              // setSelected(!selected);
              setTriggerPermissionFilter(
                triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission
                  ? FlowTriggerPermissionFilter.All
                  : FlowTriggerPermissionFilter.TriggerPermission,
              );
            }}
          >
            Trigger permission
          </ToggleButton>
        )}

        <ToggleButton
          size="small"
          value={watchFilter}
          selected={watchFilter === WatchFilter.Watched}
          sx={{ width: "140px" }}
          color="primary"
          onChange={() => {
            setWatchFilter(
              watchFilter === WatchFilter.Watched ? WatchFilter.All : WatchFilter.Watched,
            );
          }}
        >
          Watched flows
        </ToggleButton>
      </Box>
    </Box>
  );
};
