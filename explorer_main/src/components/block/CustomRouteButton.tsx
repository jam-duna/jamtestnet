"use client";

import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { NodeData } from "json-edit-react"; // Use the library's NodeData type

const RouteButton: React.FC<{ nodeData: NodeData }> = ({ nodeData }) => {
  const router = useRouter();
  // For demonstration, assume the target URL is stored in nodeData.value
  // You might need to adjust this logic depending on your data structure.
  const target =
    typeof nodeData.value === "string" && nodeData.value.startsWith("http")
      ? nodeData.value
      : "/";

  return (
    <Button
      size="small"
      variant="outlined"
      onClick={(e) => {
        e.stopPropagation();
        router.push(target);
      }}
    >
      {">"}
    </Button>
  );
};

export const CustomRouteButtonDefinition = {
  condition: (key: string, value: any) =>
    !!value && typeof value === "object" && !!value.target,
  matches: (key: string, value: any): key is string => true,
  Element: RouteButton,
  onClick: (nodeData: NodeData, e: React.MouseEvent) => {
    // No-op because RouteButton handles its own onClick.
  },
};
