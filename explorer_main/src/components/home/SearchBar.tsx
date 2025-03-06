"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { db } from "@/db/db"; // Adjust the import path as needed

// Helper to derive RPC URL from wsEndpoint
function getRpcUrlFromWs(wsEndpoint: string): string {
  if (wsEndpoint.startsWith("ws://")) {
    return "http://" + wsEndpoint.slice(5).replace(/\/ws$/, "/rpc");
  } else if (wsEndpoint.startsWith("wss://")) {
    return "https://" + wsEndpoint.slice(6).replace(/\/ws$/, "/rpc");
  }
  return wsEndpoint;
}

// Helper function to call a JSON-RPC method.
async function callRpc(method: string, params: any[], rpcUrl: string) {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method,
    params,
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error calling ${method}:`, err);
    return null;
  }
}

interface SearchBarProps {
  wsEndpoint: string;
}

export default function SearchBar({ wsEndpoint }: SearchBarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  async function handleSearch() {
    if (!searchValue) return;

    try {
      // 1. Try fetching from IndexedDB using headerHash.
      const foundBlock = await db.blocks.get({ headerHash: searchValue });
      console.log("Found in db.blocks:", foundBlock);
      if (foundBlock) {
        // headerHash case.
        router.push(`/block/${searchValue}?type=headerHash`);
        return;
      }

      // 2. Derive the RPC URL.
      const rpcUrl = getRpcUrlFromWs(wsEndpoint);

      // 3. Try fetching as a block (blockHash case).
      const blockData = await callRpc(
        "jam_getBlockByHash",
        [searchValue],
        rpcUrl
      );
      console.log("Block data:", blockData);
      if (blockData) {
        // Save fetched block data into a dedicated store, e.g. db.blockHashFetch.
        await db.blocksFetchBlockHash.put({
          blockHash: searchValue,
          data: blockData,
        });
        router.push(`/block/${searchValue}?type=blockHash`);
        return;
      }

      // 4. If no block data, try fetching as a work report.
      const workReportData = await callRpc(
        "jam_getWorkReportByHash",
        [searchValue],
        rpcUrl
      );
      console.log("Work report data:", workReportData);
      if (workReportData && workReportData.result) {
        router.push(`/block/${searchValue}?type=workReport`);
        return;
      }

      // 5. If neither returns valid data, show error dialog.
      setOpenDialog(true);
    } catch (error) {
      console.error("Error searching:", error);
      setOpenDialog(true);
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter headerHash, blockHash or workReportHash..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value.replace(/\s+/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invalid Hash</DialogTitle>
        <DialogContent>
          <Typography>
            The hash you entered was not found in IndexedDB, and the RPC call
            did not return valid data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
