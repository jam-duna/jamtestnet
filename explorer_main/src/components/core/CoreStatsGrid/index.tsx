import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { CoreStatistics } from "@/types";
import { BorderAllRounded } from "@mui/icons-material";

export const CoreStatsGrid: React.FC<{ stats: CoreStatistics }> = ({ stats }) => {
    const data = [
      { label: "Gas Used", value: stats.gas_used },
      { label: "NumImportedSegments", value: stats.imports },
      { label: "NumExtrinsics", value: stats.extrinsic_count },
      { label: "NumBytesExtrinsics", value: stats.extrinsic_size },
      { label: "NumExportedSegments", value: stats.exports },
      { label: "TotalBundleLength", value: stats.bundle_size },
      { label: "DA Load", value: stats.da_load },
      { label: "NumAssurances", value: stats.popularity },
    ];
  
    return (
        <Box width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            >
            <Typography variant="h6" sx={{mb: 5}}>Core Statistics</Typography>
            <Grid container spacing={3} xs={9}
                sx={{
                    border: "1px solid #A0A0A0",
                    borderRadius: "5px",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                }}
                >
            {data.map((item, index) => (
                <Grid item xs={3} key={index}>
                <Box sx={{ textAlign: "center", alignItems: "center" }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        {item.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {item.value}
                    </Typography>
                </Box>
                </Grid>
            ))}
            </Grid>
      </Box>
    );
  };