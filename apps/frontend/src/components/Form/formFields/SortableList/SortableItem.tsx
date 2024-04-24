import { Box, Typography } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DragHandleIcon from "@mui/icons-material/DragHandle";

export interface SortableItemProps {
  id: string;
  label: string;
  index: number;
}

export const SortableItem = ({ id, label, index }: SortableItemProps) => {
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
      <Typography>
        {(index + 1).toString() + ". "}
        {label}
      </Typography>
    </Box>
  );
};
