"use client";

import React from "react";
import { Button } from "@mui/material";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { NodeData } from "json-edit-react";
import { useRouter } from "next/navigation";

interface JsonRedirectButtonProps {
  nodeData: NodeData;
  headerHash: string; // Pass headerHash explicitly
}

const JsonRedirectButton: React.FC<JsonRedirectButtonProps> = ({
  nodeData,
  headerHash,
}) => {
  const router = useRouter();

  // Only render the button if the key is "header_hash" or "hash"
  if (nodeData.key !== "header_hash" && nodeData.key !== "hash") return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (nodeData.key === "header_hash") {
      // For "header_hash", use nodeData.value as headerHash
      const localHeaderHash = nodeData.value as string;
      router.push(`/block/${localHeaderHash}?type=headerHash`);
    } else if (nodeData.key === "hash") {
      // For "hash", nodeData.value is the workPackageHash
      const workPackageHash = nodeData.value as string;
      console.log("headerHash is: ", headerHash);
      console.log("workPackageHash is: ", workPackageHash);
      router.push(`/block/${headerHash}/workReport/${workPackageHash}`);
    }
  };

  return (
    <Button
      size="small"
      variant="text"
      onClick={handleClick}
      sx={{ p: 0, minWidth: "unset" }}
    >
      <LaunchRoundedIcon fontSize="small" />
    </Button>
  );
};

export const JsonRedirectButtonDefinition = {
  condition: (key: string, value: unknown) =>
    key === "header_hash" || key === "hash",
  matches: (key: string, value: unknown): key is "header_hash" | "hash" =>
    key === "header_hash" || key === "hash",
  Element: JsonRedirectButton,
  onClick: (nodeData: NodeData, e: React.MouseEvent) => {
    console.log("Custom button onClick, key:", nodeData.key);
  },
};

export default JsonRedirectButton;
