import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { ServiceStatistics } from "@/types";
import { BorderAllRounded } from "@mui/icons-material";

export const ServiceStatsGrid: React.FC<{ stats: ServiceStatistics }> = ({ stats }) => {
    const data = [
      { label: "NumPreimages", value: stats.provided_count },
      { label: "NumBytesPreimages", value: stats.provided_size },
      { label: "NumResults", value: stats.refinement_count },
      { label: "RefineGasUsed", value: stats.refinement_gas_used },
      { label: "NumImportedSegments", value: stats.imports },
      { label: "NumExportedSegments", value: stats.exports },
      { label: "NumBytesExtrinsics", value: stats.extrinsic_size },
      { label: "NumExtrinsics", value: stats.extrinsic_count },
      { label: "AccumulateNumWorkReports", value: stats.accumulate_count },
      { label: "AccumulateGasUsed", value: stats.accumulate_gas_used },
      { label: "TransferNumTransfers", value: stats.on_transfers_count },
      { label: "TransferGasUsed", value: stats.on_transfers_gas_used },
    ];
  
    return (
        <Box width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            >
            <Typography variant="h6" sx={{mb: 5}}>Service Statistics</Typography>
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