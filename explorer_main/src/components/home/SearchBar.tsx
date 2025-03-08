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
import { fetchBlock } from "@/hooks/home/useFetchBlock";
import { fetchState } from "@/hooks/home/useFetchState";

// Helper to derive RPC URL from wsEndpoint
function getRpcUrlFromWs(wsEndpoint: string): string {
  if (wsEndpoint.startsWith("ws://")) {
    return "http://" + wsEndpoint.slice(5).replace(/\/ws$/, "/rpc");
  } else if (wsEndpoint.startsWith("wss://")) {
    return "https://" + wsEndpoint.slice(6).replace(/\/ws$/, "/rpc");
  }
  return wsEndpoint;
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

    // 1. Try fetching from IndexedDB first.
    try {
      const foundBlock = await db.blocks.get({ headerHash: searchValue });
      console.log("Found in db.blocks:", foundBlock);
      if (foundBlock) {
        // headerHash case.
        router.push(`/block/${searchValue}?type=headerHash`);
        return;
      }
    } catch (dbError) {
      // Derive the RPC URL.
      const rpcUrl = getRpcUrlFromWs(wsEndpoint);

      // 2. Try fetching as a block (blockHash case).
      try {
        let slot = 0;

        try {
          const blockData = await fetchBlock(searchValue, rpcUrl);
          console.log("Block data:", blockData);
          if (blockData) {
            // Save fetched block data into a dedicated store.
            slot = blockData.header.slot;
            await db.blocksFetchBlockHash.put({
              ...blockData,
              overview: { blockHash: searchValue, slot: blockData.header.slot },
            });
          }
        } catch (blockError) {
          console.error("Error fetching block data:", blockError);
        }

        try {
          const stateData = await fetchState(searchValue, rpcUrl);
          console.log("State data:", stateData);
          if (stateData) {
            // Save fetched block data into a dedicated store.
            await db.statesFetchBlockHash.put({
              ...stateData,
              overview: { blockHash: searchValue, slot },
            });
          }
        } catch (blockError) {
          console.error("Error fetching block data:", blockError);
        }
        router.push(`/block/${searchValue}?type=blockHash`);
      } catch (rpcBlockError) {
        console.error("Error calling jam_getBlockByHash:", rpcBlockError);

        {
          /*
          // 3. If no block data, try fetching as a work report.
        try {
          const workReportData = await callRpc(
            "jam_getWorkReportByHash",
            [searchValue],
            rpcUrl
          );
          console.log("Work report data:", workReportData);
          if (workReportData) {
            router.push(`/block/${searchValue}?type=workReport`);
            return;
          }
        } catch (rpcWorkError) {
          console.error("Error calling jam_getWorkReportByHash:", rpcWorkError);
          // 4. If neither returns valid data, show error dialog.
          setOpenDialog(true);
        }
          */
        }
      }
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
