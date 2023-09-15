import { useParams } from "react-router-dom";

export const Request = () => {
  const { requestId } = useParams();

  return <div>Request: {requestId}</div>;
};
