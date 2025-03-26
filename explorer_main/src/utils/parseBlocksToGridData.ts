import { SquareContent } from "@/components/home/MainViewGrid";
import { Block, State } from "@/db/db";
import { CoreStatistics } from "@/types";

export interface GridData {
  data: Record<number, Record<number, SquareContent>>;
  timeslots: number[];
  timestamps: number[];
  cores: number[];
  coreStatistics: Record<number, Record<number, CoreStatistics>>;
}

export function parseBlocksToGridData(blocks: Block[], states: State[]): GridData {
  const grid: Record<number, Record<number, SquareContent>> = {};
  const timeslots = new Set<number>();
  const timestamps = new Set<number>();
  const cores = new Set<number>([0, 1]);
  const coreStatistics: Record<number, Record<number, CoreStatistics>> = {};

  blocks.forEach((block) => {
    const slot = block.overview?.slot;
    const timestamp = block.overview?.createdAt;
    if (typeof slot !== "number") return;
    if (typeof timestamp !== "number") return;
    timeslots.add(slot);
    timestamps.add(timestamp);
    const headerHash = block.overview?.headerHash ?? "";
    const guarantees = block.extrinsic?.guarantees ?? [];
    const validGuarantees = guarantees.filter(
      (g) => typeof g.report.core_index === "number"
    );

    if (validGuarantees.length > 0) {
      validGuarantees.forEach((g) => {
        const coreIndex = g.report.core_index;
        cores.add(coreIndex);
        const serviceName: string = String(
          g.report.results?.[0]?.service_id || ""
        );
        const wpHash = g.report.package_spec?.hash ?? "";
        const finalHash = wpHash.trim() !== "" ? wpHash : "";
        grid[coreIndex] = {
          ...grid[coreIndex],
          [timestamp]: {
            serviceName,
            workPackageHash: finalHash,
            headerHash,
            isBusy: finalHash !== "",
          },
        };
      });
    } else {
      [0, 1].forEach((defaultCore) => {
        grid[defaultCore] = {
          ...grid[defaultCore],
          [timestamp]: {
            serviceName: "",
            workPackageHash: "",
            headerHash: "",
            isBusy: false,
          },
        };
      });
    }
  });

  timestamps.forEach((timestamp) => {
    cores.forEach((coreIndex) => {
      grid[coreIndex] = grid[coreIndex] || {};
      if (!grid[coreIndex][timestamp]) {
        grid[coreIndex][timestamp] = {
          serviceName: "",
          workPackageHash: "",
          headerHash: "",
          isBusy: false,
        };
      }
    });
  });

  let coreIndex = -1;
  cores.forEach((coreValue) => {
    coreIndex ++;
    let timeslotIndex = 0;
    coreStatistics[coreValue] = {};
    timeslots.forEach((timeslotValue) => {
      try {
        coreStatistics[coreValue][timeslotValue] = states[timeslotIndex ++].pi.cores[coreIndex];
      } catch(err) {
        coreStatistics[coreValue][timeslotValue] = {
          gas_used: -1,
          imports: -1,
          extrinsic_count: -1,
          extrinsic_size: -1,
          exports: -1,
          bundle_size: -1,
          da_load: -1,
          popularity: -1,
        };
      }
    })
  })

  console.log("States: ", states);
  console.log("CoreStats: ", coreStatistics);

  return {
    data: grid,
    timeslots: Array.from(timeslots).sort((a, b) => b - a),
    timestamps: Array.from(timestamps).sort((a, b) => b - a),
    cores: Array.from(cores).sort((a, b) => a - b),
    coreStatistics,
  };
}