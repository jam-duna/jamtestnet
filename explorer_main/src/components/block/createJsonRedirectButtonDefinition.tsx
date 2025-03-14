// createJsonRedirectButtonDefinition.ts
import { NodeData } from "json-edit-react";
import JsonRedirectButton from "./JsonRedirectButton";

export const createJsonRedirectButtonDefinition = (headerHash: string) => {
  console.log("the header is:");
  console.log(headerHash);

  return {
    condition: (key: string, value: any) =>
      key === "header_hash" || key === "hash",
    matches: (key: string, value: any): key is "header_hash" | "hash" =>
      key === "header_hash" || key === "hash",
    // Wrap the JsonRedirectButton and supply headerHash as a prop.
    Element: (props: { nodeData: NodeData }) => (
      <JsonRedirectButton {...props} headerHash={headerHash} />
    ),
    onClick: (nodeData: NodeData, e: React.MouseEvent) => {
      console.log("Custom button onClick, key:", nodeData.key);
    },
  };
};
