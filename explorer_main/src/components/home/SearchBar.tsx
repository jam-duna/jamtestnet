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
import { db } from "../../../db"; // Adjust the import path as needed

export default function SearchBar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  async function handleSearch() {
    if (!searchValue) return;

    try {
      const foundBlock = await db.blocks.get({ headerHash: searchValue });
      if (foundBlock) {
        router.push(`/block/${searchValue}`);
      } else {
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error searching block in DB:", error);
      setOpenDialog(true);
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter headerHash..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
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
        <DialogTitle>Invalid Header Hash</DialogTitle>
        <DialogContent>
          <Typography>
            The headerHash you entered was not found in IndexedDB.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
