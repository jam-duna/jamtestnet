"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import { ThetaItem } from "@/types";
import ReportTable from "./ReportTable";
import { truncateHash } from "@/utils/helper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ToggleHash component: shows a truncated hash by default, toggles on click.
interface ToggleHashProps {
  hash: string;
}
const ToggleHash: React.FC<ToggleHashProps> = ({ hash }) => {
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
};

interface DependenciesProps {
  list: string[];
}

const Dependencies: React.FC<DependenciesProps> = ({ list }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">Dependencies</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {list.map((dependency, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <ToggleHash hash={dependency} />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

interface ThetaTableProps {
  data: ThetaItem;
}

export default function ThetaTable({ data }: ThetaTableProps) {
  return (
    <Box sx={{ my: 4 }}>
      {data.map((group, idx) => {
        // Since your theta data is an array of arrays, check if group is an array and non-empty.
        if (!Array.isArray(group) || group.length === 0) return null;
        return (
          <Box key={idx} sx={{ mb: 4 }}>
            {group.map((item, i) => {
              if (!item) return null;
              const { report, dependencies } = item;
              return (
                <Box key={i} sx={{ mb: 2 }}>
                  {dependencies && dependencies.length > 0 && (
                    <Dependencies list={dependencies} />
                  )}
                  <ReportTable data={report} idx={i} />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
