import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Typography } from "@mui/material";

import { FreeInputValue } from "@/components/Field/FreeInputValue";
import { FieldDataType } from "@/graphql/generated/graphql";

export interface SortableItemProps {
  id: string;
  label: string;
  index: number;
  dataType: FieldDataType;
}

export const SortableItem = ({ id, label, index, dataType }: SortableItemProps) => {
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
        gap: 1,
        alignItems: "center",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <DragHandleIcon fontSize={"small"} />
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Typography>{(index + 1).toString() + ". "}</Typography>
        <FreeInputValue value={label} type={dataType} />
      </Box>
    </Box>
  );
};
