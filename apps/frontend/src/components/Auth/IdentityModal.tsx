import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useContext } from "react";

import { PermissionFragment } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { UserIdentities } from "@/pages/Settings/UserIdentities";
import { colors } from "@/style/style";

import { Permissions } from "../Permissions";

export interface IdentityState {
  permission: PermissionFragment | null | undefined;
  type: "request" | "response";
}

const IdentityModal = () => {
  const { me, identityModalState, setIdentityModalState } = useContext(CurrentUserContext);
  return (
    <Modal
      open={!!identityModalState}
      onClose={() => {
        setIdentityModalState(null);
      }}
      aria-labelledby="identity-modal"
      aria-describedby="identity-modal"
    >
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "400px",
          maxWidth: "800px",
          bgcolor: "background.paper",
          border: `2px solid ${colors.primaryContainer}`,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Typography variant="h2" sx={{ mb: "16px" }}>
            Missing permissions
          </Typography>
          {identityModalState?.permission && (
            <>
              <Typography variant="h3">
                {identityModalState?.type === "response" ? "Response" : "Trigger"} permissions
              </Typography>
              <Typography variant="description" sx={{ marginBottom: "8px" }}>
                Only the following people can{" "}
                {identityModalState?.type === "response" ? "respond" : "trigger this flow"}
              </Typography>
              <Permissions type="request" permission={identityModalState?.permission}></Permissions>
              <Typography variant="h3" sx={{ marginTop: "20px" }}>
                Your identies
              </Typography>
              <Typography variant="description" sx={{ marginBottom: "8px" }}>
                Connect additional identities to{" "}
                {identityModalState?.type === "response" ? "respond" : "trigger this flow"}
              </Typography>
              <UserIdentities identities={me?.identities} />
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default IdentityModal;
