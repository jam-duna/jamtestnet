"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Paper,
    Typography,
    Box,
    Link as MuiLink
} from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import { ServiceInfo } from "@/types";

interface ServiceInfoTableProps {
    serviceInfo: ServiceInfo;
}

export function ServiceInfoTable({serviceInfo} : ServiceInfoTableProps) {
    const router = useRouter();

    return (
        <Paper variant="outlined" sx={{ p: 2, marginBlock: 3 }}>
            <Typography variant="h6" mb={3} fontWeight={"bold"}>
                Service Info
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <LabeledRow
                    label="Service ID:"
                    tooltip="Service ID"
                    value={serviceInfo.service_index}
                  />
                <LabeledRow
                    label="Balance:"
                    tooltip="Account balance"
                    value={serviceInfo.balance.toString()}
                  />
                <LabeledRow
                    label="Code Hash:"
                    tooltip="Unique identifier for the service"
                    value={
                      <Typography 
                        variant="body1"
                        onClick={() =>
                          router.push(`/preimages/${serviceInfo.service_index}/${serviceInfo.code_hash}`)
                        }
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                          {serviceInfo.code_hash}
                      </Typography>
                    }
                  />
                <LabeledRow
                    label="Code Size:"
                    tooltip="Code Size"
                    value={serviceInfo.code_size.toString()}
                  />
                <LabeledRow
                    label="Min Item Gas:"
                    tooltip="Minimum gas for items"
                    value={serviceInfo.min_item_gas.toString()}
                  />
                <LabeledRow
                    label="Min Memo Gas:"
                    tooltip="Minimum gas for memo"
                    value={serviceInfo.min_memo_gas.toString()}
                  />
                <LabeledRow
                    label="Items:"
                    tooltip="Number of items"
                    value={serviceInfo.items.toString()}
                  />
                <LabeledRow
                    label="Metadata:"
                    tooltip="Metadata of service"
                    value={!!serviceInfo.metadata ? serviceInfo.metadata : "None"}
                  />
            </Box>
        </Paper>
    );
}