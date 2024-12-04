import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, FormLabel } from "@mui/material";
import { ArrayPath, FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form";

import { OptionFragment } from "@/graphql/generated/graphql";

import { SortableItem } from "./SortableItem";
import { TextField } from "../TextField";

interface SortableListProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  displayLabel?: boolean;
  options: OptionFragment[];
}

// step one: create formState and lose useEffect

// TODO: Lots of ts-ignore here. Not quite sure how to make fieldArray a generic type
export const SortableList = <T extends FieldValues>({
  name,
  options,
  label,
}: SortableListProps<T>) => {
  const { control } = useFormContext<T>();
  const { fields, move } = useFieldArray<T>({
    control,
    name: name as ArrayPath<T>,
  });

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
        <Box>
          {/* <Typography>{label}</Typography> */}
          {label ? (
            <FormLabel component="legend" id="radio-buttons-group-options">
              {label}
            </FormLabel>
          ) : null}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {fields.map((field, index) => {
              const option = options.find((o) => {
                //@ts-expect-error TODO unclear why this error is happening
                return field.optionId === o.optionId;
              });
              if(!option) return null;

              return (
                <Box key={field.id}>
                  <TextField<T>
                    //@ts-expect-error TODO unclear why this error is happening
                    name={`${name}.${index}.optionId`}
                    control={control}
                    sx={{ display: "none" }}
                    showLabel={false}
                    label={`Option ID - ignore`}
                    variant="standard"
                    disabled={true}
                    size="small"
                  />

                  <SortableItem id={field.id} value={option.value} index={index} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </SortableContext>
    </DndContext>
  );
};
