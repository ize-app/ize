import { Button } from "@mui/material";
import { LogOutDocument } from "../graphql/generated/graphql";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Route } from "../routers/routes";

export const LogOut = () => {
  const navigate = useNavigate();
  const [logOut] = useMutation(LogOutDocument, {
    onCompleted: () => navigate(Route.Home), update: (cache) => cache.evict({
      id: "ROOT_QUERY",
      fieldName: "me",
    })
  });

  const handleClick = () => {
    logOut();
  };

  return (
    <div>
      <Button onClick={handleClick} variant="text">
        Log Out
      </Button>
    </div>
  );
};
