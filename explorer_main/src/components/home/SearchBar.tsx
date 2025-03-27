"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { db } from "@/db/db";
import { fetchBlock } from "@/hooks/home/useFetchBlock";
import { fetchState } from "@/hooks/home/useFetchState";
import { getRpcUrlFromWs } from "@/utils/ws";

interface SearchBarProps {
  wsEndpoint: string;
}

export default function SearchBar({ wsEndpoint }: SearchBarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<"hash" | "slot">("hash");
  const [openDialog, setOpenDialog] = useState(false);
  // New state for loading indicator
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = async () => {
    if (!searchValue) return;
    const rpcUrl = getRpcUrlFromWs(wsEndpoint);

    // Check IndexedDB for a matching block by headerHash
    try {
      let foundBlock;

      if (searchType === "hash")
        foundBlock = await db.blocks.get({ headerHash: searchValue });
      else if (searchType === "slot")
        foundBlock = await db.blocks
          .where("overview.slot")
          .equals(Number(searchValue))
          .first();

      if (foundBlock) {
        router.push(`/block/${searchValue}?type=${searchType}`);
        return;
      }
      router.push(`/block/${searchValue}?type=${searchType}`);
    } catch (error) {
      console.log("Error searching IndexedDB:", error);
    }

    // Show loading modal while fetching block data
    setIsFetching(true);
    try {
      const blockData = await fetchBlock(searchValue, rpcUrl, searchType);
      if (searchType === "hash") {
        // Optionally fetch state data if needed
        try {
          await fetchState(searchValue, rpcUrl);
        } catch (stateError) {
          console.error("Error fetching state data:", stateError);
        }
      }
      router.push(`/block/${searchValue}?type=${searchType}`);
    } catch (error) {
      console.error("Error fetching block data:", error);
      setOpenDialog(true);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Box display="flex" sx={{ mb: 4 }}>
      <TextField
        label="Query Block"
        size="small"
        fullWidth
        variant="outlined"
        placeholder={
          searchType === "hash"
            ? "Enter header hash..."
            : "Enter slot number..."
        }
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="search-type-label" shrink>
          Type
        </InputLabel>
        <Select
          labelId="search-type-label"
          label="Type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "hash" | "slot")}
        >
          <MenuItem value="hash">Hash</MenuItem>
          <MenuItem value="slot">Slot</MenuItem>
        </Select>
      </FormControl>

      {/* Dialog for error handling */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invalid Input</DialogTitle>
        <DialogContent>
          <Typography>
            The input you entered did not return valid block data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Loading Modal */}
      <Dialog open={isFetching}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Fetching data, please wait...</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
