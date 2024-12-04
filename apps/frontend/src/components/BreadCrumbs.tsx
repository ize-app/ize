import { Breadcrumbs as MuiBreadCrumbs } from "@mui/material";
import { Link } from "react-router-dom";

export interface BreadCrumbItem {
  link: string;
  title: string;
}

export const Breadcrumbs = ({ items }: { items: BreadCrumbItem[] }) => {
  const ellipsisStyle = {
    minWidth: "0px",
    maxWidth: "20px", // Set your desired max width
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <MuiBreadCrumbs
      aria-label="breadcrumb"
      sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", marginBottom: "12px" }}
      separator="›"
    >
      {items.map((item, index) => {
        return (
          <Link key={"breadcrumb" + index} to={item.link} style={ellipsisStyle}>
            {item.title}
          </Link>
        );
      })}
      sup
    </MuiBreadCrumbs>
  );
};
