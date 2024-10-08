import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const CopyToClipboardButton = ({ textComponent }: { textComponent: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");

  useEffect(() => {
    setText(extractTextFromComponent(textComponent));
  }, [textComponent]);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <Box style={{ display: "inline-block" }}>
      <Box
        color={(style) => style.palette.primary.main}
        sx={{
          display: "inline-flex", // Set display to inline-flex
          gap: "12px",
          border: "1px solid",
          alignItems: "center",
          padding: "2px 8px",
        }}
      >
        {/* <Typography>{text}</Typography>
         */}
        <Typography>{textComponent}</Typography>

        <IconButton onClick={handleClick} color="primary" size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </Box>
  );
};

const extractTextFromComponent = (component: React.ReactNode) => {
  const markup = renderToStaticMarkup(component);
  const div = document.createElement("div");
  div.innerHTML = markup;
  return div.textContent || div.innerText;
};

export default CopyToClipboardButton;
