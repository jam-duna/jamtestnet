"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

interface EndpointDrawerProps {
  wsEndpoint: string;
  setWsEndpoint: (endpoint: string) => void;
  savedEndpoints: string[];
  setSavedEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function EndpointDrawer({
  wsEndpoint,
  setWsEndpoint,
  savedEndpoints,
}: EndpointDrawerProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customEndpoint, setCustomEndpoint] = useState<string>("");

  const defaultWsUrl = "ws://localhost:9999/ws";

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Handler for saving a custom endpoint.
  const handleSaveCustomEndpoint = () => {
    if (customEndpoint.trim() !== "") {
      const newEndpoint = customEndpoint.trim();
      setWsEndpoint(newEndpoint);
      setMenuOpen(false);
      setShowCustomInput(false);
      setCustomEndpoint(""); // Clear input after saving.
    }
  };

  return (
    <>
      {/* Hamburger Menu Icon (toggles open/close) */}
      <Box sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
        <IconButton onClick={handleToggleMenu}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Paper variant="outlined" sx={{ width: 250, p: 2, mt: 10 }}>
          {/* Place "Menu" title with margin so it doesn't overlap */}
          <Typography variant="h6" sx={{ ml: 1, mb: 2 }}>
            Menu
          </Typography>
          <List>
            {/* Default option */}
            <ListItemButton
              onClick={() => {
                setWsEndpoint(defaultWsUrl);
                setShowCustomInput(false);
                setMenuOpen(false);
              }}
              sx={{
                backgroundColor:
                  wsEndpoint === defaultWsUrl ? "primary.light" : "inherit",
                mb: 1,
              }}
            >
              <ListItemText primary="Default" />
            </ListItemButton>

            {/* Custom option */}
            <ListItemButton
              onClick={() => setShowCustomInput(true)}
              sx={{
                backgroundColor:
                  wsEndpoint !== defaultWsUrl ? "primary.light" : "inherit",
                mb: 1,
              }}
            >
              <ListItemText primary="Custom" />
            </ListItemButton>
          </List>
          {showCustomInput && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Custom WS Endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleSaveCustomEndpoint}
              >
                Save
              </Button>
              {savedEndpoints.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Saved Endpoints
                  </Typography>
                  <List>
                    {savedEndpoints.map((endpoint) => (
                      <ListItemButton
                        key={endpoint}
                        onClick={() => {
                          setWsEndpoint(endpoint);
                          setMenuOpen(false);
                          setShowCustomInput(false);
                        }}
                        sx={{
                          backgroundColor:
                            endpoint === wsEndpoint
                              ? "primary.light"
                              : "inherit",
                          mb: 0.5,
                        }}
                      >
                        <ListItemText primary={endpoint} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </Paper>
        <Paper variant="outlined" sx={{ width: 250, p: 2 }}>
          {/* Place "Menu" title with margin so it doesn't overlap */}
          <Typography variant="h6" sx={{ ml: 1, mb: 2 }}>
            Codec
          </Typography>
          <List>
            <ListItemButton
              onClick={() => {}}
              sx={{
                backgroundColor:
                  wsEndpoint === defaultWsUrl ? "primary.light" : "inherit",
                mb: 1,
              }}
            >
              <ListItemText primary="Default" />
            </ListItemButton>
          </List>
        </Paper>
      </Drawer>
    </>
  );
}
