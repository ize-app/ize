import { useEffect } from "react";
import {
  useFieldArray,
  FieldValues,
  UseControllerProps,
  ArrayPath,
  UseFormReturn,
  FieldArray,
} from "react-hook-form";
import { Stack, Typography } from "@mui/material";
import { SortableItem } from "./SortableItem";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { OptionSelectionSchemaType } from "../../formValidation/field";

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

export const SortableList = <T extends FieldValues>({
  control,
  name,
  options,
  formMethods,
}: SortableListProps<T>) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
  });

  useEffect(() => {
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
        <Typography>Rank Component!</Typography>
        <Stack spacing={2}>
          {fields.map((field, index) => {
            const option = formMethods.watch(
              // @ts-ignore
              `${name}.${index}`,
            ) as unknown as OptionSelectionSchemaType;
            const label =
              options.find((o) => {
                return option.optionId === o.value;
              })?.label ?? "";
            return (
              <>
                <SortableItem
                  key={field.id}
                  id={field.id}
                  label={label}
                  //@ts-ignore
                  control={control}
                  index={index}
                  onRemove={() => remove(index)}
                />
              </>
            );
          })}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};
