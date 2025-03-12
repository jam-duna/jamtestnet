"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ToggleHash from "../ToggleHashText";
import ReportTable from "./ReportTable";
import { ThetaItem } from "@/types";

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
  headerHash: string;
}

export default function ThetaTable({ data, headerHash }: ThetaTableProps) {
  return (
    <Box sx={{ my: 4 }}>
      {data.map((group, idx) => {
        // Check if group is a non-empty array.
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
                  <ReportTable data={report} idx={i} headerHash={headerHash} />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}
