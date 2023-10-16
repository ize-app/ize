import { useParams } from "react-router-dom";
export const CreateRequest = () => {
  const { processId } = useParams();
  return <div>process is {processId}</div>;
};
