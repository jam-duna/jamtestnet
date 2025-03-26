import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { CoreStatistics } from "@/types";
import { BorderAllRounded } from "@mui/icons-material";

export const CoreStatsGrid: React.FC<{ stats: CoreStatistics }> = ({ stats }) => {
    const data = [
      { label: "Gas Used", value: stats.gas_used },
      { label: "NumImportedSegments", value: stats.num_imported_segments },
      { label: "NumExtrinsics", value: stats.num_extrinsics },
      { label: "NumBytesExtrinsics", value: stats.num_bytes_extrinsics },
      { label: "NumExportedSegments", value: stats.num_exported_segments },
      { label: "TotalBundleLength", value: stats.total_bundle_length },
      { label: "DA Load", value: stats.throughput },
      { label: "NumAssurances", value: stats.num_assurances },
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