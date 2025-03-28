"use client";
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ my: 3 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default Custom404;
