import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  ArrayPath,
  FieldArray,
  FieldValues,
  UseControllerProps,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";

import { SortableItem } from "./SortableItem";
import { TextField } from "../TextField";

export interface OptionProps {
  value: string;
  label: string;
}

export type SampleFormData = {
  textFields: { text: string }[];
};

interface SortableListProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  displayLabel?: boolean;
  options: OptionProps[];
  formMethods: UseFormReturn<T>;
}

// TODO: Lots of ts-ignore here. Not quite sure how to make fieldArray a generic type
export const SortableList = <T extends FieldValues>({
  control,
  name,
  options,
  label,
}: SortableListProps<T>) => {
  const { fields, append, move } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  useEffect(() => {
    if (fields.length === 0)
      options.forEach((option) => {
        append({ optionId: option.value } as FieldArray<T, ArrayPath<T>>);
      });
  }, []);

  return (
    <DndContext
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over == null) {
          return;
        }
        if (active.id !== over.id) {
          const oldIndex = fields.findIndex((field) => field.id === active.id);
          const newIndex = fields.findIndex((field) => field.id === over.id);
          move(oldIndex, newIndex);
        }
      }}
    >
      <SortableContext items={fields}>
        <Typography>{label}</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.map((field, index) => {
            const label =
              options.find((o) => {
                // @ts-expect-error //@ts-expect-error TODO unclear why this error is happening
                return field.optionId === o.value;
              })?.label ?? "";

            return (
              <>
                <TextField<T>
                  //@ts-expect-error TODO unclear why this error is happening
                  name={`${name}.${index}.optionId`}
                  key={"optionId" + name + index}
                  control={control}
                  sx={{ display: "none" }}
                  showLabel={false}
                  label={`Option ID - ignore`}
                  variant="standard"
                  disabled={true}
                  size="small"
                />

                <SortableItem key={field.id} id={field.id} label={label} index={index} />
              </>
            );
          })}
        </Box>
      </SortableContext>
    </DndContext>
  );
};
