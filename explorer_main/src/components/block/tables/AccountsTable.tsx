"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ToggleHash from "../ToggleHashText";
import { AccountItem } from "@/types";

interface AccountTableProps {
  accounts: AccountItem[];
}

export default function AccountTable({ accounts }: AccountTableProps) {
  // Track which account rows are expanded.
  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    accounts.map(() => false)
  );

  const toggleExpanded = (index: number) => {
    setExpandedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  if (!accounts || accounts.length === 0) {
    return <Typography>No accounts available.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Code Hash</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Min Item Gas</TableCell>
            <TableCell>Min Memo Gas</TableCell>
            <TableCell>Bytes</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((account, idx) => {
            const service = account.data.service;
            return (
              <React.Fragment key={account.id}>
                <TableRow hover>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>
                    <ToggleHash hash={service.code_hash} />
                  </TableCell>
                  <TableCell>{service.balance}</TableCell>
                  <TableCell>{service.min_item_gas}</TableCell>
                  <TableCell>{service.min_memo_gas}</TableCell>
                  <TableCell>{service.bytes}</TableCell>
                  <TableCell>{service.items}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpanded(idx)}>
                      {expandedStates[idx] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expandedStates[idx] && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                        {/* Preimages Section */}
                        <Typography variant="subtitle1" gutterBottom>
                          Preimages
                        </Typography>
                        {account.data.preimages &&
                        account.data.preimages.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Hash</TableCell>
                                <TableCell>Blob</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {account.data.preimages.map((preimage, pIdx) => (
                                <TableRow key={pIdx}>
                                  <TableCell>
                                    <ToggleHash hash={preimage.hash} />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {preimage.blob}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2">
                            No preimages available.
                          </Typography>
                        )}

                        {/* Lookup Meta Section */}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ mt: 2 }}
                        >
                          Lookup Meta
                        </Typography>
                        {account.data.lookup_meta &&
                        account.data.lookup_meta.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Key Hash</TableCell>
                                <TableCell>Key Length</TableCell>
                                <TableCell>Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {account.data.lookup_meta.map((lookup, lIdx) => (
                                <TableRow key={lIdx}>
                                  <TableCell>
                                    <ToggleHash hash={lookup.key.hash} />
                                  </TableCell>
                                  <TableCell>{lookup.key.length}</TableCell>
                                  <TableCell>
                                    {lookup.value.join(", ")}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2">
                            No lookup meta available.
                          </Typography>
                        )}

                        {/* Storage Section */}
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ mt: 2 }}
                        >
                          Storage
                        </Typography>
                        {account.data.storage ? (
                          <Typography variant="body2">
                            {JSON.stringify(account.data.storage)}
                          </Typography>
                        ) : (
                          <Typography variant="body2">
                            No storage available.
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
