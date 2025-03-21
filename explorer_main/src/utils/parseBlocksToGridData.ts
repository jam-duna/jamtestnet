export interface SquareContent {
  serviceName: string;
  workPackageHash: string;
  isBusy: boolean;
}

export function parseBlocksToGridData(blocks: any[]) {
  const data: Record<number, Record<number, SquareContent>> = {};
  const timeslots = new Set<number>();
  const cores = new Set<number>();

  for (const block of blocks) {
    const slot = block.overview.slot;
    // The extrinsic might have "guarantees" we can parse.
    const guarantees = block.extrinsic?.guarantees ?? [];

    for (const g of guarantees) {
      const coreIndex = g.report?.core_index; // e.g. 0, 1, etc.
      timeslots.add(slot);
      cores.add(coreIndex);

      const firstResult = g.report.results?.[0];
      let serviceName = "";
      if (firstResult) {
        serviceName = `svc-${firstResult.service_id}`;
      }

      const wpHash = g.report.package_spec?.hash ?? "0x???";

      // Mark the square as busy if we found a guarantee for that (core, slot)
      if (!data[coreIndex]) {
        data[coreIndex] = {};
      }
      data[coreIndex][slot] = {
        serviceName,
        workPackageHash: wpHash,
        isBusy: true,
      };
    }
  }

  // If a cell is missing, it means no guarantees => isBusy=false
  // We can fill them in with a default if needed:
  for (const c of cores) {
    for (const t of timeslots) {
      if (!data[c]) data[c] = {};
      if (!data[c][t]) {
        data[c][t] = {
          serviceName: "",
          workPackageHash: "",
          isBusy: false,
        };
      }
    }
  }

  return {
    data,
    timeslots: Array.from(timeslots).sort((a, b) => b - a), // e.g. sort descending
    cores: Array.from(cores).sort((a, b) => a - b),
  };
}
