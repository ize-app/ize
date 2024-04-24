import { FieldValues, UseControllerProps } from "react-hook-form";
import { Box } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DragHandleIcon from "@mui/icons-material/DragHandle";

export interface SortableItemProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  index: number;
  id: string;
  onRemove: () => void;
}

export const SortableItem = <T extends FieldValues>({ label, id }: SortableItemProps<T>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <DragHandleIcon />
      {label}
    </Box>
  );
};
