import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { FieldPath, FieldValues, PathValue, useFormContext } from "react-hook-form";

import {
  GetGroupsToWatchFlowDocument,
  GroupSummaryPartsFragment,
} from "@/graphql/generated/graphql";

import { MultiSelect } from "../formFields";

interface SelectGroupsToWatchFlowFormProps<T extends FieldValues> {
  flowId?: string;
  name: FieldPath<T>;
  entityIds: string[];
}

export const SelectGroupsToWatchFlowForm = <T extends FieldValues>({
  flowId,
  name,
  entityIds,
}: SelectGroupsToWatchFlowFormProps<T>) => {
  const { setValue } = useFormContext<T>();
  const [relevantGroups, setRelevantGroups] = useState<GroupSummaryPartsFragment[]>([]);
  const [otherGroups, setOtherGroups] = useState<GroupSummaryPartsFragment[]>([]);

  const groups = [...relevantGroups, ...otherGroups];

  useQuery(GetGroupsToWatchFlowDocument, {
    variables: {
      flowId,
      entities: entityIds,
    },
    onCompleted: (data) => {
      setRelevantGroups(data.getGroupsToWatchFlow.relevantGroups);
      setOtherGroups(data.getGroupsToWatchFlow.otherGroups);
    },
  });

  useEffect(() => {
    if (relevantGroups.length === 0) return;
    setValue(
      name,
      relevantGroups.map((group) => ({
        optionId: group.id,
      })) as PathValue<T, typeof name>,
    );
  }, [relevantGroups]);

  if (groups.length > 0) {
    return (
      <MultiSelect<T>
        name={name}
        label={"Select groups you'd like to watch this request"}
        options={groups.map((group) => ({
          optionId: group.id,
          value: { __typename: "StringValue", value: group.name },
        }))}
      />
    );
  }
};
