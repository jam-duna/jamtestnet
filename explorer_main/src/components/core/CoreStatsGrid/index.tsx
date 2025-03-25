import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { CoreStatistics } from "@/types";

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
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {data.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ textAlign: "center", padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };