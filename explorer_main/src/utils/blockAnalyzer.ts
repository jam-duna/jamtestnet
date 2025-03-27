import { Block, db, State } from "@/db/db";
import { Preimage, Result, ServiceStatistics } from "@/types";
import { error } from "console";

export const sortBlocks = async () : Promise<Block[]> => {
    const data = db.blocks
        .toArray()
        .then((blocks) => {
            const sortedBlocks = blocks.sort((a, b) => {
                const aCreatedAt = a?.overview?.createdAt;
                const bCreatedAt = b?.overview?.createdAt;
                if (aCreatedAt == null && bCreatedAt == null) return 0;
                if (aCreatedAt == null) return 1;
                if (bCreatedAt == null) return -1;
                return bCreatedAt - aCreatedAt;
            });
            return sortedBlocks;
        }).catch((error) => {
            console.error("Error loading blocks from DB:", error);
            return [];
        })
    return data;
}

export const sortStates = async () : Promise<State[]>  => {
    const data =  await db.states
        .toArray()
        .then((states) => {
            const sortedStates = states.sort((a, b) => {
                const aCreatedAt = a?.overview?.createdAt;
                const bCreatedAt = b?.overview?.createdAt;
                if (aCreatedAt == null && bCreatedAt == null) return 0;
                if (aCreatedAt == null) return 1;
                if (bCreatedAt == null) return -1;
                return bCreatedAt - aCreatedAt;
            });
            return sortedStates;
        })
        .catch((error) => {
            console.error("Error loading states from DB:", error);
            return [];
        });

    return data;
}

export const filterBlocks = async(count: number) : Promise<Block[]> => {
    const sortedBlocks = await sortBlocks();
    return sortedBlocks.slice(0, count);
}

export const filterStates = async(count: number) : Promise<State[]> => {
    const sortedStates = await sortStates();
    return sortedStates.slice(0, count);
}

export const filterWorkPackages = async(coreIndex: number) : Promise<State[]> => {
    const sortedStates = await sortStates();
    const filteredStates = sortedStates.filter((state) => {
        const filteredRhos = state.rho.filter((rhoItem) => {
            return rhoItem?.report.core_index === coreIndex;
        });
        return filteredRhos !== null && filteredRhos.length > 0;
    });
    return filteredStates;
}

export const filterWorkPackagesFromService = async(serviceId: number) : Promise<State[]> => {
    const sortedStates = await sortStates();
    const filteredStates = sortedStates.filter((state) => {
        const filteredRhos = state.rho.filter((rhoItem) => {
            const filteredResults : (Result[] | undefined) = rhoItem?.report.results.filter((resultItem) => {
                return resultItem.service_id === serviceId;
            });
            return filteredResults !== undefined && filteredResults.length > 0;
        });
        return filteredRhos !== null && filteredRhos.length > 0;
    });
    return filteredStates;
}

export interface PreimageProps {
    preimage: Preimage;
    package_hash: string;
    timestamp: number;
}

export const filterPreimagesFromService = async (serviceId: number) : Promise<PreimageProps[]> => {
    let fetchedData : PreimageProps[] = [];

    const sortedBlocks = await sortBlocks();
    sortedBlocks.forEach((block) => {
        block.extrinsic.preimages.forEach((preimg) => {
            if (preimg.requester === serviceId) {
                let hashes = "";
                block.extrinsic.guarantees.forEach((guarantee) => {
                    hashes = hashes + (guarantee.report.package_spec.hash + " ");
                })
                const preimage : PreimageProps = {
                    preimage: preimg,
                    package_hash: hashes,
                    timestamp: block.overview?.createdAt || 0
                };
                fetchedData.push(preimage);
            }
        })
    })

    return fetchedData;
}

export const fetchServiceStatisticsFromId = async (serviceId: number) : Promise<ServiceStatistics | null> => {
    const sortedStates = await sortStates();

    let data : ServiceStatistics | null = null;

    sortedStates.forEach((state) => {
        if (state.pi.services === null || state.pi.services === undefined)
            return;
        Object.entries(state.pi.services).forEach(([serviceName, stats]) => {
            if (serviceName === serviceId.toString()) {
                data = stats;
                return;
            }
        });
        if (data !== null)
            return;
    });

    return data;
}