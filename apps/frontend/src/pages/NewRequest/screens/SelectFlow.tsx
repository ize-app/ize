import { useNavigate } from "react-router-dom";

import { FlowsSearch } from "@/pages/Flows/FlowsSearch";

import { fullUUIDToShort } from "../../../utils/inputs";
import { useNewRequestWizardState } from "../newRequestWizard";

export const SelectFlow = () => {
  const navigate = useNavigate();
  const { setParams } = useNewRequestWizardState();

  return (
    <FlowsSearch
      onClickRow={(flow) => {
        setParams({ flowId: fullUUIDToShort(flow.flowId) });
        navigate(fullUUIDToShort(flow.flowId));
      }}
      onlyShowTriggerable={true}
      hideWatchButton={true}
    />
  );
};
