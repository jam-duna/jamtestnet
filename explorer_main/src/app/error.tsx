"use client";

import React from "react";
import { NextPage, NextPageContext } from "next";
import { Container, Typography, Box, Button } from "@mui/material";

interface ErrorProps {
  statusCode?: number;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {statusCode
          ? `An error ${statusCode} occurred on the server.`
          : "An error occurred on the client."}
      </Typography>
      <Typography variant="body1" sx={{ my: 3 }}>
        Something went wrong. Please try again later or contact support if the
        problem persists.
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Box>
    </Container>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
