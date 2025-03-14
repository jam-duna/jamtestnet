"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ marginLeft: "auto" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            EXPLORER
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
