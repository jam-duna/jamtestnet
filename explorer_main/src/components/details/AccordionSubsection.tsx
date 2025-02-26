import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface AccordionSubSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

function AccordionSubSection({
  title,
  count,
  children,
}: AccordionSubSectionProps) {
  return (
    <Accordion
      disableGutters
      sx={{
        py: 1,
        border: "none",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          py: 0,
          minHeight: "auto",
          "& .MuiAccordionSummary-content": { m: 0, p: 0 },
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={`${title} details`}>
            <IconButton size="small" sx={{ mr: 1 }} component="span">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1">
            {title} ({count})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, m: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

export default AccordionSubSection;
