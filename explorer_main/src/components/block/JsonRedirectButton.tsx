"use client";

import React from "react";
import { Button } from "@mui/material";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { NodeData } from "json-edit-react";
import { useRouter } from "next/navigation";

const JsonRedirectButton: React.FC<{ nodeData: NodeData }> = ({ nodeData }) => {
  // Only render the button if the key is "header_hash"
  if (nodeData.key !== "header_hash") return null;

  const headerHash = nodeData.value as string;
  const router = useRouter();

  return (
    <Button
      size="small"
      variant="text"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/block/${headerHash}`);
      }}
      sx={{ p: 0, minWidth: "unset" }}
    >
      <LaunchRoundedIcon fontSize="small" />
    </Button>
  );
};

export const JsonRedirectButtonDefinition = {
  condition: (key: string, value: any) => key === "header_hash",
  matches: (key: string, value: any): key is "header_hash" =>
    key === "header_hash",
  Element: JsonRedirectButton,
  onClick: (nodeData: NodeData, e: React.MouseEvent) => {
    console.log("Custom button onClick, key:", nodeData.key);
  },
};
