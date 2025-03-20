"use client";

import React, { useEffect, useState } from "react";
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

// Helper function to normalize endpoints.
function normalizeEndpoint(input: string): string {
  let url = input.trim();
  // If protocol is missing, add ws://
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
    url = "ws://" + url;
  }
  try {
    const parsed = new URL(url);
    // Set pathname to '/ws' if it isn't already
    if (parsed.pathname !== "/ws") {
      parsed.pathname = "/ws";
    }
    return parsed.toString();
  } catch (error) {
    // Fallback: remove trailing slashes and add "/ws" if necessary.
    url = url.replace(/\/+$/, "");
    if (!url.endsWith("/ws")) {
      url = url + "/ws";
    }
    return url;
  }
}

export default function EndpointDrawer({
  wsEndpoint,
  setWsEndpoint,
  savedEndpoints,
  setSavedEndpoints,
}: EndpointDrawerProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customEndpoint, setCustomEndpoint] = useState<string>("");

  const defaultWsUrl = "ws://localhost:9999/ws";

  // On mount, retrieve stored values
  useEffect(() => {
    const storedEndpoint = localStorage.getItem("customWsEndpoint");
    if (storedEndpoint) {
      setWsEndpoint(storedEndpoint);
    } else {
      setWsEndpoint(defaultWsUrl);
    }
    const storedEndpoints = localStorage.getItem("savedWsEndpoints");
    if (storedEndpoints) {
      try {
        const endpointsArray = JSON.parse(storedEndpoints) as string[];
        setSavedEndpoints(endpointsArray);
      } catch (e) {
        console.error("Error parsing saved endpoints:", e);
      }
    }
  }, [setWsEndpoint, setSavedEndpoints]);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSaveCustomEndpoint = () => {
    if (customEndpoint.trim() !== "") {
      const trimmed = customEndpoint.trim();
      let newEndpoint = trimmed;
      // Prepend "ws://" if not present
      if (!/^(ws|wss):\/\//i.test(newEndpoint)) {
        newEndpoint = "ws://" + newEndpoint;
      }
      // Ensure the URL ends with "/ws"
      try {
        const url = new URL(newEndpoint);
        if (url.pathname !== "/ws") {
          url.pathname = "/ws";
        }
        newEndpoint = url.toString();
      } catch (error) {
        // Fallback: remove trailing slashes and append "/ws" if necessary.
        newEndpoint = newEndpoint.replace(/\/+$/, "");
        if (!newEndpoint.endsWith("/ws")) {
          newEndpoint = newEndpoint + "/ws";
        }
      }
      console.log("Switching to the new endpoint", newEndpoint);
      setWsEndpoint(newEndpoint);
      setSavedEndpoints((prev) =>
        prev.includes(newEndpoint) ? prev : [...prev, newEndpoint]
      );
      setMenuOpen(false);
      setShowCustomInput(false);
      setCustomEndpoint("");
    }
  };

  return (
    <>
      {/* Hamburger Menu Icon */}
      <Box sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
        <IconButton onClick={handleToggleMenu}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Paper variant="outlined" sx={{ width: 250, p: 2, mt: 10 }}>
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
                label="Custom Endpoint"
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
            </Box>
          )}
          {/* Always render saved endpoints list */}
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
                        endpoint === wsEndpoint ? "primary.light" : "inherit",
                      mb: 0.5,
                    }}
                  >
                    <ListItemText primary={endpoint} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
        </Paper>
        <Paper variant="outlined" sx={{ width: 250, p: 2 }}>
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
