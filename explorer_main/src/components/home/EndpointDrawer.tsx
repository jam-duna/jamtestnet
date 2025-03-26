import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  Button,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { normalizeEndpoint } from "@/utils/ws";

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
  const cleanEndpointText = (endpoint: string) =>
    endpoint.replace(/^ws:\/\//, "").replace(/\/ws$/, "");

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customEndpoint, setCustomEndpoint] = useState<string>("");

  // New state to track connection status: "open" or "closed"
  const [connectionStatus, setConnectionStatus] = useState<
    "open" | "closed" | "onmessage"
  >("closed");

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

  useEffect(() => {
    localStorage.setItem("savedWsEndpoints", JSON.stringify(savedEndpoints));
  }, [savedEndpoints]);

  // Simulate connection status update based on wsEndpoint change
  useEffect(() => {
    // Here you should integrate your actual WebSocket connection status.
    // For now, we'll assume that if an endpoint is set, it's open.
    if (wsEndpoint) {
      setConnectionStatus("open");
    } else {
      setConnectionStatus("closed");
    }
  }, [wsEndpoint]);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSaveCustomEndpoint = () => {
    const newEndpoint = normalizeEndpoint(customEndpoint.trim());
    if (newEndpoint === "") return;

    if (newEndpoint === normalizeEndpoint(DEFAULT_WS_URL)) {
      setWsEndpoint(DEFAULT_WS_URL);
      localStorage.setItem("customWsEndpoint", DEFAULT_WS_URL);
    } else {
      setWsEndpoint(newEndpoint);
      if (!savedEndpoints.includes(newEndpoint)) {
        setSavedEndpoints([...savedEndpoints, newEndpoint]);
      }
      localStorage.setItem("customWsEndpoint", newEndpoint);
    }
    setMenuOpen(false);
    setShowCustomInput(false);
    setCustomEndpoint("");
  };

  // Define a helper function to determine the indicator color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "closed":
        return "red";
      case "open":
        return "yellow";
      case "onmessage":
        return "green";
      default:
        return "grey";
    }
  };

  return (
    <>
      <Box sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
        <IconButton onClick={handleToggleMenu}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Paper variant="outlined" sx={{ width: 250, p: 2, mt: 8 }}>
          {/* New status indicator with mini circle */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 1, mb: 2 }}>
            <Box>
              {/*
              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: "0.8rem", mr: 1 }}>
                  Status:{" "}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      bgcolor: getStatusColor(),
                      mr: 1,
                      border: "1px solid #bbb",
                    }}
                  />
                  <Typography sx={{ fontSize: "0.8rem", color: "#494848" }}>
                    {connectionStatus === "open"
                      ? "Open"
                      : connectionStatus === "onmessage"
                      ? "On Message"
                      : "Closed"}{" "}
                  </Typography>
                </Box>
              </Box>
              */}
              <Box>
                <Typography sx={{ fontSize: "0.8rem" }}>Endpoint:</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "#494848" }}>
                  {cleanEndpointText(wsEndpoint)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ ml: 1, mb: 1 }}>
            Menu
          </Typography>
          <List>
            <Tooltip title={DEFAULT_WS_URL} arrow>
              <ListItemButton
                onClick={() => {
                  setWsEndpoint(DEFAULT_WS_URL);
                  localStorage.setItem("customWsEndpoint", DEFAULT_WS_URL);
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
                <ListItemText primary="Default" />
              </ListItemButton>
            </Tooltip>
            <ListItemButton
              onClick={() => setShowCustomInput((prev) => !prev)}
              sx={{
                backgroundColor:
                  wsEndpoint !== DEFAULT_WS_URL ? "primary.light" : "inherit",
                mb: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <ListItemText primary="Custom" />
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
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedEndpoints((prev) =>
                            prev.filter((ept) => ept !== endpoint)
                          );
                          if (wsEndpoint === endpoint) {
                            setWsEndpoint(DEFAULT_WS_URL);
                            localStorage.setItem(
                              "customWsEndpoint",
                              DEFAULT_WS_URL
                            );
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
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
