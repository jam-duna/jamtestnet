import React from "react";
import { Typography } from "@mui/material";
import { truncateHash } from "@/utils/helper";

// ToggleHash component: shows a truncated hash by default, toggles on click.
interface ToggleHashProps {
  hash: string;
}
export default function ToggleHash({ hash }: ToggleHashProps) {
  const [expanded, setExpanded] = React.useState(false);
  const handleToggle = () => setExpanded(!expanded);
  return (
    <Typography
      variant="body2"
      onClick={handleToggle}
      sx={{ cursor: "pointer", display: "inline" }}
      title="Click to toggle full hash"
    >
      {expanded ? hash : truncateHash(hash)}
    </Typography>
  );
}
