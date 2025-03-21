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
import { getRpcUrlFromWs } from "@/utils/ws";

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
      console.log("derive time");
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

        // Optionally handle work report fetching or show an error dialog.
        setOpenDialog(true);
      }
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter headerHash or blockHash..."
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
