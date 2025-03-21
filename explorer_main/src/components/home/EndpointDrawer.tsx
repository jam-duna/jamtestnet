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
  Divider,
  Tooltip, // Import Tooltip here
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { normalizeEndpoint } from "@/utils/ws";
import { DEFAULT_WS_URL } from "@/utils/helper";

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
  setSavedEndpoints,
}: EndpointDrawerProps) {
  // Helper to remove "ws://" and trailing "/ws" from endpoint for display
  const cleanEndpointText = (endpoint: string) => {
    return endpoint.replace(/^ws:\/\//, "").replace(/\/ws$/, "");
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customEndpoint, setCustomEndpoint] = useState<string>("");

  // On mount, retrieve stored values
  useEffect(() => {
    const storedEndpoint = localStorage.getItem("customWsEndpoint");

    if (storedEndpoint) {
      setWsEndpoint(storedEndpoint);
    } else {
      setWsEndpoint(DEFAULT_WS_URL);
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
    console.log("User input: ", customEndpoint);

    if (customEndpoint.trim() !== "") {
      const trimmed = customEndpoint.trim();
      const newEndpoint = normalizeEndpoint(trimmed);
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
          <Typography variant="h6" sx={{ ml: 1, mb: 1 }}>
            Menu
          </Typography>
          <List>
            {/* Default option with Tooltip */}
            <Tooltip title={DEFAULT_WS_URL} arrow>
              <ListItemButton
                onClick={() => {
                  setWsEndpoint(DEFAULT_WS_URL);
                  setShowCustomInput(false);
                  setMenuOpen(false);
                }}
                sx={{
                  backgroundColor:
                    wsEndpoint === DEFAULT_WS_URL ? "primary.light" : "inherit",
                  fontSize: "0.8rem",
                  borderTop: "1px solid #eee",
                }}
              >
                <ListItemText
                  primary="Default"
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>

            {/* Custom option - toggles the input */}
            <ListItemButton
              onClick={() => setShowCustomInput((prev) => !prev)}
              sx={{
                backgroundColor:
                  wsEndpoint !== DEFAULT_WS_URL ? "primary.light" : "inherit",
                mb: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <ListItemText
                primary="Custom"
                primaryTypographyProps={{
                  sx: {
                    fontSize: "0.9rem",
                  },
                }}
              />
            </ListItemButton>
          </List>
          {showCustomInput && (
            <Box sx={{ my: 2 }}>
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

          <Divider sx={{ my: 3 }} />
          {/* Always render saved endpoints list */}
          {savedEndpoints.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
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
                        endpoint === wsEndpoint ? "primary.light" : "#fbfbfb",
                      mb: 0.5,
                      borderRadius: "3px",
                      pb: 0.5,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <ListItemText
                      primary={cleanEndpointText(endpoint)}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Drawer>
    </>
  );
}
