// src/utils/extrinsics.ts

import { BlockRecord } from "../../db";

export interface ExtrinsicCounts {
  ticketsCount: number;
  disputesCount: number;
  assurancesCount: number;
  guaranteesCount: number;
  preimagesCount: number;
  totalEvents: number;
}

/**
 * Calculates counts for the various extrinsic events.
 * @param extrinsic The extrinsic object from a block.
 * @returns An object containing individual counts and the total.
 */
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
  const totalEvents =
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
    totalEvents,
  };
}

/**
 * Filters blocks that have at least one extrinsic event.
 * @param blocks Array of BlockRecord.
 * @returns Array of BlockRecord with non-zero extrinsic events.
 */
export function filterExtrinsicBlocks(blocks: BlockRecord[]): BlockRecord[] {
  if (!blocks) return [];
  return blocks.filter((blockItem) => {
    const extrinsic = blockItem.block.extrinsic;
    if (!extrinsic) return false;
    const { totalEvents } = calculateExtrinsicCounts(extrinsic);
    return totalEvents > 0;
  });
}

/**
 * Filters blocks that have work reports (guarantees).
 * @param blocks Array of BlockRecord.
 * @returns Array of BlockRecord where extrinsic.guarantees exist.
 */
export function filterWorkReportBlocks(blocks?: BlockRecord[]): BlockRecord[] {
  if (!blocks) return [];
  return blocks.filter((blockItem) => {
    const extrinsic = blockItem.block?.extrinsic;
    return (
      extrinsic &&
      Array.isArray(extrinsic.guarantees) &&
      extrinsic.guarantees.length > 0
    );
  });
}
