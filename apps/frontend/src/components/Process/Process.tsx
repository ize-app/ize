import { useParams } from "react-router-dom";

export const Process = () => {
  const { processId } = useParams();

  return <div>Process: {processId}</div>;
};
