import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GroupDocument } from "../../graphql/generated/graphql";

export const Group = () => {
  const { groupId } = useParams();

  const { data } = useQuery(GroupDocument, {
    variables: {
      id: groupId ?? "",
    },
  });

  return <div>Group {data?.group?.name}</div>;
};
