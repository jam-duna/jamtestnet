"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
import ServiceListItem from "@/components/home/lists/list-item/ServiceItem";
import Link from "next/link";

// Define the Service type (adjust as needed)
export type Service = {
  code_hash: string;
  balance: number;
  min_item_gas: number;
  min_memo_gas: number;
  bytes: number;
  items: number;
};

type LatestServicesProps = {
  latestServices: Service[];
};
export default function LatestServices({
  latestServices,
}: LatestServicesProps) {
  return (
    <Paper sx={{ mt: 5 }} variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Latest Services (Mock Data)
      </Typography>

      {latestServices.map((serviceItem) => (
        <ServiceListItem
          key={serviceItem.code_hash}
          serviceItem={serviceItem}
        />
      ))}

      <Link
        href={`/list/service`}
        style={{
          textDecoration: "none",
          color: "inherit",
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
        >
          View All Services
        </Typography>
      </Link>
    </Paper>
  );
}
