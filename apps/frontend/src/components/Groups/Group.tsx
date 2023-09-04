import { useParams } from "react-router-dom";

export const Group = () => {
  const { groupId } = useParams();

  return (
    <div>
      Group {groupId}
    </div>
  );
};
