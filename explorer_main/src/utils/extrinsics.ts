// src/utils/extrinsics.ts

import { Block } from "@/db/db";

export interface ExtrinsicCounts {
  ticketsCount: number;
  disputesCount: number;
  assurancesCount: number;
  guaranteesCount: number;
  preimagesCount: number;
  totalExtrinsics: number;
}

export function calculateExtrinsicCounts(extrinsic: any): ExtrinsicCounts {
  const ticketsCount = Array.isArray(extrinsic.tickets)
    ? extrinsic.tickets.length
    : 0;
  const disputesCount = extrinsic.disputes
    ? (extrinsic.disputes.verdicts?.length || 0) +
      (extrinsic.disputes.culprits?.length || 0) +
      (extrinsic.disputes.faults?.length || 0)
    : 0;
  const assurancesCount = Array.isArray(extrinsic.assurances)
    ? extrinsic.assurances.length
    : 0;
  const guaranteesCount = Array.isArray(extrinsic.guarantees)
    ? extrinsic.guarantees.length
    : 0;
  const preimagesCount = Array.isArray(extrinsic.preimages)
    ? extrinsic.preimages.length
    : 0;
  const totalExtrinsics =
    ticketsCount +
    disputesCount +
    assurancesCount +
    guaranteesCount +
    preimagesCount;
  return {
    ticketsCount,
    disputesCount,
    assurancesCount,
    guaranteesCount,
    preimagesCount,
    totalExtrinsics,
  };
}

export function filterExtrinsicBlocks(blocks: Block[]): Block[] {
  if (!blocks) return [];
  return blocks.filter((blockItem) => {
    const extrinsic = blockItem.extrinsic;
    if (!extrinsic) return false;
    const { totalExtrinsics } = calculateExtrinsicCounts(extrinsic);
    return totalExtrinsics > 0;
  });
}

export function filterWorkReportBlocks(blocks?: Block[]): Block[] {
  if (!blocks) return [];
  return blocks.filter((blockItem) => {
    const extrinsic = blockItem.extrinsic;
    return (
      extrinsic &&
      Array.isArray(extrinsic.guarantees) &&
      extrinsic.guarantees.length > 0
    );
  });
}
